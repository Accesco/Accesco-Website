"""
Accesco Living – Virtual Discovery
MuRIL Multilingual Hate Speech Classifier

Loads the fine-tuned Google MuRIL model and classifies transcribed text
in Hindi and other Indian languages as hate/non-hate.

The model is trained via the Multilingual-Speech-Moderation subproject:
    cd Multilingual-Speech-Moderation && python root/train.py

After training, the model weights are saved to:
    Multilingual-Speech-Moderation/models/muril_classifier/

This service wraps that trained model for in-process inference inside
the background worker's moderation pipeline.
"""

import os
import logging

from app.config import config

logger = logging.getLogger(__name__)

# Label mapping — must match Multilingual-Speech-Moderation/root/config.py
_ID2LABEL = {0: "nonhate", 1: "hate"}
_MAX_LENGTH = 128


class MuRILClassifierService:
    """
    Singleton wrapper around the fine-tuned MuRIL model.

    The model is loaded lazily on first call and cached in memory
    so subsequent calls only pay inference cost.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._loaded = False
        return cls._instance

    def load(self):
        """Load the fine-tuned MuRIL model from disk (once)."""
        if self._loaded:
            return

        import torch
        from transformers import AutoTokenizer, AutoModelForSequenceClassification

        model_dir = config.MURIL_MODEL_DIR
        if not os.path.exists(model_dir):
            raise FileNotFoundError(
                f"MuRIL model not found at '{model_dir}'. "
                "Train the model first by running:\n"
                "  cd Multilingual-Speech-Moderation && python root/train.py"
            )

        logger.info("Loading MuRIL model from '%s'...", model_dir)
        self._tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self._model = AutoModelForSequenceClassification.from_pretrained(model_dir)
        self._device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._model.to(self._device)
        self._model.eval()
        self._loaded = True
        logger.info("MuRIL model loaded successfully on %s.", self._device)

    def classify(self, text: str) -> dict:
        """
        Classify text as hate or non-hate speech.

        Args:
            text: Transcribed text in Hindi or another supported Indian language.

        Returns:
            dict with keys:
                - label            (str)  : "hate" or "nonhate"
                - score            (float): confidence for the predicted label
                - hate_probability (float): probability of the hate class specifically
                - source           (str)  : always "muril"

        On error, returns a fail-safe result marking text as hate
        to prevent unsafe content from being approved.
        """
        try:
            self.load()
            import torch

            inputs = self._tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding="max_length",
                max_length=_MAX_LENGTH,
            )
            inputs = {k: v.to(self._device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self._model(**inputs)
                probabilities = torch.softmax(outputs.logits, dim=1)

                # Index 0 = nonhate, Index 1 = hate
                hate_prob = probabilities[0][1].item()
                prediction = torch.argmax(probabilities, dim=1).item()

                label = _ID2LABEL[prediction]
                confidence = probabilities[0][prediction].item()

            logger.info(
                "MuRIL classification: label='%s'  confidence=%.4f  hate_probability=%.4f",
                label, confidence, hate_prob,
            )

            return {
                "label": label,
                "score": confidence,
                "hate_probability": hate_prob,
                "source": "muril",
            }

        except FileNotFoundError:
            # Re-raise — caller should see this as a configuration error
            raise

        except Exception as e:
            logger.error("MuRIL classification failed: %s", e, exc_info=True)
            # Fail-safe: mark as hate to prevent unsafe content approval
            return {
                "label": "hate",
                "score": 1.0,
                "hate_probability": 1.0,
                "source": "muril_error",
            }
