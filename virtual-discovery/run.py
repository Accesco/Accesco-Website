"""
Accesco Living – Virtual Discovery
Application Entry Point

Usage:
    Development:   python run.py
    Production:    gunicorn -c deploy/gunicorn.conf.py run:application
"""

import os
import sys
from app import create_app

application = create_app()  # 'application' is the WSGI convention name

if __name__ == "__main__":
    # ── Production Safety Guard ──────────────────────────────────────
    # Flask's built-in server is single-threaded and unsafe for production.
    # If FLASK_DEBUG is off, warn loudly and suggest gunicorn.
    if not application.config.get("DEBUG", False):
        print(
            "\n"
            "  ⚠️  WARNING: Flask development server is NOT suitable for production.\n"
            "  Use gunicorn instead:\n"
            "\n"
            "      gunicorn -c deploy/gunicorn.conf.py run:application\n"
            "\n"
            "  Starting dev server anyway (Ctrl+C to stop)...\n"
        )

    application.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=application.config.get("DEBUG", False),
    )
