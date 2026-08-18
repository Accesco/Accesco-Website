"""
Gunicorn configuration for production deployment.

Usage:
    gunicorn -c deploy/gunicorn.conf.py run:application
"""

import multiprocessing

# Bind to all interfaces on port 5000
bind = "0.0.0.0:5000"

# Workers = (2 × CPU cores) + 1 — optimal for I/O-bound apps
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gthread"
threads = 4  # Thread-based concurrency — safe with asyncio.run() in worker

# Timeout — generous for video uploads
timeout = 120
graceful_timeout = 30

# Logging
accesslog = "-"  # stdout
errorlog = "-"   # stderr
loglevel = "info"

# Security — limit request sizes
limit_request_line = 8190
limit_request_fields = 100

# Memory leak protection — recycle workers after N requests.
# AI models (NSFW, Whisper, CLIP, toxic-comment) consume 2-4 GB RAM.
# Without recycling, workers may accumulate leaked memory until OOM.
max_requests = 500
max_requests_jitter = 50
