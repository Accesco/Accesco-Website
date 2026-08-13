"""
Accesco Living – Virtual Discovery
File Validation Module

Helpers for validating uploaded video files: extension, MIME type,
and magic-byte (file header) inspection.
"""

from app.config import config
from app.extensions import logger, MAGIC_AVAILABLE, _magic_lib


def allowed_file(filename: str) -> bool:
    """Return True if the file has an allowed extension (mp4 / mov)."""
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in config.ALLOWED_EXTENSIONS
    )


def allowed_mime(mime_type: str) -> bool:
    """Return True if the MIME type matches an allowed video type."""
    return mime_type in config.ALLOWED_MIME_TYPES


def verify_magic_bytes(file_stream) -> tuple[bool, str]:
    """
    Inspect the raw file-header bytes to confirm the upload is a
    genuine MP4 or MOV container.

    Uses python-magic (libmagic) if available, otherwise falls back
    to a manual ISO BMFF 'ftyp' byte check.
    """
    try:
        header = file_stream.read(config.MAGIC_READ_BYTES)
    finally:
        file_stream.seek(0)

    if not header:
        return False, "File appears to be empty (no readable header bytes)."

    if MAGIC_AVAILABLE:
        detected_mime = _magic_lib.from_buffer(header, mime=True)
        if detected_mime not in config.ALLOWED_MIME_TYPES:
            return (
                False,
                f"File header identifies this as '{detected_mime}', "
                f"not a valid MP4 or MOV video.",
            )
        return True, ""

    if len(header) < config.MAGIC_FTYP_OFFSET + len(config.MAGIC_FTYP_MARKER):
        return False, "File too short to be a valid MP4/MOV container."

    ftyp_slice = header[
        config.MAGIC_FTYP_OFFSET : config.MAGIC_FTYP_OFFSET + len(config.MAGIC_FTYP_MARKER)
    ]
    if ftyp_slice != config.MAGIC_FTYP_MARKER:
        return (
            False,
            "File header does not match an MP4 or MOV container signature "
            f"(expected b'ftyp' at offset 4, found {ftyp_slice!r}).",
        )

    return True, ""
