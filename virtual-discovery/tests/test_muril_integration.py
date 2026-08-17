"""
Tests for the MuRIL Multilingual Hate Speech Classifier integration
and the language detection routing logic.

Validates:
  - MuRIL classifier with mocked model
  - Language detection utility
  - Routing: Hindi → MuRIL, English → toxic-comment-model
  - Error handling: model not found, classification failure
"""

import sys
import pytest
from unittest.mock import patch, MagicMock


# ══════════════════════════════════════════════════════════════════
# Language Detection Tests
# ══════════════════════════════════════════════════════════════════

class TestLanguageDetection:
    """Tests for app.utils.language_detect.detect_language()."""

    def test_english_text_detected(self):
        """English text should return 'en'."""
        from app.utils.language_detect import detect_language
        result = detect_language("This is a perfectly normal English sentence about products.")
        assert result == "en"

    def test_empty_text_defaults_to_english(self):
        """Empty or very short text should default to 'en'."""
        from app.utils.language_detect import detect_language
        assert detect_language("") == "en"
        assert detect_language("  ") == "en"
        assert detect_language("ab") == "en"

    def test_none_text_defaults_to_english(self):
        """None input should default to 'en' without crashing."""
        from app.utils.language_detect import detect_language
        # The function checks `if not text`, so None should be handled
        assert detect_language(None) == "en"

    def test_hindi_text_detected(self):
        """Hindi text should return 'hi'."""
        from app.utils.language_detect import detect_language
        # Use a long, unambiguous Hindi passage for reliable detection
        hindi_text = (
            "यह एक हिंदी वाक्य है जो उत्पाद समीक्षा के बारे में है। "
            "यह उत्पाद बहुत अच्छा है और मुझे इसकी गुणवत्ता पसंद आई। "
            "मैं इसे अपने दोस्तों को भी सुझाऊंगा।"
        )
        result = detect_language(hindi_text)
        assert result == "hi"

    def test_detection_failure_defaults_to_english(self):
        """If langdetect throws an exception, should default to 'en'."""
        from app.utils.language_detect import detect_language
        # Patch langdetect.detect (the library function imported inside detect_language)
        with patch("langdetect.detect", side_effect=Exception("Detection error")):
            result = detect_language("Some text that causes an error")
            assert result == "en"


# ══════════════════════════════════════════════════════════════════
# MuRIL Classifier Tests
# ══════════════════════════════════════════════════════════════════

