"""
Tests for the TorchServe Audio Toxicity Client.

Validates HTTP communication with the TorchServe inference container,
including success, connection error, timeout, and malformed response cases.

NOTE: The source uses aiohttp (async), so we mock aiohttp.ClientSession.
"""

import asyncio
import pytest
from unittest.mock import patch, MagicMock, AsyncMock, mock_open

import aiohttp



# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _run(coro):
    """Run an async coroutine synchronously for testing."""
    return asyncio.run(coro)


# ------------------------------------------------------------------
# Successful Inference
# ------------------------------------------------------------------

@patch("app.services.torchserve_client.config")
@patch("app.services.torchserve_client._post_with_retry")
def test_successful_inference_returns_correct_score(mock_post_retry, mock_config):
    """
    When TorchServe returns a valid 200 response with a green_flag verdict,
    the client should return the parsed result with source='torchserve'.
    """
    mock_config.TORCHSERVE_ENDPOINT = "http://localhost:8080/predictions/audio_toxicity"
    mock_config.TORCHSERVE_TIMEOUT = 30

    # _post_with_retry is async, so use AsyncMock with return_value
    mock_post_retry.return_value = [{
        "status": "green_flag",
        "confidence_score": 0.123456,
        "is_toxic": False,
    }]

    from app.services.torchserve_client import analyze_audio_spectrogram

    with patch("builtins.open", mock_open(read_data=b"\x00" * 1000)):
        result = _run(analyze_audio_spectrogram("fake_audio.wav"))

    assert result["status"] == "green_flag"
    assert result["confidence_score"] == 0.123456
    assert result["is_toxic"] is False
    assert result["source"] == "torchserve"


@patch("app.services.torchserve_client.config")
@patch("app.services.torchserve_client._post_with_retry")
def test_successful_inference_red_flag(mock_post_retry, mock_config):
    """
    When TorchServe flags audio as toxic, the client should return red_flag.
    """
    mock_config.TORCHSERVE_ENDPOINT = "http://localhost:8080/predictions/audio_toxicity"
    mock_config.TORCHSERVE_TIMEOUT = 30

    mock_post_retry.return_value = {
        "status": "red_flag",
        "confidence_score": 0.92,
        "is_toxic": True,
    }

    from app.services.torchserve_client import analyze_audio_spectrogram

    with patch("builtins.open", mock_open(read_data=b"\x00" * 1000)):
        result = _run(analyze_audio_spectrogram("fake_audio.wav"))

    assert result["status"] == "red_flag"
    assert result["confidence_score"] == 0.92

    assert result["is_toxic"] is True
    assert result["source"] == "torchserve"


# ------------------------------------------------------------------
# Connection Error (container not running)
# ------------------------------------------------------------------

@patch("app.services.torchserve_client.config")
@patch("app.services.torchserve_client._post_with_retry")
def test_connection_error_returns_failsafe(mock_post_retry, mock_config):
    """
    When TorchServe is unreachable, the client should return a fail-safe
    toxic result (score=1.0) to prevent unsafe content from being approved.
    """
    mock_config.TORCHSERVE_ENDPOINT = "http://localhost:8080/predictions/audio_toxicity"
    mock_config.TORCHSERVE_TIMEOUT = 30

    mock_post_retry.side_effect = aiohttp.ClientConnectionError("Connection refused")

    from app.services.torchserve_client import analyze_audio_spectrogram

    with patch("builtins.open", mock_open(read_data=b"\x00" * 1000)):
        result = _run(analyze_audio_spectrogram("fake_audio.wav"))

    assert result["is_toxic"] is True
    assert result["confidence_score"] == 1.0
    assert result["source"] == "torchserve_connection_error"


# ------------------------------------------------------------------
# Timeout
# ------------------------------------------------------------------

@patch("app.services.torchserve_client.config")
@patch("app.services.torchserve_client._post_with_retry")
def test_timeout_returns_failsafe(mock_post_retry, mock_config):
    """
    When the request times out, the client should return a fail-safe result.
    """
    mock_config.TORCHSERVE_ENDPOINT = "http://localhost:8080/predictions/audio_toxicity"
    mock_config.TORCHSERVE_TIMEOUT = 30

    mock_post_retry.side_effect = aiohttp.ServerTimeoutError("Request timed out")

    from app.services.torchserve_client import analyze_audio_spectrogram

    with patch("builtins.open", mock_open(read_data=b"\x00" * 1000)):
        result = _run(analyze_audio_spectrogram("fake_audio.wav"))

    assert result["is_toxic"] is True
    assert result["confidence_score"] == 1.0
    assert result["source"] == "torchserve_timeout"


# ------------------------------------------------------------------
# HTTP Error (e.g., 500 Internal Server Error)
# ------------------------------------------------------------------

@patch("app.services.torchserve_client.config")
@patch("app.services.torchserve_client._post_with_retry")
def test_http_error_returns_failsafe(mock_post_retry, mock_config):
    """
    When TorchServe returns a non-200 HTTP status, the client should
    return a fail-safe toxic result.
    """
    mock_config.TORCHSERVE_ENDPOINT = "http://localhost:8080/predictions/audio_toxicity"
    mock_config.TORCHSERVE_TIMEOUT = 30

    mock_post_retry.side_effect = aiohttp.ClientResponseError(
        request_info=MagicMock(),
        history=(),
        status=500,
        message="Internal Server Error",
    )

    from app.services.torchserve_client import analyze_audio_spectrogram

    with patch("builtins.open", mock_open(read_data=b"\x00" * 1000)):
        result = _run(analyze_audio_spectrogram("fake_audio.wav"))

    assert result["is_toxic"] is True
    assert result["confidence_score"] == 1.0
    assert result["source"] == "torchserve_http_error"
