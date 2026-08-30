"""
Accesco Living – Virtual Discovery
TorchServe Audio Toxicity Client

Sends raw WAV audio bytes to the TorchServe inference endpoint
(Docker container running custom_handler.py) and returns the
spectrogram-based toxicity score.

This operates at the raw-audio level — it detects toxic audio
patterns (tone, shouting, slurs) from Mel spectrograms without
needing text transcription. Complements the text-based pipeline.
"""

import logging
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.config import config

logger = logging.getLogger(__name__)


def _fail_safe(source: str) -> dict:
    """Return a fail-safe toxic result — reject the video on any error."""
    return {
        "is_toxic": True,
        "confidence_score": 1.0,
        "status": "red_flag",
        "source": source,
    }


# Retries up to 3 times on connection errors or timeouts, waiting 1s, 2s, then giving up.
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=4),
    retry=retry_if_exception_type((aiohttp.ClientError, TimeoutError)),
    reraise=True,
)
async def _post_with_retry(audio_bytes: bytes) -> dict:
    async with aiohttp.ClientSession() as session:
        timeout = aiohttp.ClientTimeout(total=config.TORCHSERVE_TIMEOUT)
        async with session.post(
            config.TORCHSERVE_ENDPOINT,
            data=audio_bytes,
            headers={"Content-Type": "application/octet-stream"},
            timeout=timeout,
        ) as response:
            response.raise_for_status()
            result = await response.json()
            return result


async def analyze_audio_spectrogram(audio_path: str) -> dict:
    """
    Send an audio file to TorchServe for spectrogram-level toxicity analysis asynchronously.

    Reads the WAV file and POSTs raw bytes to the TorchServe prediction
    endpoint. The handler on the other end computes a Mel spectrogram and
    runs it through a binary classifier (AudioToxicityNet).

    Returns:
        dict with keys:
            - is_toxic     (bool)  : True if confidence >= threshold
            - confidence_score (float) : 0.0–1.0 toxicity confidence
            - status       (str)  : "red_flag" or "green_flag"
            - source       (str)  : always "torchserve" (or error variant)

    On any error, returns a **fail-safe toxic result** (confidence=1.0)
    so the video is rejected rather than approved with an unknown score.
    """
    try:
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()

        logger.info(
            "Sending %d bytes to TorchServe endpoint: %s",
            len(audio_bytes),
            config.TORCHSERVE_ENDPOINT,
        )

        result = await _post_with_retry(audio_bytes)

        # TorchServe postprocess returns a list; take the first element
        if isinstance(result, list):
            result = result[0]

        logger.info(
            "TorchServe audio toxicity: status=%s  confidence_score=%.4f",
            result.get("status"),
            result.get("confidence_score", 0.0),
        )
        result["source"] = "torchserve"
        return result

    except (aiohttp.ServerTimeoutError, TimeoutError):
        logger.error(
            "TorchServe request timed out after %ds. "
            "The model may be loading or the container is overloaded.",
            config.TORCHSERVE_TIMEOUT,
        )
        return _fail_safe("torchserve_timeout")

    except aiohttp.ClientConnectionError:
        logger.error(
            "TorchServe is not reachable at %s. "
            "Is the Docker container running? Start with: "
            "docker run -p 8080:8080 accesco-audio-toxicity:latest",
            config.TORCHSERVE_ENDPOINT,
        )
        return _fail_safe("torchserve_connection_error")


    except aiohttp.ClientResponseError as e:
        logger.error(
            "TorchServe returned HTTP error: %s",
            e.status,
        )
        return _fail_safe("torchserve_http_error")

    except Exception as e:
        logger.error("TorchServe client unexpected error: %s", e, exc_info=True)
        return _fail_safe("torchserve_error")