class TestMuRILClassifier:
    """Tests for app.services.muril_classifier.MuRILClassifierService."""

    def _get_fresh_service(self):
        """Import MuRILClassifierService and reset the singleton."""
        from app.services.muril_classifier import MuRILClassifierService
        MuRILClassifierService._instance = None
        return MuRILClassifierService

    def test_model_not_found_raises_error(self):
        """
        When the model directory doesn't exist, loading should raise
        FileNotFoundError with a helpful message.
        """
        # Mock torch in sys.modules so `import torch` inside load() succeeds
        mock_torch = MagicMock()
        mock_transformers = MagicMock()
        with patch.dict(sys.modules, {"torch": mock_torch, "transformers": mock_transformers}):
            MuRILClassifierService = self._get_fresh_service()

            with patch("app.services.muril_classifier.config") as mock_config:
                mock_config.MURIL_MODEL_DIR = "/nonexistent/path/to/muril"

                service = MuRILClassifierService()
                with pytest.raises(FileNotFoundError, match="MuRIL model not found"):
                    service.load()

            # Clean up singleton
            MuRILClassifierService._instance = None

    def test_classify_hindi_hate_speech(self):
        """
        Given a Hindi hate speech text, the classifier should return
        label='hate' with a high hate_probability.
        """
        import math

        mock_torch = MagicMock()
        mock_transformers = MagicMock()

        # Create realistic tensor mocks
        # Logits: [0.1, 2.5] → softmax → [~0.083, ~0.917]
        e_01 = math.exp(0.1)
        e_25 = math.exp(2.5)
        total = e_01 + e_25
        prob_nonhate = e_01 / total  # ~0.083
        prob_hate = e_25 / total     # ~0.917

        # Mock softmax result
        mock_probs_row = MagicMock()
        mock_probs_row.__getitem__ = lambda self, idx: MagicMock(item=lambda: prob_hate if idx == 1 else prob_nonhate)
        mock_probs = MagicMock()
        mock_probs.__getitem__ = lambda self, idx: mock_probs_row

        mock_torch.softmax.return_value = mock_probs
        mock_torch.argmax.return_value = MagicMock(item=lambda: 1)  # predicts "hate"
        mock_torch.device.return_value = "cpu"
        mock_torch.cuda.is_available.return_value = False
        mock_torch.no_grad.return_value.__enter__ = MagicMock()
        mock_torch.no_grad.return_value.__exit__ = MagicMock(return_value=False)

        # Mock tokenizer
        mock_tokenizer = MagicMock()
        mock_tokenizer.return_value = {
            "input_ids": MagicMock(),
            "attention_mask": MagicMock(),
        }
        for v in mock_tokenizer.return_value.values():
            v.to = MagicMock(return_value=v)

        # Mock model
        mock_model = MagicMock()
        mock_logits = MagicMock()
        mock_model.return_value = MagicMock(logits=mock_logits)
        mock_model.eval = MagicMock()
        mock_model.to = MagicMock(return_value=mock_model)

        # Wire up transformers mocks
        mock_AutoTokenizer = MagicMock()
        mock_AutoTokenizer.from_pretrained.return_value = mock_tokenizer
        mock_AutoModel = MagicMock()
        mock_AutoModel.from_pretrained.return_value = mock_model

        mock_transformers.AutoTokenizer = mock_AutoTokenizer
        mock_transformers.AutoModelForSequenceClassification = mock_AutoModel

        with patch.dict(sys.modules, {"torch": mock_torch, "transformers": mock_transformers}):
            MuRILClassifierService = self._get_fresh_service()

            with patch("app.services.muril_classifier.config") as mock_config, \
                 patch("app.services.muril_classifier.os.path.exists", return_value=True):
                mock_config.MURIL_MODEL_DIR = "/fake/muril/model"

                service = MuRILClassifierService()
                result = service.classify("यह एक नफरत भरा वाक्य है")

            assert result["label"] == "hate"
            assert result["hate_probability"] > 0.5
            assert result["source"] == "muril"
            assert 0.0 <= result["score"] <= 1.0

            MuRILClassifierService._instance = None

    def test_classify_hindi_nonhate_speech(self):
        """
        Given a benign Hindi text, the classifier should return
        label='nonhate' with a low hate_probability.
        """
        import math

        mock_torch = MagicMock()
        mock_transformers = MagicMock()

        # Logits: [3.0, -1.0] → softmax → [~0.982, ~0.018]
        e_30 = math.exp(3.0)
        e_m1 = math.exp(-1.0)
        total = e_30 + e_m1
        prob_nonhate = e_30 / total  # ~0.982
        prob_hate = e_m1 / total     # ~0.018

        mock_probs_row = MagicMock()
        mock_probs_row.__getitem__ = lambda self, idx: MagicMock(item=lambda: prob_hate if idx == 1 else prob_nonhate)
        mock_probs = MagicMock()
        mock_probs.__getitem__ = lambda self, idx: mock_probs_row

        mock_torch.softmax.return_value = mock_probs
        mock_torch.argmax.return_value = MagicMock(item=lambda: 0)  # predicts "nonhate"
        mock_torch.device.return_value = "cpu"
        mock_torch.cuda.is_available.return_value = False
        mock_torch.no_grad.return_value.__enter__ = MagicMock()
        mock_torch.no_grad.return_value.__exit__ = MagicMock(return_value=False)

        # Mock tokenizer
        mock_tokenizer = MagicMock()
        mock_tokenizer.return_value = {
            "input_ids": MagicMock(),
            "attention_mask": MagicMock(),
        }
        for v in mock_tokenizer.return_value.values():
            v.to = MagicMock(return_value=v)

        # Mock model
        mock_model = MagicMock()
        mock_logits = MagicMock()
        mock_model.return_value = MagicMock(logits=mock_logits)
        mock_model.eval = MagicMock()
        mock_model.to = MagicMock(return_value=mock_model)

        # Wire up transformers mocks
        mock_AutoTokenizer = MagicMock()
        mock_AutoTokenizer.from_pretrained.return_value = mock_tokenizer
        mock_AutoModel = MagicMock()
        mock_AutoModel.from_pretrained.return_value = mock_model

        mock_transformers.AutoTokenizer = mock_AutoTokenizer
        mock_transformers.AutoModelForSequenceClassification = mock_AutoModel

        with patch.dict(sys.modules, {"torch": mock_torch, "transformers": mock_transformers}):
            MuRILClassifierService = self._get_fresh_service()

            with patch("app.services.muril_classifier.config") as mock_config, \
                 patch("app.services.muril_classifier.os.path.exists", return_value=True):
                mock_config.MURIL_MODEL_DIR = "/fake/muril/model"

                service = MuRILClassifierService()
                result = service.classify("यह एक अच्छा उत्पाद है")

            assert result["label"] == "nonhate"
            assert result["hate_probability"] < 0.5
            assert result["source"] == "muril"

            MuRILClassifierService._instance = None

    def test_classify_error_returns_failsafe(self):
        """
        When an unexpected error occurs during classification, the service
        should return a fail-safe hate result to prevent unsafe content.
        """
        mock_torch = MagicMock()
        mock_transformers = MagicMock()

        # Make AutoTokenizer.from_pretrained raise to trigger error path
        mock_AutoTokenizer = MagicMock()
        mock_AutoTokenizer.from_pretrained.side_effect = RuntimeError("Model loading crashed")
        mock_transformers.AutoTokenizer = mock_AutoTokenizer
        mock_transformers.AutoModelForSequenceClassification = MagicMock()

        with patch.dict(sys.modules, {"torch": mock_torch, "transformers": mock_transformers}):
            MuRILClassifierService = self._get_fresh_service()

            with patch("app.services.muril_classifier.config") as mock_config, \
                 patch("app.services.muril_classifier.os.path.exists", return_value=True):
                mock_config.MURIL_MODEL_DIR = "/fake/muril/model"

                service = MuRILClassifierService()
                result = service.classify("Some text")

            assert result["label"] == "hate"
            assert result["hate_probability"] == 1.0
            assert result["source"] == "muril_error"

            MuRILClassifierService._instance = None


