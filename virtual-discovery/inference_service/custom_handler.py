"""
custom_handler.py — TorchServe Custom Handler for Audio Toxicity Classification

Production-grade BaseHandler subclass that processes raw audio byte streams,
computes Mel Spectrogram features, and classifies UGC audio for offensive
linguistics via a custom PyTorch network.

Author: AI Platform Engineering
"""

from __future__ import annotations

import io
import json
import logging
import os
import time
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import soundfile as sf
import torch
import torch.nn.functional as F
from ts.torch_handler.base_handler import BaseHandler

logger = logging.getLogger("audio_toxicity_handler")
logger.setLevel(getattr(logging, os.environ.get("LOG_LEVEL", "INFO").upper(), logging.INFO))


# ---------------------------------------------------------------------------
# Constants — single source of truth for audio pipeline parameters
# ---------------------------------------------------------------------------
TARGET_SAMPLE_RATE: int = 16_000
AUDIO_DURATION_SEC: float = 5.0
FIXED_LENGTH_SAMPLES: int = int(TARGET_SAMPLE_RATE * AUDIO_DURATION_SEC)  # 80 000

# Mel spectrogram hyper-parameters (must match training configuration)
N_FFT: int = 1024
HOP_LENGTH: int = 512
N_MELS: int = 128
F_MIN: float = 0.0
F_MAX: float = 8_000.0

# Classification thresholds
TOXICITY_THRESHOLD: float = 0.75

# Input validation limits
MIN_AUDIO_BYTES: int = 44           # Minimum valid WAV header size
MAX_AUDIO_DURATION_SEC: float = 300  # Reject audio longer than 5 minutes after decoding


