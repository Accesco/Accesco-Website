# Accesco Chatbot — Memory & Progress

## Current Status

| Phase | Status | File |
|---|---|---|
| Phase 1: Data Preparation | ✅ Completed | `chatbot-ml/data/preprocess.py` |
| Phase 2: Model Training | ⏳ Waiting for FAQ data | — |
| Phase 3: Inference Server | ✅ Completed | `chatbot-ml/inference/app.py` |
| Phase 4: Frontend Integration | ⏳ Not started | — |

## Phase 1 — Completed

- [x] Parsed SKU Master xlsx → `chatbot-ml/data/product_catalog.json` (10,711 products)
- [x] Parsed SKU Recovery PDF → `chatbot-ml/data/recovery_framework.json` (19 recovery rows, 25 text chunks)
- [x] Built FAISS product index → `chatbot-ml/models/product_index.faiss` + `product_ids.pkl`

### Commands

```bash
# Run Phase 1 preprocessing (parse data + build FAISS index)
python3 accesco-chatbot/chatbot-ml/data/preprocess.py

# Start the inference server
cd accesco-chatbot/chatbot-ml/inference && python3 -m uvicorn app:app --port 8000

# Test endpoints via browser UI
# Open http://localhost:8000/docs in your browser — Swagger UI with clickable test forms

# Or test via terminal
curl http://localhost:8000/health
curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d '{"text": "Amul milk", "top_k": 3}'
curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"text": "I want milk", "top_k": 3}'
```

## Phase 3 — Completed

- [x] FastAPI server with `/health`, `/predict`, `/search`, `/chat` endpoints
- [x] FAISS product search working — tested with "Amul milk" → correct results
- [x] `/predict` returns placeholder intent (will be replaced with DistilBERT after FAQ arrives)

## Phase 2 — Pending

Waiting for FAQ data to arrive before starting intent classifier training.

## How to Update This File

After completing each phase, mark it as ✅ Completed and update the Current Status table.
