# Accesco Chatbot — Memory & Progress

## Current Status

| Phase | Status | File |
|---|---|---|
| Phase 1: Data Preparation | ✅ Completed | `chatbot-ml/data/preprocess.py` |
| Phase 2: Model Training | ✅ Completed | `chatbot-ml/train/train_classifier.py` |
| Phase 3: Inference Server | ✅ Completed | `chatbot-ml/inference/app.py` |
| Phase 4: Frontend Integration | ⏳ Not started | — |

## Phase 1 — Completed

- [x] Parsed SKU Master xlsx → `chatbot-ml/data/product_catalog.json` (10,711 products)
- [x] Parsed SKU Recovery PDF → `chatbot-ml/data/recovery_framework.json` (19 recovery rows, 25 text chunks)
- [x] Built FAISS product index → `chatbot-ml/models/product_index.faiss` + `product_ids.pkl`

## Phase 2 — Completed

- [x] Extracted 296 Q&A pairs from `mergedFAQs.pdf` → `chatbot-ml/data/faq_data.json`
- [x] Auto-labeled intents with keyword rules → `chatbot-ml/data/faq_labeled.csv` (18 intents, 304 rows incl. 8 manual greeting examples)
- [x] Trained DistilBERT classifier (manual loop, class weights for imbalance, 8 epochs)
      → `chatbot-ml/models/intent_model/` + `label_map.json`
      Train acc 0.938 | Eval acc 0.738
- [x] NOTE: Trainer API produced a degenerate model (predicted only majority class) —
      manual training loop with class weights was the fix
- [x] Verified classifier: greeting, waitlist, grokly, instastyle, returns, privacy,
      xpense, referral, delivery, circular all classify correctly in isolation

### Commands

```bash
# Extract FAQ Q&A pairs from PDFs (only needed when new FAQ data arrives)
python3 accesco-chatbot/chatbot-ml/data/extract_faq.py

# Re-label FAQ data after extracting new pairs
python3 accesco-chatbot/chatbot-ml/data/label_faqs.py

# Retrain intent classifier (optional epochs arg, default 8)
python3 accesco-chatbot/chatbot-ml/train/train_classifier.py 8
```

## Phase 3 — Completed

- [x] FastAPI server with `/health`, `/predict`, `/search`, `/chat` endpoints
- [x] `/chat` pipeline: DistilBERT intent → optional FAISS product search → templated reply
- [x] Real DistilBERT intent classifier wired in (`classify_intent`, threshold 0.30)
- [x] Keyword fallback for low-confidence queries (e.g. "do you deliver to my area?" → delivery_order)
- [x] Products only attached for product-relevant intents (grocery/food/fashion/pharmacy/unknown)

### Known macOS fix — OpenMP thread conflict

FAISS + PyTorch both use OpenMP; running both on macOS hangs (was an MPS/CPU
mismatch earlier, but the real hang was FAISS `search()` after torch loaded).
Fixed in `app.py` top: `OMP_NUM_THREADS=1`, `MKL_NUM_THREADS=1`,
`torch.set_num_threads(1)`.

### Commands

```bash
# Start the inference server
cd accesco-chatbot/chatbot-ml/inference && python3 -m uvicorn app:app --port 8000

# Test endpoints via browser UI
# Open http://localhost:8000/docs in your browser — Swagger UI with clickable test forms

# Or test via terminal
curl http://localhost:8000/health
curl -X POST http://localhost:8000/search -H "Content-Type: application/json" -d '{"text": "Amul milk", "top_k": 3}'
curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"text": "I want milk", "top_k": 3}'
```

### Verified test results (latest)

| Query | Intent | Products |
|---|---|---|
| hello | greeting (0.57) | none |
| How do I join the waitlist? | waitlist_launch (0.74) | none |
| What is Grokly? | grokly_grocery (0.36) | 3 |
| Is my data safe? | privacy_security (0.55) | none |
| Amul milk | grokly_grocery | Amul Kool Flavoured Milk ✓ |
| How much does milk cost? | grokly_grocery | milk products ✓ |
| Do you deliver to my area? | delivery_order (fallback) | none |

## Phase 4 — Pending

Not started. Target: `Accesco/app/components/AccescoInlineChatbot.jsx` (existing
rule-based widget) — point it at the FastAPI `/chat` endpoint.

## Known Open Questions / Decisions

- Buy-redirect button SKIPPED for now (SKU Master xlsx has no product URLs) —
  revisit in Phase 4 if product detail pages get URLs
- No venv; use `python3` with global site-packages (Python 3.14)

## How to Update This File

After completing each phase, mark it as ✅ Completed and update the Current Status table.
