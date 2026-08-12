# Accesco Reverse Commerce — Architecture

## App Flow

```
Seller / Rider / Hub
      │  photo capture + upload (Firebase Storage)
      ▼
POST /grade ──► FastAPI (Cloud Run, Mumbai)
                  │  YOLOv8 inference → grade A/B/C/Reject + damage flags
                  ▼
              rules.py (hard gates first)
                  │  food-safety gate (Swadisht)
                  │  category "No-return" gate (SKU framework)
                  │  confidence < 0.7 → review queue
                  │  grade + category → decision
                  ▼
         {decision, grade, confidence, action}
                  │
                  ▼
        Firestore writes: return_events, resale_listings,
                          review_queue, incentive credits
                  │
                  ▼
   Existing Next.js app (Grokly / Swadisht / InstaStyle)
   shows outcome — reuse credit, payout, listing, review prompt
```

The grading service is **stateless**: image in → JSON out. All business logic
lives in `rules.py` (testable without the model). The Next.js app owns UI and
wallets; Firestore is the single source of truth.

## Folder & File Structure

```
accesco-reverse-commerce/
├── grading-api/                    # FastAPI service (Cloud Run)
│   ├── app.py                      # POST /grade, /feedback, GET /health
│   ├── rules.py                    # rules engine (hard gates, grade→decision)
│   ├── model_loader.py             # pinned YOLO weights, model version
│   ├── classes.py                  # category allowlist + reject set
│   ├── requirements.txt
│   └── test_grade_suite.py         # fixture-based E2E suite (like chatbot runner)
├── training/                       # Colab scripts (free GPU)
│   ├── train_yolo.py               # ultralytics YOLOv8s/m training, W&B logging
│   ├── export_labels.py            # Firestore feedback → training dataset
│   └── evaluate.py                 # holdout metrics, confusion matrix
├── data/                           # (photographs gitignored)
│   ├── labels/                     # label files / class config
│   └── category_config.json        # grade→price %, reuse/resell rules per category
├── models/                         # trained weights (GITIGNORED)
│   └── latest.pt                   # promoted weight, versioned via W&B
├── integration/                    # thin hooks that touch the Next.js app
│   └── notifyGrading.js            # fire-and-forget notify (pattern: notifyChatbot.js)
├── prd.md
├── architecture.md
├── rules.md
├── phases.md
└── design.md
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| AI Model | YOLOv8 (Ultralytics) — one classifier per vertical (grokly/swadisht/instastyle) |
| Backend | FastAPI (Python) |
| Training | Google Colab (free GPU) |
| Deployment | Google Cloud Run (Mumbai region) |
| Storage | Firebase Storage (photos) + Firestore (events, listings, queue) |
| MLOps | Weights & Biases |
| Frontend | Existing Next.js app (`Accesco/`) — only via API routes + notify hooks |
| Auth | Existing Firebase Auth session |

## Key Design Decisions

- **Inference only in ML service** — rules engine is a pure module, unit-tested
- **Confidence floor 0.7** — below it goes to `review_queue`, never auto-decided
- **Food-safety hard gate** — Swadisht containers can only be "reuse" after the
  sanitization flag is set; AI approval alone is never sufficient
- **Category gate** — categories marked "No" in the SKU framework (food-soiled
  wrappers, biomedical waste) are filtered before grading
- **Atomic model promotion** — `/grade` loads pinned weights; new versions are
  tested via the fixture suite before promotion
- **Active learning** — `/feedback` corrections persist to Firestore, weekly
  export into Colab retraining