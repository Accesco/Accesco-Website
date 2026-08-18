# ─────────────────────────────────────────────────────────────────────────────
# Accesco Living – Virtual Discovery | Dockerfile
# Multi-stage build for the Flask API + background worker
#
# Build:   docker build -t accesco-living .
# Run API: docker run -p 5000:5000 --env-file .env accesco-living
# Run Worker: docker run --env-file .env accesco-living python worker.py
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Base image with system dependencies ────────────────────────────
FROM python:3.11-slim AS base

# Install FFmpeg (video processing) and libmagic (file-type validation)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser

WORKDIR /app

# ── Stage 2: Install Python dependencies ────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# ── Stage 3: Copy application code ─────────────────────────────────────────
COPY . .

# Create storage directories (will typically be volume-mounted in production)
RUN mkdir -p storage/raw storage/processed storage/tmp logs && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the API port
EXPOSE 5000

# Health check — hit the /health endpoint every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

# Default: run the Flask API via Gunicorn
CMD ["gunicorn", "-c", "deploy/gunicorn.conf.py", "run:application"]
