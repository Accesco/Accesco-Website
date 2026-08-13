# Accesco Living – Virtual Discovery

Backend API platform for a TikTok-style short-video commerce experience. Creators upload UGC (User-Generated Content) product review videos, which go through an AI-powered moderation pipeline before appearing in a scrollable discovery feed.

## Tech Stack

| Layer | Technology |
|---|---|
| Web Framework | Flask 3.0.3 |
| Database | MongoDB Atlas (PyMongo 4.7.2) |
| Authentication | JWT (PyJWT, HS256) |
| AI/ML | Hugging Face Transformers, PyTorch, Whisper, CLIP |
| Video Processing | FFmpeg / FFprobe |
| ML Serving | TorchServe (Docker) |

## Quick Start

### 1. Clone & Setup Environment

```bash
git clone <repository-url>
cd ACCESCO_LIVING

python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# For production, ensure MONGO_TLS_CA_FILE points to a valid certificate bundle
# (e.g., /etc/ssl/certs/ca-certificates.crt)
```

### 3. Initialize Database

```bash
# Create MongoDB indexes
flask --app run:application setup-db

# (Optional) Seed test products
python -m scripts.seed_inventory
```

### 4. Run the Application

```bash
# Terminal 1: Start the API server
python run.py

# Terminal 2: Start the background worker
python worker.py
```

The API is now available at `http://localhost:5000`.

### 5. Test the API

```bash
# Generate a test JWT token
python -m scripts.generate_test_token

# Run the test suite
pytest tests/ -v
```

## Project Structure

```
ACCESCO_LIVING/
├── app/                      # Application package
│   ├── __init__.py           # Flask application factory
│   ├── config.py             # Centralized settings
│   ├── extensions.py         # MongoDB connection, logger
│   ├── auth.py               # JWT authentication decorator
│   ├── validators.py         # File validation helpers
│   ├── routes/               # API endpoints
│   │   ├── discovery.py      # Upload, Feed, Events APIs
│   │   ├── cart.py           # Swipe-to-cart API
│   │   └── creator.py        # Creator wallet API
│   ├── services/             # Business logic
│   │   ├── ai_pipeline.py    # AI moderation (NSFW, toxicity, CLIP)
│   │   └── ledger.py         # Credits ledger with monthly cap
│   └── utils/
│       └── cqs.py            # Creator Quality Score bands
├── worker.py                 # Background video processing worker
├── run.py                    # Application entry point
├── tests/                    # Test suite
├── scripts/                  # Dev/ops utility scripts
├── deploy/                   # Deployment configs (PM2, Supervisord, Gunicorn)
├── inference_service/        # TorchServe audio toxicity microservice
├── storage/                  # Local file storage (raw, processed, tmp)
├── requirements.txt          # Python dependencies
└── .env.example              # Environment variable template
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/health` | GET | No | Health check |
| `/api/v1/discovery/upload` | POST | JWT | Upload a UGC video |
| `/api/v1/discovery/feed` | GET | JWT | Paginated discovery feed |
| `/api/v1/discovery/events` | POST | JWT | Track user interaction events |
| `/api/v1/cart/add` | POST | JWT | Add product to cart |
| `/api/v1/creator/wallet` | GET | JWT | Creator wallet & balance |
| `/api/v1/brand/register` | POST | Admin Key | Register a brand account |
| `/api/v1/brand/upload` | POST | Brand JWT | Upload a sponsored ad video |
| `/api/v1/brand/campaigns` | GET/POST | Brand JWT | Manage ad campaigns |
| `/api/v1/brand/analytics/overview` | GET | Brand JWT | View ad campaign metrics |

## Production Deployment

### Docker Optimization (TorchServe)

When running the TorchServe container in production, use a volume mount for the model weights to keep the Docker image lightweight:
```bash
docker run -d --name accesco-torchserve -p 8080:8080 \
  -v ./inference_service/models:/home/model-server/models \
  accesco-audio-toxicity:latest
```

```bash
# Using Gunicorn (Linux)
gunicorn -c deploy/gunicorn.conf.py run:application

# Using PM2 (cross-platform)
pm2 start deploy/ecosystem.config.js

# Using Supervisord (Linux)
supervisord -c deploy/supervisord.conf
```

## License

Proprietary – Accesco Living