class AudioToxicityHandler(BaseHandler):
    """
    TorchServe handler for the Audio Toxicity binary classifier.

    Lifecycle:
        initialize  → load model weights onto target device
        preprocess  → decode raw WAV bytes → resample → mono → mel spectrogram
        inference   → batched forward pass (no_grad)
        postprocess → sigmoid → threshold → JSON response
    """

    def __init__(self) -> None:
        super().__init__()
        self.model: Optional[torch.nn.Module] = None
        self.device: Optional[torch.device] = None
        self.mel_basis: Optional[torch.Tensor] = None
        self.hann_window: Optional[torch.Tensor] = None
        self._initialized: bool = False

    # ------------------------------------------------------------------
    # 1. INITIALIZATION
    # ------------------------------------------------------------------
    def initialize(self, context: Any) -> None:
        """
        Load the serialized .pth model weights and prepare the Mel
        filterbank on the target device (GPU → CPU fallback).
        """
        # Resolve device — prefer CPU; use CUDA only if explicitly available
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        if self.device.type == "cuda":
            logger.info("Handler initializing on GPU (%s)", torch.cuda.get_device_name(self.device))
        else:
            logger.info("Handler initializing on CPU (CUDA not available — safe CPU-only mode)")

        # Load model via TorchServe manifest
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir: str = properties.get("model_dir", "")

        serialized_file: Optional[str] = self.manifest.get("model", {}).get("serializedFile")
        if serialized_file is None:
            raise RuntimeError("No serializedFile found in manifest — verify .mar archive packaging")

        model_weights_path: str = os.path.join(model_dir, serialized_file)
        logger.info("Loading model weights from: %s", model_weights_path)

        # Import model architecture definition (bundled inside .mar)
        from model_def import AudioToxicityNet  # type: ignore[import-untyped]

        self.model = AudioToxicityNet()
        # Force map_location=cpu to safely load GPU-trained weights on CPU-only machines
        state_dict = torch.load(model_weights_path, map_location=torch.device("cpu"), weights_only=True)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

        # Pre-compute Mel filterbank and Hann window on device for fast spectrogram
        self.mel_basis = self._build_mel_filterbank().to(self.device)
        self.hann_window = torch.hann_window(N_FFT, device=self.device)

        self._initialized = True
        logger.info(
            "Handler initialization complete — model on %s, mel_basis shape %s",
            self.device,
            list(self.mel_basis.shape),
        )

    # ------------------------------------------------------------------
    # 2. PREPROCESS
    # ------------------------------------------------------------------
    def preprocess(self, requests: List[Dict[str, Any]]) -> torch.Tensor:
        """
        Decode each request's raw audio bytes into a batched Mel Spectrogram
        tensor of shape (B, 1, N_MELS, T).

        Steps per sample:
            1. Read raw bytes → numpy float32 waveform via soundfile
            2. Resample to TARGET_SAMPLE_RATE if needed
            3. Mix down to mono
            4. Pad or truncate to FIXED_LENGTH_SAMPLES
            5. Compute log-Mel spectrogram
        """
        batch_spectrograms: List[torch.Tensor] = []
        batch_size: int = len(requests)
        logger.debug("Preprocessing batch of %d request(s)", batch_size)

        for idx, request in enumerate(requests):
            start_ns = time.perf_counter_ns()
            try:
                raw_bytes: bytes = self._extract_audio_bytes(request)
                self._validate_audio_size(raw_bytes)
                waveform, original_sr = self._decode_audio(raw_bytes)
                self._validate_audio_duration(waveform, original_sr)
                waveform = self._resample(waveform, original_sr)
                waveform = self._to_mono(waveform)
                waveform = self._pad_or_truncate(waveform)
                mel_spec = self._compute_mel_spectrogram(waveform)
                batch_spectrograms.append(mel_spec)

                elapsed_ms = (time.perf_counter_ns() - start_ns) / 1e6
                logger.debug(
                    "Sample %d/%d preprocessed in %.2f ms (original sr=%d Hz, length=%d)",
                    idx + 1, batch_size, elapsed_ms, original_sr, waveform.shape[-1],
                )
            except Exception as exc:
                logger.error("Preprocessing failed for sample %d: %s", idx, exc, exc_info=True)
                raise ValueError(f"Audio preprocessing failed for request index {idx}: {exc}") from exc

        # Stack into (B, 1, N_MELS, T) batch tensor
        batch_tensor: torch.Tensor = torch.stack(batch_spectrograms, dim=0).to(self.device)
        logger.info("Batch tensor shape: %s, dtype: %s, device: %s", list(batch_tensor.shape), batch_tensor.dtype, batch_tensor.device)
        return batch_tensor

    # ------------------------------------------------------------------
    # 3. INFERENCE
    # ------------------------------------------------------------------
    def inference(self, batch_tensor: torch.Tensor, **kwargs: Any) -> torch.Tensor:
        """
        Forward pass under torch.no_grad() for maximum throughput.
        Returns raw logits of shape (B, num_classes) or (B, 1).
        """
        if not self._initialized or self.model is None:
            raise RuntimeError("Handler not initialized — call initialize() first")

        logger.debug("Running inference on batch shape %s", list(batch_tensor.shape))
        start_ns = time.perf_counter_ns()

        with torch.no_grad():
            logits: torch.Tensor = self.model(batch_tensor)

        elapsed_ms = (time.perf_counter_ns() - start_ns) / 1e6
        logger.info("Inference completed in %.2f ms for batch of %d", elapsed_ms, batch_tensor.shape[0])
        return logits

    # ------------------------------------------------------------------
    # 4. POSTPROCESS
    # ------------------------------------------------------------------
    def postprocess(self, logits: torch.Tensor) -> List[Dict[str, Any]]:
        """
        Convert raw logits → probabilities → thresholded verdicts.

        Returns a JSON-serializable list aligned to the incoming batch:
            [{"status": "red_flag"|"green_flag", "confidence_score": float, "is_toxic": bool}, ...]
        """
        # Handle both binary (B,1) and multi-class (B,C) output heads
        if logits.dim() == 1:
            logits = logits.unsqueeze(-1)

        if logits.shape[-1] == 1:
            # Binary classification — single logit → sigmoid
            probabilities = torch.sigmoid(logits).squeeze(-1)  # (B,)
            toxic_probs = probabilities
        else:
            # Multi-class — assume last class index is "toxic"
            probabilities = F.softmax(logits, dim=-1)
            toxic_probs = probabilities[:, -1]  # (B,)

        results: List[Dict[str, Any]] = []
        for i, toxicity_score in enumerate(toxic_probs.cpu().tolist()):
            is_toxic: bool = toxicity_score >= TOXICITY_THRESHOLD
            verdict: str = "red_flag" if is_toxic else "green_flag"
            results.append({
                "status": verdict,
                "confidence_score": round(toxicity_score, 6),
                "is_toxic": is_toxic,
            })
            logger.debug(
                "Sample %d → score=%.6f, verdict=%s",
                i, toxicity_score, verdict,
            )

        logger.info("Postprocessed %d result(s): %s", len(results), json.dumps(results, indent=None))
        return results

    # ==================================================================
    # PRIVATE HELPERS
    # ==================================================================

    @staticmethod
    def _extract_audio_bytes(request: Dict[str, Any]) -> bytes:
        """Extract raw audio bytes from a TorchServe request object."""
        body = request.get("body") or request.get("data")
        if body is None:
            raise ValueError("Request contains no 'body' or 'data' field")
        if isinstance(body, (bytearray, memoryview)):
            return bytes(body)
        if isinstance(body, bytes):
            return body
        raise TypeError(f"Unsupported request body type: {type(body).__name__}")

    @staticmethod
    def _validate_audio_size(raw_bytes: bytes) -> None:
        """Reject payloads too small to be a valid audio file."""
        if len(raw_bytes) < MIN_AUDIO_BYTES:
            raise ValueError(
                f"Audio payload too small ({len(raw_bytes)} bytes); "
                f"minimum is {MIN_AUDIO_BYTES} bytes"
            )

    @staticmethod
    def _validate_audio_duration(waveform: np.ndarray, sample_rate: int) -> None:
        """Reject audio that exceeds the maximum allowed duration after decoding."""
        num_samples = waveform.shape[0]
        duration_sec = num_samples / sample_rate
        if duration_sec > MAX_AUDIO_DURATION_SEC:
            raise ValueError(
                f"Audio duration {duration_sec:.1f}s exceeds maximum "
                f"allowed {MAX_AUDIO_DURATION_SEC}s"
            )

    @staticmethod
    def _decode_audio(raw_bytes: bytes) -> Tuple[np.ndarray, int]:
        """
        Decode raw audio bytes into a float32 numpy array via soundfile.
        Returns (waveform, sample_rate) where waveform shape is (num_samples,)
        or (num_samples, num_channels).
        """
        buffer = io.BytesIO(raw_bytes)
        try:
            waveform, sample_rate = sf.read(buffer, dtype="float32", always_2d=False)
        except Exception as exc:
            raise ValueError(
                f"Failed to decode audio bytes ({len(raw_bytes)} bytes): {exc}"
            ) from exc
        if waveform.size == 0:
            raise ValueError("Decoded audio is empty (zero samples)")
        return waveform, int(sample_rate)

    @staticmethod
    def _resample(waveform: np.ndarray, original_sr: int) -> np.ndarray:
        """Resample to TARGET_SAMPLE_RATE using scipy's polyphase resampler."""
        if original_sr == TARGET_SAMPLE_RATE:
            return waveform
        # Lazy import: scipy is heavy and only needed when sample rate differs
        from scipy.signal import resample_poly
        import math

        gcd = math.gcd(TARGET_SAMPLE_RATE, original_sr)
        up = TARGET_SAMPLE_RATE // gcd
        down = original_sr // gcd
        logger.debug("Resampling %d Hz → %d Hz (up=%d, down=%d)", original_sr, TARGET_SAMPLE_RATE, up, down)
        resampled: np.ndarray = resample_poly(waveform, up, down, axis=0).astype(np.float32)
        return resampled

    @staticmethod
    def _to_mono(waveform: np.ndarray) -> np.ndarray:
        """Convert multi-channel audio to mono by averaging channels."""
        if waveform.ndim == 1:
            return waveform
        # shape: (num_samples, num_channels) → average across channels
        return waveform.mean(axis=-1).astype(np.float32)

    @staticmethod
    def _pad_or_truncate(waveform: np.ndarray) -> np.ndarray:
        """Enforce fixed length of FIXED_LENGTH_SAMPLES via zero-pad or truncation."""
        current_length = waveform.shape[0]
        if current_length >= FIXED_LENGTH_SAMPLES:
            return waveform[:FIXED_LENGTH_SAMPLES]
        # Zero-pad at the tail
        padding = np.zeros(FIXED_LENGTH_SAMPLES - current_length, dtype=np.float32)
        return np.concatenate([waveform, padding], axis=0)

    def _compute_mel_spectrogram(self, waveform: np.ndarray) -> torch.Tensor:
        """
        Compute a log-scaled Mel spectrogram via manual STFT + Mel filterbank.

        Returns tensor of shape (1, N_MELS, T) suitable for CNN input.
        """
        signal = torch.from_numpy(waveform).to(self.device)

        # STFT → (freq_bins, time_frames) complex tensor
        stft = torch.stft(
            signal,
            n_fft=N_FFT,
            hop_length=HOP_LENGTH,
            win_length=N_FFT,
            window=self.hann_window,
            center=True,
            pad_mode="reflect",
            normalized=False,
            onesided=True,
            return_complex=True,
        )
        # Power spectrogram
        power_spec = stft.abs().pow(2)  # (n_fft//2 + 1, T)

        # Apply Mel filterbank: (N_MELS, n_fft//2+1) @ (n_fft//2+1, T) → (N_MELS, T)
        mel_spec = torch.matmul(self.mel_basis, power_spec)

        # Log scaling with numerical stability floor
        log_mel = torch.log(mel_spec.clamp(min=1e-9))

        # Add channel dimension → (1, N_MELS, T)
        return log_mel.unsqueeze(0)

    @staticmethod
    def _build_mel_filterbank() -> torch.Tensor:
        """
        Construct a Mel-scale triangular filterbank matrix of shape
        (N_MELS, N_FFT // 2 + 1).
        """
        def _hz_to_mel(freq: float) -> float:
            return 2595.0 * np.log10(1.0 + freq / 700.0)

        def _mel_to_hz(mel: float) -> float:
            return 700.0 * (10.0 ** (mel / 2595.0) - 1.0)

        n_freqs = N_FFT // 2 + 1
        mel_min = _hz_to_mel(F_MIN)
        mel_max = _hz_to_mel(F_MAX)

        mel_points = np.linspace(mel_min, mel_max, N_MELS + 2)
        hz_points = np.array([_mel_to_hz(m) for m in mel_points])
        bin_indices = np.floor((N_FFT + 1) * hz_points / TARGET_SAMPLE_RATE).astype(int)

        filterbank = np.zeros((N_MELS, n_freqs), dtype=np.float32)
        for i in range(N_MELS):
            left = bin_indices[i]
            center = bin_indices[i + 1]
            right = bin_indices[i + 2]

            # Rising slope
            for j in range(left, center):
                if center != left:
                    filterbank[i, j] = (j - left) / (center - left)
            # Falling slope
            for j in range(center, right):
                if right != center:
                    filterbank[i, j] = (right - j) / (right - center)

        return torch.from_numpy(filterbank)
