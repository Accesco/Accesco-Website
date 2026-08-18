"""
test_inference.py — End-to-End Validation Script for Audio Toxicity Inference

Sends a local WAV file to the running TorchServe container and prints
a structured verification report with round-trip latency metrics.

Usage:
    python test_inference.py
    python test_inference.py --audio path/to/custom.wav
    python test_inference.py --endpoint http://gpu-host:8080/predictions/audio_toxicity
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional

import requests

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
DEFAULT_AUDIO_PATH: str = "test_audio.wav"
DEFAULT_ENDPOINT: str = "http://localhost:8080/predictions/audio_toxicity"
REQUEST_TIMEOUT_SEC: int = 30


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for flexible test execution."""
    parser = argparse.ArgumentParser(
        description="Validate the Audio Toxicity TorchServe endpoint end-to-end.",
    )
    parser.add_argument(
        "--audio",
        type=str,
        default=DEFAULT_AUDIO_PATH,
        help=f"Path to a .wav test file (default: {DEFAULT_AUDIO_PATH})",
    )
    parser.add_argument(
        "--endpoint",
        type=str,
        default=DEFAULT_ENDPOINT,
        help=f"Inference endpoint URL (default: {DEFAULT_ENDPOINT})",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=REQUEST_TIMEOUT_SEC,
        help=f"HTTP request timeout in seconds (default: {REQUEST_TIMEOUT_SEC})",
    )
    return parser.parse_args()


def validate_audio_file(audio_path: Path) -> None:
    """Ensure the test audio file exists and is non-empty."""
    if not audio_path.exists():
        print(f"[ERROR] Audio file not found: {audio_path.resolve()}")
        print("        Place a 'test_audio.wav' file in the current directory or use --audio <path>.")
        sys.exit(1)
    if audio_path.stat().st_size == 0:
        print(f"[ERROR] Audio file is empty (0 bytes): {audio_path.resolve()}")
        sys.exit(1)


def send_inference_request(
    endpoint: str,
    audio_bytes: bytes,
    timeout: int,
) -> Dict[str, Any]:
    """
    POST raw audio bytes to the TorchServe prediction endpoint.

    Returns a dict with:
        - status_code: HTTP status
        - response_json: parsed JSON body (or None)
        - response_text: raw text body
        - latency_ms: round-trip time in milliseconds
        - error: error message if request failed
    """
    result: Dict[str, Any] = {
        "status_code": None,
        "response_json": None,
        "response_text": None,
        "latency_ms": 0.0,
        "error": None,
    }

    start = time.perf_counter()
    try:
        response = requests.post(
            endpoint,
            data=audio_bytes,
            headers={"Content-Type": "application/octet-stream"},
            timeout=timeout,
        )
        elapsed_ms = (time.perf_counter() - start) * 1000.0

        result["status_code"] = response.status_code
        result["response_text"] = response.text
        result["latency_ms"] = round(elapsed_ms, 2)

        try:
            result["response_json"] = response.json()
        except json.JSONDecodeError:
            result["response_json"] = None

    except requests.exceptions.ConnectionError:
        result["error"] = (
            "Connection refused — is the TorchServe container running? "
            f"Verify the endpoint: {endpoint}"
        )
        result["latency_ms"] = round((time.perf_counter() - start) * 1000.0, 2)

    except requests.exceptions.Timeout:
        result["error"] = f"Request timed out after {timeout}s — the model may be loading or overloaded."
        result["latency_ms"] = round((time.perf_counter() - start) * 1000.0, 2)

    except requests.exceptions.RequestException as exc:
        result["error"] = f"HTTP request failed: {exc}"
        result["latency_ms"] = round((time.perf_counter() - start) * 1000.0, 2)

    return result


def print_report(
    audio_path: Path,
    endpoint: str,
    file_size_bytes: int,
    result: Dict[str, Any],
) -> None:
    """Render a structured verification report to stdout."""
    divider = "=" * 72

    print(f"\n{divider}")
    print("  AUDIO TOXICITY INFERENCE — VERIFICATION REPORT")
    print(divider)
    print(f"  Endpoint      : {endpoint}")
    print(f"  Audio File    : {audio_path.resolve()}")
    print(f"  File Size     : {file_size_bytes:,} bytes ({file_size_bytes / 1024:.1f} KB)")
    print(f"  Latency       : {result['latency_ms']:.2f} ms")
    print(f"  HTTP Status   : {result['status_code'] or 'N/A'}")
    print(divider)

    if result["error"]:
        print(f"\n  [FAIL] {result['error']}\n")
        return

    if result["status_code"] and result["status_code"] != 200:
        print(f"\n  [FAIL] Non-200 response:")
        print(f"         {result['response_text']}\n")
        return

    # Successful response
    print("\n  [PASS] Inference returned successfully.\n")

    if result["response_json"] is not None:
        print("  Prediction Result:")
        print("  " + "-" * 40)

        predictions = result["response_json"]
        if isinstance(predictions, dict):
            predictions = [predictions]

        for idx, pred in enumerate(predictions):
            status: str = pred.get("status", "unknown")
            score: Optional[float] = pred.get("confidence_score")
            is_toxic: Optional[bool] = pred.get("is_toxic")

            icon = "🔴" if status == "red_flag" else "🟢"
            print(f"    [{idx}] {icon}  Status     : {status}")
            if score is not None:
                print(f"         Confidence : {score:.6f}")
            if is_toxic is not None:
                print(f"         Toxic      : {is_toxic}")
            print()
    else:
        print(f"  Raw Response: {result['response_text']}\n")

    print(divider)


def main() -> None:
    """Entry point — load audio, send request, print report."""
    args = parse_args()
    audio_path = Path(args.audio)
    endpoint: str = args.endpoint

    validate_audio_file(audio_path)

    file_size = audio_path.stat().st_size
    print(f"\n  Loading '{audio_path.name}' ({file_size:,} bytes) ...")

    audio_bytes: bytes = audio_path.read_bytes()

    print(f"  Sending to {endpoint} ...")
    result = send_inference_request(endpoint, audio_bytes, args.timeout)

    print_report(audio_path, endpoint, file_size, result)

    # Exit code: 0 on success, 1 on any failure
    if result["error"] or (result["status_code"] and result["status_code"] != 200):
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
