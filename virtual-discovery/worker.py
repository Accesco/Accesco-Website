"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         Accesco Living  –  Virtual Discovery  |  Background Worker           ║
║         Video Moderation + HLS Transcoding Pipeline                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import time
import shutil
import signal
import logging
import subprocess
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

from pymongo.errors import PyMongoError

from app.config import config, setup_logging
from app.extensions import db, mongo_client

# Configure logging once
setup_logging()
logger = logging.getLogger("transcoder")

# ── OBS-3: Sentry Error Tracking ─────────────────────────────────
sentry_dsn = os.getenv("SENTRY_DSN", "")
if sentry_dsn:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=sentry_dsn,
            traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
            send_default_pii=False,
        )
        logger.info("Sentry error tracking initialized in worker.")
    except ImportError:
        logger.warning("SENTRY_DSN set but sentry-sdk not installed.")


class ModerationError(Exception):
    """Exception raised for moderation check failures."""
    pass


# ─────────────────────────────────────────────────────────────────────────────
# Database Setup — Reuse shared connection from app.extensions
# ─────────────────────────────────────────────────────────────────────────────
videos_collection = db[config.MONGO_COLLECTION_NAME]
logger.info("Worker using shared MongoDB connection from app.extensions")

# ─────────────────────────────────────────────────────────────────────────────
# Graceful Shutdown Signal Handler
# ─────────────────────────────────────────────────────────────────────────────
_shutdown_requested = False


def _handle_signal(signum, frame):
    global _shutdown_requested
    logger.info("Shutdown signal received (signal %s). Finishing current job...", signum)
    _shutdown_requested = True


signal.signal(signal.SIGTERM, _handle_signal)
signal.signal(signal.SIGINT, _handle_signal)

# ─────────────────────────────────────────────────────────────────────────────
# INFRA-4: Worker Health Check
# ─────────────────────────────────────────────────────────────────────────────
_worker_state = {
    "status": "starting",
    "current_job": None,
    "last_heartbeat": None,
    "jobs_completed": 0,
    "jobs_failed": 0,
}

HEARTBEAT_FILE = os.path.join(config.PROJECT_ROOT, "logs", "worker_heartbeat")


def _update_heartbeat(status: str = "idle", current_job: str = None):
    """Update heartbeat file and in-memory state."""
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    _worker_state["status"] = status
    _worker_state["current_job"] = current_job
    _worker_state["last_heartbeat"] = now
    try:
        os.makedirs(os.path.dirname(HEARTBEAT_FILE), exist_ok=True)
        with open(HEARTBEAT_FILE, "w") as f:
            f.write(now)
    except OSError:
        pass  # Non-critical — don't crash the worker for heartbeat failure


class _HealthHandler(BaseHTTPRequestHandler):
    """Minimal HTTP handler for worker health probes."""
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(_worker_state).encode())

    def log_message(self, format, *args):
        pass  # Suppress request logs