# ══════════════════════════════════════════════════════════════════
# Routing Integration Tests
# ══════════════════════════════════════════════════════════════════

class TestAudioToxicityRouting:
    """Tests for the v2 audio toxicity routing logic in ai_pipeline.py."""

    @patch("app.services.ai_pipeline.config")
    def test_v2_falls_back_to_english_when_both_disabled(self, mock_config):
        """
        When both TORCHSERVE_ENABLED=False and MURIL_ENABLED=False,
        the v2 method should behave identically to v1 (English-only).
        """
        mock_config.TORCHSERVE_ENABLED = False
        mock_config.MURIL_ENABLED = False
        mock_config.AUDIO_TOXICITY_THRESHOLD = 0.3

        from app.services.ai_pipeline import ModerationPipeline

        pipeline = ModerationPipeline.__new__(ModerationPipeline)
        pipeline._models_loaded = True

        # Mock ASR and toxicity pipelines
        pipeline._asr_pipeline = MagicMock(return_value={"text": "This is a test"})
        pipeline._toxicity_pipeline = MagicMock(return_value=[{
            "label": "non-toxic",
            "score": 0.95,
        }])

        score = pipeline.analyze_audio_toxicity_v2("fake_audio.wav")

        # non-toxic score 0.95 → toxicity = 1.0 - 0.95 = 0.05
        assert score == pytest.approx(0.05, abs=0.01)
        pipeline._toxicity_pipeline.assert_called_once()

    @patch("app.services.ai_pipeline.config")
    def test_v2_routes_hindi_to_muril(self, mock_config):
        """
        When MuRIL is enabled and language is detected as Hindi,
        the transcript should be routed to MuRIL, not toxic-comment-model.
        """
        mock_config.TORCHSERVE_ENABLED = False
        mock_config.MURIL_ENABLED = True
        mock_config.MURIL_SUPPORTED_LANGUAGES = {"hi", "ta"}
        mock_config.MURIL_TOXICITY_THRESHOLD = 0.5
        mock_config.AUDIO_TOXICITY_THRESHOLD = 0.3

        from app.services.ai_pipeline import ModerationPipeline

        pipeline = ModerationPipeline.__new__(ModerationPipeline)
        pipeline._models_loaded = True
        pipeline._asr_pipeline = MagicMock(return_value={"text": "हिंदी टेक्स्ट"})
        pipeline._toxicity_pipeline = MagicMock()  # Should NOT be called

        with patch("app.utils.language_detect.detect_language", return_value="hi"), \
             patch("app.services.muril_classifier.MuRILClassifierService") as MockMuRIL:
            mock_muril_instance = MagicMock()
            mock_muril_instance.classify.return_value = {
                "label": "nonhate",
                "score": 0.9,
                "hate_probability": 0.1,
                "source": "muril",
            }
            MockMuRIL.return_value = mock_muril_instance

            score = pipeline.analyze_audio_toxicity_v2("fake_audio.wav")

        assert score == pytest.approx(0.1, abs=0.01)
        mock_muril_instance.classify.assert_called_once()
        pipeline._toxicity_pipeline.assert_not_called()  # English model skipped

    @patch("app.services.ai_pipeline.config")
    def test_v2_empty_transcript_returns_zero(self, mock_config):
        """
        When the Whisper transcript is empty (no speech detected),
        the method should return 0.0 (or the TorchServe score if enabled).
        """
        mock_config.TORCHSERVE_ENABLED = False
        mock_config.MURIL_ENABLED = False
        mock_config.AUDIO_TOXICITY_THRESHOLD = 0.3

        from app.services.ai_pipeline import ModerationPipeline

        pipeline = ModerationPipeline.__new__(ModerationPipeline)
        pipeline._models_loaded = True
        pipeline._asr_pipeline = MagicMock(return_value={"text": ""})

        score = pipeline.analyze_audio_toxicity_v2("fake_audio.wav")
        assert score == 0.0
