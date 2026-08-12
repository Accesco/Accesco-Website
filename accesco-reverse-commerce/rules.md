# Accesco Reverse Commerce — Development Rules

## What to Use
- **YOLOv8 (Ultralytics)** for grading/detection — no other vision framework
- **FastAPI** for the inference service (same stack as the chatbot's ML server)
- **Google Colab** for training (free GPU) + **Weights & Biases** for tracking
- **Firebase Storage** for photo uploads; **Firestore** for events and decisions
- **Rules engine in plain Python** (`rules.py`) — no framework, easily testable
- Fixture-based test suite (CSV with expected decision/grade per fixture photo)
- Model weights pinned by version; promote only after the suite passes

## What to Avoid
- No LLM/API-based grading (OpenAI, Claude, Gemini) — vision model only, no
  per-image token cost or latency
- No heavyweight models (YOLOv8x, RT-DETR large, segmentation-per-class) —
  must run on Cloud Run CPU for v1; move to GPU only if latency forces it
- No one giant multi-vertical model — one model per vertical keeps data and
  precision manageable
- No auto-decision at low confidence (< 0.7) — always human review
- No AI sign-off on food-safety — sanitization remains a manual hard gate
- No cloud-only dependencies that block local dev (Colab for training is fine;
  grading API must run locally without a GPU)
- No direct writes to the Next.js app's source — integration via API routes
  and fire-and-forget notify hooks only

## Error Handling
- `POST /grade` returns `202 queued` for processing; no payload, image required,
  wrong category → 4xx with a clear message
- Model load failure / missing weights → `/health` reports `model: unavailable`,
  `/grade` returns 503 — app falls back to the review queue
- Confidence < 0.7 → `{decision: "review"}` with the image pushed to
  `review_queue` — grader app prompts a human
- Damaged/soiled detection on food packaging → hard-recycle regardless of grade
- `/feedback` accepts corrections even on graded items — they only append,
  never mutate the original `return_event` (audit trail)
- Suite failures block model promotion, not the running service

## Boundaries for AI
- Do NOT modify any files inside the `Accesco/` Next.js directory except the
  pre-agreed integration points (an API route + a notify hook)
- Do NOT commit training photos, weights, or labeled datasets — kept in
  `data/` and `models/` and gitignored; share via Firebase Storage / W&B
- The AI never deletes or refunds anything — it only produces
  `{grade, confidence, flags, decision}`; money movement stays in the app
- Category gate always wins over model output — if a category is "No" in the
  SKU framework, no grade is ever emitted for it