def _start_health_server():
    """Start a background HTTP health endpoint for container orchestrators."""
    port = int(os.getenv("WORKER_HEALTH_PORT", "5001"))
    try:
        server = HTTPServer(("0.0.0.0", port), _HealthHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        logger.info("Worker health endpoint listening on port %d", port)
    except OSError as exc:
        logger.warning("Could not start worker health server on port %d: %s", port, exc)


# ─────────────────────────────────────────────────────────────────────────────
# STOR-2: Raw file deletion configuration
# ─────────────────────────────────────────────────────────────────────────────
DELETE_RAW_AFTER_PROCESSING = os.getenv("DELETE_RAW_AFTER_PROCESSING", "1") == "1"

# ─────────────────────────────────────────────────────────────────────────────
# Transcoder Worker Loop
# ─────────────────────────────────────────────────────────────────────────────
def run_worker():
    logger.info("Transcoder worker started. Starting health server...")
    _start_health_server()

    logger.info("Pre-loading AI models...")

    # CRIT-4: Eagerly load models at boot so OOM fails fast, not mid-job
    from app.services.ai_pipeline import ModerationPipeline
    ai_pipeline = ModerationPipeline()
    ai_pipeline._initialize_models()
    logger.info("AI models loaded. Polling for pending videos...")

    # Recovery — reset documents stuck in "processing" from a previous crash
    stuck = videos_collection.update_many(
        {"moderation_status": "processing"},
        {"$set": {"moderation_status": "pending"}}
    )
    if stuck.modified_count:
        logger.warning(
            "Recovered %d documents stuck in 'processing' state from previous crash.",
            stuck.modified_count,
        )

    idle_backoff = config.WORKER_IDLE_BACKOFF_START
    max_backoff  = config.WORKER_IDLE_BACKOFF_MAX

    # Graceful shutdown — loop exits cleanly on SIGTERM/SIGINT
    while not _shutdown_requested:
        try:
            doc = videos_collection.find_one_and_update(
                {"moderation_status": "pending"},
                {"$set": {"moderation_status": "processing"}},
                sort=[("_id", 1)]
            )

            if not doc:
                time.sleep(idle_backoff)
                idle_backoff = min(idle_backoff * 2, max_backoff)
                continue

            idle_backoff = config.WORKER_IDLE_BACKOFF_START  # Reset on successful pickup

            upload_id = doc.get("upload_id")
            raw_file_path = doc.get("raw_file_path")
            doc_id = doc.get("_id")
            user_id = doc.get("user_id")

            if not upload_id or not raw_file_path:
                logger.error("Document %s missing fields. Marking rejected.", doc_id)
                videos_collection.update_one(
                    {"_id": doc_id},
                    {"$set": {"moderation_status": "rejected", "error_reason": "Missing required fields"}}
                )
                continue

            if not os.path.exists(raw_file_path):
                logger.error("Raw file missing for %s. Marking rejected.", upload_id)
                videos_collection.update_one(
                    {"_id": doc_id},
                    {"$set": {"moderation_status": "rejected", "error_reason": "Raw file not found on disk"}}
                )
                continue

            logger.info("Processing upload_id: %s", upload_id)
            _update_heartbeat(status="processing", current_job=upload_id)

            # E2E Sentry Validation: Mock a crash if a specific upload_id is passed
            if upload_id == "test-sentry-crash":
                logger.error("Simulating a crash for Sentry validation...")
                raise Exception("Mock exception for Sentry validation test.")

            # Temporary extraction directory for AI assets (Audio & Keyframes)
            extraction_dir = os.path.join(config.TMP_STORAGE_DIR, upload_id)
            os.makedirs(extraction_dir, exist_ok=True)

            # Final output directory for HLS
            processed_dir = os.path.join(config.PROCESSED_STORAGE_DIR, upload_id)

            def reject_video(reason: str):
                logger.warning("Rejecting %s: %s", upload_id, reason)
                videos_collection.update_one(
                    {"_id": doc_id},
                    {"$set": {"moderation_status": "rejected", "error_reason": reason}}
                )
                if os.path.exists(processed_dir):
                    shutil.rmtree(processed_dir, ignore_errors=True)

            try:
                # ── 1. Duration Check (with Timeout Protection) ────────────────
                logger.info("Checking duration for %s...", upload_id)
                ffprobe_command = [
                    "ffprobe", "-v", "error", "-show_entries",
                    "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
                    raw_file_path
                ]
                ffprobe_result = subprocess.run(
                    ffprobe_command, capture_output=True, text=True, check=True,
                    timeout=config.FFPROBE_TIMEOUT
                )
                duration = float(ffprobe_result.stdout.strip())

                if duration < config.MIN_VIDEO_DURATION_SEC or duration > config.MAX_VIDEO_DURATION_SEC:
                    raise ModerationError(
                        f"Video duration {duration:.1f}s is not strictly between "
                        f"{config.MIN_VIDEO_DURATION_SEC} and {config.MAX_VIDEO_DURATION_SEC} seconds."
                    )

                # ── 2. Asset Extraction (with Timeout Protection) ─────────────
                logger.info("Extracting assets for %s...", upload_id)
                audio_path = os.path.join(extraction_dir, "audio.wav")
                frames_dir = os.path.join(extraction_dir, "frames")
                os.makedirs(frames_dir, exist_ok=True)

                audio_command = [
                    "ffmpeg", "-y", "-i", raw_file_path,
                    "-vn", "-ar", "16000", "-ac", "1", audio_path
                ]
                try:
                    subprocess.run(
                        audio_command, capture_output=True, text=True, check=True,
                        timeout=config.FFMPEG_ASSET_TIMEOUT
                    )
                except subprocess.CalledProcessError:
                    logger.warning("Audio extraction failed (likely no audio track). Generating silent audio.")
                    fallback_cmd = [
                        "ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=16000:cl=mono:d={duration}",
                        audio_path
                    ]
                    subprocess.run(
                        fallback_cmd, capture_output=True, text=True, check=True,
                        timeout=config.FFMPEG_ASSET_TIMEOUT
                    )

                fps_val = 5.0 / duration
                frame_pattern = os.path.join(frames_dir, "frame_%03d.jpg")
                frame_command = [
                    "ffmpeg", "-y", "-i", raw_file_path,
                    "-vf", f"fps={fps_val}", frame_pattern
                ]
                subprocess.run(
                    frame_command, capture_output=True, text=True, check=True,
                    timeout=config.FFMPEG_ASSET_TIMEOUT
                )

                # ── 3. AI Service Layer Checks ────────────────────────────────
                logger.info("Running AI checks for %s...", upload_id)
                visual_score = ai_pipeline.analyze_visual_safety(frames_dir)
                if visual_score > config.VISUAL_SAFETY_THRESHOLD:
                    raise ModerationError("Failed visual safety check")

                audio_score = ai_pipeline.analyze_audio_toxicity_v2(audio_path)
                if audio_score > config.AUDIO_TOXICITY_THRESHOLD:
                    raise ModerationError("Failed audio toxicity check")

                sku_id = doc.get("sku_id", "default_sku")
                match_score = ai_pipeline.verify_product_match(frames_dir, sku_id)
                if match_score < config.PRODUCT_MATCH_THRESHOLD:
                    raise ModerationError("Failed product match check")

                quality_score = ai_pipeline.calculate_quality_score(frames_dir, audio_path)
                if quality_score < config.QUALITY_SCORE_THRESHOLD:
                    raise ModerationError("Failed quality score check")

                # ── 4. FFmpeg HLS Transcoding ─────────────────────────────────
                os.makedirs(processed_dir, exist_ok=True)
                master_playlist = os.path.join(processed_dir, "master.m3u8")
                segment_pattern = os.path.join(processed_dir, "segment_%03d.ts")

                ffmpeg_command = [
                    "ffmpeg", "-y", "-i", raw_file_path,
                    "-vf", "scale=-2:720", "-c:v", "libx264", "-c:a", "aac",
                    "-f", "hls", "-hls_time", "4", "-hls_playlist_type", "vod",
                    "-hls_segment_filename", segment_pattern,
                    master_playlist
                ]

                logger.info("Executing FFmpeg HLS Transcoding for %s...", upload_id)
                subprocess.run(
                    ffmpeg_command, capture_output=True, text=True, check=True,
                    timeout=config.FFMPEG_TIMEOUT
                )

                # ── 4b. Generate Thumbnail ────────────────────────────────────
                thumbnail_path = os.path.join(processed_dir, "thumb.jpg")
                thumb_command = [
                    "ffmpeg", "-y", "-i", raw_file_path,
                    "-ss", str(duration / 2),
                    "-vframes", "1",
                    "-vf", "scale=400:700:force_original_aspect_ratio=decrease",
                    thumbnail_path
                ]
                try:
                    subprocess.run(
                        thumb_command, capture_output=True, text=True, check=True,
                        timeout=30
                    )
                    thumbnail_url = f"/static/processed/{upload_id}/thumb.jpg"
                    logger.info("Thumbnail generated for %s", upload_id)
                except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
                    thumbnail_url = None
                    logger.warning("Thumbnail generation failed for %s (non-critical)", upload_id)

                # ── 5. Success: Update Document & Award Credits ───────────────
                hls_url = f"/static/processed/{upload_id}/master.m3u8"
                update_fields = {
                    "moderation_status": "approved",
                    "hls_url": hls_url,
                    "duration_seconds": round(duration, 1),
                    "moderation_scores": {
                        "visual_safety": round(visual_score, 4),
                        "audio_toxicity": round(audio_score, 4),
                        "product_match": round(match_score, 4),
                        "quality_score": quality_score,
                    },
                }
                if thumbnail_url:
                    update_fields["thumbnail_url"] = thumbnail_url

                videos_collection.update_one(
                    {"_id": doc_id},
                    {"$set": update_fields}
                )
                logger.info("Successfully transcoded %s  →  %s", upload_id, hls_url)
                _worker_state["jobs_completed"] += 1

                if user_id and doc.get("content_type") != "sponsored":
                    from app.services.ledger import award_credits
                    try:
                        award_credits(user_id, config.CREDIT_AWARD_AMOUNT, "video_approved", upload_id)
                        logger.info("Awarded %s credits to user %s for video %s",
                                    config.CREDIT_AWARD_AMOUNT, user_id, upload_id)
                    except ValueError as val_err:
                        logger.warning("Could not award credits for %s: %s", upload_id, val_err)
                    except Exception as credit_err:
                        logger.error("Failed to award credits for video %s: %s", upload_id, credit_err)

            except ModerationError as exc:
                logger.error("Moderation check failed for %s: %s", upload_id, exc)
                reject_video(str(exc))
                _worker_state["jobs_failed"] += 1

            except subprocess.TimeoutExpired as exc:
                logger.error("FFmpeg timed out for %s: %s", upload_id, exc)
                reject_video("Processing timed out (FFmpeg hung)")

            except subprocess.CalledProcessError as exc:
                logger.error("Command failed for %s. Exit code: %s", upload_id, exc.returncode)
                logger.error("Command stderr: %s", exc.stderr)
                reject_video(f"Command line processing failed: exit {exc.returncode}")

            except FileNotFoundError as exc:
                logger.error("Executable not found for %s: %s", upload_id, exc)
                reject_video(f"Missing executable (e.g., ffmpeg or ffprobe): {exc}")

            finally:
                # ── Bulletproof Asset Cleanup ─────────────────────────────────
                if os.path.exists(extraction_dir):
                    shutil.rmtree(extraction_dir, ignore_errors=True)
                    logger.info("Cleaned up extraction assets for %s", upload_id)

                # STOR-2: Only delete raw files after confirming HLS output exists.
                # If DELETE_RAW_AFTER_PROCESSING is False, raw files are preserved
                # (e.g., for S3 archival before deletion in Phase 2).
                if DELETE_RAW_AFTER_PROCESSING and os.path.exists(raw_file_path):
                    master_m3u8 = os.path.join(
                        config.PROCESSED_STORAGE_DIR, upload_id, "master.m3u8"
                    )
                    if os.path.exists(master_m3u8):
                        try:
                            os.remove(raw_file_path)
                            logger.info("Cleaned up raw file: %s", raw_file_path)
                        except OSError as cleanup_exc:
                            logger.warning("Could not delete raw file %s: %s", raw_file_path, cleanup_exc)
                    else:
                        logger.warning(
                            "Keeping raw file for %s — HLS output not found at %s",
                            upload_id, master_m3u8,
                        )

                _update_heartbeat(status="idle")

        except PyMongoError as exc:
            logger.error("MongoDB error in worker loop: %s", exc)
            time.sleep(5)
        except Exception as exc:
            logger.exception("Unexpected error processing video. Exiting for restart.")
            raise

    logger.info("Worker shutdown complete.")


if __name__ == "__main__":
    try:
        run_worker()
    except KeyboardInterrupt:
        logger.info("Transcoder worker stopped by user.")
