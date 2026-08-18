"""
Accesco Living – Virtual Discovery
Language Detection Utility

Detects the language of transcribed text to route it to the
appropriate toxicity model:
  - English       → toxic-comment-model (existing HF pipeline)
  - Hindi/Indian  → MuRIL multilingual classifier
"""

import logging

logger = logging.getLogger(__name__)


def detect_language(text: str) -> str:
    """
    Detect the primary language of the given text.

    Returns an ISO 639-1 language code (e.g., "en", "hi", "ta").
    Falls back to "en" (English) on any detection failure so the
    existing toxic-comment-model is always the safe default.
    """
    if not text or len(text.strip()) < 3:
        logger.debug("Text too short for reliable language detection, defaulting to 'en'.")
        return "en"

    try:
        from langdetect import detect
        lang = detect(text)
        logger.debug("Detected language: '%s' for text: '%.80s...'", lang, text)
        return lang
    except ImportError:
        logger.warning(
            "langdetect is not installed. Language detection unavailable — "
            "defaulting to 'en'. Install with: pip install langdetect"
        )
        return "en"
    except Exception as e:
        logger.warning("Language detection failed: %s. Defaulting to 'en'.", e)
        return "en"
