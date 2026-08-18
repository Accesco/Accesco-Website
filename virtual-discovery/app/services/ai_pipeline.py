import os
import glob
import logging

from PIL import Image
from transformers import pipeline

from app.config import config

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# AI Moderation Pipeline – Real Hugging Face Inference
# ─────────────────────────────────────────────────────────────────────────────
# Models are loaded once via the singleton pattern and cached in RAM so that
# subsequent calls pay only inference cost, not model-loading cost.
# ─────────────────────────────────────────────────────────────────────────────


class ModerationPipeline:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModerationPipeline, cls).__new__(cls)
            cls._instance._models_loaded = False
        return cls._instance

    # ── 1. Singleton Model Initialization ──────────────────────────────────
    def _initialize_models(self):
        """Load all Hugging Face pipelines once on first use."""
        if self._models_loaded:
            return

        logger.info("Loading Hugging Face models into RAM (first boot)…")

        # Visual Safety – NSFW image classification
        self._visual_safety_pipeline = pipeline(
            "image-classification",
            model="Falconsai/nsfw_image_detection",
        )

        # Audio Toxicity – Speech-to-text then toxic-comment classification
        self._asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-tiny",
        )
        self._toxicity_pipeline = pipeline(
            "text-classification",
            model="martin-ha/toxic-comment-model",
        )

        # Product Match – Zero-shot image classification via CLIP
        self._product_match_pipeline = pipeline(
            "zero-shot-image-classification",
            model="openai/clip-vit-base-patch32",
        )

        self._models_loaded = True
        logger.info("All models loaded successfully.")

    # ── 2. Inference Methods ───────────────────────────────────────────────

    def analyze_visual_safety(self, frames_dir: str) -> float:
        """
        Iterate through extracted .jpg frames and return the highest NSFW
        confidence score found.

        Returns a confidence score for explicit content (0.0 to 1.0).
        Fails if > threshold (default 0.85).

        On error, returns 1.0 (fail-safe: reject the video).
        """
        import concurrent.futures
        INFERENCE_TIMEOUT_SECONDS = 30

        try:
            self._initialize_models()

            frame_paths = sorted(glob.glob(os.path.join(frames_dir, "*.jpg")))
            if not frame_paths:
                logger.warning("No .jpg frames found in %s", frames_dir)
                return 1.0  # fail-safe – no frames means we can't verify

            max_nsfw_score = 0.0

            for frame_path in frame_paths:
                # SCALE-4 FIX: Per-frame timeout to prevent infinite hangs
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(self._classify_single_frame, frame_path)
                    try:
                        score = future.result(timeout=INFERENCE_TIMEOUT_SECONDS)
                        max_nsfw_score = max(max_nsfw_score, score)
                    except concurrent.futures.TimeoutError:
                        logger.error(
                            "Frame inference timed out after %ds for %s",
                            INFERENCE_TIMEOUT_SECONDS,
                            frame_path,
                        )
                        return 1.0  # fail-safe – reject video on timeout

            logger.info(
                "Visual safety analysis complete – max NSFW score: %.4f",
                max_nsfw_score,
            )
            return max_nsfw_score

        except Exception as e:
            logger.error("Visual safety analysis failed: %s", e, exc_info=True)
            return 1.0  # fail-safe – reject video on error

    def _classify_single_frame(self, frame_path: str) -> float:
        """Classify a single frame and return its NSFW score."""
        image = Image.open(frame_path).convert("RGB")
        results = self._visual_safety_pipeline(image)
        for entry in results:
            if entry["label"].lower() == "nsfw":
                return entry["score"]
        return 0.0

    def analyze_audio_toxicity(self, audio_path: str) -> float:
        """
        Transcribe the .wav file to text via Whisper, then classify
        toxicity via the toxic-comment model.

        Returns a toxicity score (0.0 to 1.0).
        Fails if > threshold (default 0.3).

        On error, returns 1.0 (fail-safe: reject the video).
        """
        try:
            self._initialize_models()

            # Step 1 – Transcribe audio to text
            transcription_result = self._asr_pipeline(audio_path)
            transcript = transcription_result.get("text", "").strip()

            if not transcript:
                logger.info("Audio transcription is empty – returning 0.0")
                return 0.0

            logger.info("Transcript: %s", transcript[:200])

            # Step 2 – Classify toxicity of the transcript
            toxicity_results = self._toxicity_pipeline(transcript)
            # results: [{"label": "toxic" | "non-toxic", "score": float}]
            result = toxicity_results[0]

            if result["label"].lower() == "toxic":
                toxicity_score = result["score"]
            else:
                # "non-toxic" label – invert to get toxic probability
                toxicity_score = 1.0 - result["score"]

            logger.info("Audio toxicity score: %.4f", toxicity_score)
            return toxicity_score

        except Exception as e:
            logger.error("Audio toxicity analysis failed: %s", e, exc_info=True)
            return 1.0  # fail-safe – reject video on error

    def verify_product_match(self, frames_dir: str, sku_id: str) -> float:
        """
        Grab the middle frame and use CLIP zero-shot classification to
        compare the image against candidate labels.

        Returns the confidence score for the sku_id label (0.0 to 1.0).
        Fails if < threshold (default 0.70).

        On error, returns 0.0 (fail-safe: reject the video for no match).
        """
        try:
            self._initialize_models()

            frame_paths = sorted(glob.glob(os.path.join(frames_dir, "*.jpg")))
            if not frame_paths:
                logger.warning("No .jpg frames found in %s", frames_dir)
                return 0.0  # fail-safe – can't verify without frames

            # Pick the middle frame
            middle_index = len(frame_paths) // 2
            middle_frame_path = frame_paths[middle_index]
            image = Image.open(middle_frame_path).convert("RGB")

            candidate_labels = [sku_id, "generic background", "empty room"]
            results = self._product_match_pipeline(
                image, candidate_labels=candidate_labels
            )
            # results: [{"label": str, "score": float}, ...] sorted by score desc
            for entry in results:
                if entry["label"] == sku_id:
                    match_score = entry["score"]
                    logger.info(
                        "Product match score for '%s': %.4f", sku_id, match_score
                    )
                    return match_score

            logger.warning("SKU label '%s' not found in CLIP results", sku_id)
            return 0.0

        except Exception as e:
            logger.error("Product match verification failed: %s", e, exc_info=True)
            return 0.0  # fail-safe – reject video for no match

    def calculate_quality_score(self, frames_path: str, audio_path: str) -> int:
        """
        Returns a baseline quality score.

        Heavy OpenCV-based quality analysis is deferred; this returns a
        fixed baseline of 85 for now.
        """
        logger.info("Quality score: returning baseline 85 (OpenCV deferred)")
        return 85

    # ── Enhanced Audio Toxicity (v2) ───────────────────────────────────────

    def analyze_audio_toxicity_v2(self, audio_path: str) -> float:
        """
        Enhanced audio toxicity analysis with multilingual support
        and optional TorchServe spectrogram analysis.

        Pipeline:
            1. [Optional] TorchServe spectrogram analysis (raw audio level)
            2. Whisper transcription → text
            3. Language detection → route to correct text classifier
            4. Route: English → toxic-comment-model, Hindi/Indian → MuRIL
            5. Aggregate: fail if ANY check exceeds its threshold

        Returns the highest toxicity score found (0.0 to 1.0).
        On error, returns 1.0 (fail-safe: reject the video).
        """
        import asyncio

        def _run_text_pipeline():
            self._initialize_models()
            transcription_result = self._asr_pipeline(audio_path)
            transcript = transcription_result.get("text", "").strip()

            if not transcript:
                logger.info("Audio transcription is empty.")
                return 0.0

            logger.info("Transcript (first 200 chars): %s", transcript[:200])

            from app.utils.language_detect import detect_language
            detected_lang = detect_language(transcript)
            logger.info("Detected language: '%s'", detected_lang)

            if config.MURIL_ENABLED and detected_lang in config.MURIL_SUPPORTED_LANGUAGES:
                logger.info("Routing to MuRIL classifier (detected_lang='%s')", detected_lang)
                from app.services.muril_classifier import MuRILClassifierService
                muril = MuRILClassifierService()
                result = muril.classify(transcript)
                text_toxicity = result["hate_probability"]
                logger.info(
                    "MuRIL hate_probability: %.4f (threshold: %.2f)",
                    text_toxicity, config.MURIL_TOXICITY_THRESHOLD,
                )
            else:
                logger.info(
                    "Routing to English toxic-comment-model (detected_lang='%s')",
                    detected_lang,
                )
                toxicity_results = self._toxicity_pipeline(transcript)
                result = toxicity_results[0]
                if result["label"].lower() == "toxic":
                    text_toxicity = result["score"]
                else:
                    text_toxicity = 1.0 - result["score"]
                logger.info("English text toxicity score: %.4f", text_toxicity)

            return text_toxicity

        async def _run_concurrently():
            tasks = []
            
            if config.TORCHSERVE_ENABLED:
                from app.services.torchserve_client import analyze_audio_spectrogram
                tasks.append(analyze_audio_spectrogram(audio_path))
            else:
                async def _dummy(): return {"confidence_score": 0.0}
                tasks.append(_dummy())

            tasks.append(asyncio.to_thread(_run_text_pipeline))

            ts_result, text_toxicity = await asyncio.gather(*tasks)

            max_toxicity = 0.0

            if config.TORCHSERVE_ENABLED:
                spectrogram_score = ts_result.get("confidence_score", 0.0)
                logger.info(
                    "TorchServe spectrogram toxicity score: %.4f (threshold: %.2f)",
                    spectrogram_score, config.AUDIO_SPECTROGRAM_TOXICITY_THRESHOLD,
                )
                if spectrogram_score > config.AUDIO_SPECTROGRAM_TOXICITY_THRESHOLD:
                    logger.warning(
                        "TorchServe flagged audio as toxic (score=%.4f > threshold=%.2f). "
                        "Early exit — rejecting video.",
                        spectrogram_score, config.AUDIO_SPECTROGRAM_TOXICITY_THRESHOLD,
                    )
                    return spectrogram_score
                max_toxicity = max(max_toxicity, spectrogram_score)

            max_toxicity = max(max_toxicity, text_toxicity)
            
            logger.info(
                "Final aggregated audio toxicity score: %.4f (threshold: %.2f)",
                max_toxicity, config.AUDIO_TOXICITY_THRESHOLD,
            )
            return max_toxicity

        try:
            return asyncio.run(_run_concurrently())
        except Exception as e:
            logger.error(
                "Enhanced audio toxicity analysis (v2) failed: %s", e, exc_info=True
            )
            return 1.0  # fail-safe — reject video on error
