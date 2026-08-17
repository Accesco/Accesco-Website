# =============================================================================
# Dockerfile — Audio Toxicity Classification Inference Service
# Multi-stage build: archive model → production runtime
# Base: Official TorchServe GPU image (CUDA + PyTorch pre-installed)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder — install archiver deps and package the .mar artifact
# ---------------------------------------------------------------------------
# Pin to a specific version for reproducible builds
FROM pytorch/torchserve:0.12.0-cpu AS builder

USER root

# System libraries required for audio I/O during archiving validation
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        libsndfile1 \
        libsndfile1-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Python dependencies for the handler
RUN pip install --no-cache-dir \
    torchaudio==2.5.1 \
    numpy==1.26.4 \
    scipy==1.14.1 \
    soundfile==0.12.1

WORKDIR /build

# Copy model artifacts and handler code
COPY model_def.py        /build/model_def.py
COPY custom_handler.py   /build/custom_handler.py
COPY model_weights.pth   /build/model_weights.pth

# Archive into a Model Archive (.mar) distribution artifact
# --model-name    : registered name on the inference endpoint
# --version       : semantic version for model versioning
# --serialized-file : trained PyTorch state_dict weights
# --handler       : custom TorchServe handler entry point
# --extra-files   : model architecture definition bundled inside the archive
# --export-path   : output directory for the .mar file
RUN torch-model-archiver \
    --model-name audio_toxicity \
    --version 1.0 \
    --serialized-file /build/model_weights.pth \
    --handler /build/custom_handler.py \
    --extra-files /build/model_def.py \
    --export-path /build/model-store \
    --force

# ---------------------------------------------------------------------------
# Stage 2: Production Runtime — lean image with only what's needed to serve
# ---------------------------------------------------------------------------
FROM pytorch/torchserve:0.12.0-cpu AS runtime

USER root

# System-level audio libraries (ffmpeg for format negotiation, libsndfile for decoding)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        libsndfile1 \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Runtime Python dependencies (match builder stage)
RUN pip install --no-cache-dir \
    torchaudio==2.5.1 \
    numpy==1.26.4 \
    scipy==1.14.1 \
    soundfile==0.12.1

# Copy the pre-built .mar artifact from the builder stage
COPY --from=builder /build/model-store /home/model-server/model-store

# Copy TorchServe configuration
COPY config.properties /home/model-server/config.properties

# Drop back to the non-root model-server user for security
USER model-server

# Expose API ports (inference, management, metrics)
EXPOSE 8080 8081 8082

# Health check — probe the inference endpoint readiness
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/ping || exit 1

# Launch TorchServe with the production config and pre-loaded model store
ENTRYPOINT ["torchserve", \
    "--start", \
    "--ncs", \
    "--ts-config", "/home/model-server/config.properties", \
    "--model-store", "/home/model-server/model-store", \
    "--models", "audio_toxicity=audio_toxicity.mar", \
    "--foreground"]
