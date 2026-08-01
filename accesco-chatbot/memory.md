# Accesco Chatbot — Memory & Progress

## Current Status

| Phase | Status | File |
|---|---|---|
| Phase 1: Data Preparation | ✅ Completed | `chatbot-ml/data/preprocess.py` |
| Phase 2: Model Training | ✅ Completed | `chatbot-ml/train/train_classifier.py` |
| Phase 3: Inference Server | ✅ Completed | `chatbot-ml/inference/app.py` |
| Phase 4: Frontend Integration | 🧪 Tested (temporary UI wiring, REVERTED after testing) | `Accesco/app/components/AccescoInlineChatbot.jsx` |
| Phase 3.5: Delivery Coverage Lookup | ✅ Completed | `chatbot-ml/data/build_delivery_coverage.py` + `app.py` |

## Phase 1 — Completed

- [x] Parsed SKU Master xlsx → `chatbot-ml/data/product_catalog.json` (10,711 products)
- [x] Parsed SKU Recovery PDF → `chatbot-ml/data/recovery_framework.json` (19 recovery rows, 25 text chunks)
- [x] Built FAISS product index → `chatbot-ml/models/product_index.faiss` + `product_ids.pkl`

## Phase 2 — Completed

- [x] Extracted 296 Q&A pairs from `mergedFAQs.pdf` → `chatbot-ml/data/faq_data.json` (gitignored)
- [x] Auto-labeled intents with keyword rules → `chatbot-ml/data/faq_labeled.csv` (18 intents, 304 rows incl. 8 manual greeting examples) (gitignored)
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
- [x] `/chat` pipeline: DistilBERT intent → FAISS product search → reply
- [x] Real DistilBERT intent classifier wired in (`classify_intent`, threshold 0.30)
- [x] Keyword fallback for low-confidence queries (`keyword_intent`, word-boundary
      matching for short keywords like "hi" so "swadhissht" doesn't match "hi" inside)
- [x] Time-of-day greetings with typo tolerance via difflib ("good afternon" → afternoon)
- [x] Single-word vertical names ("grokly", "swadishtt") → explanation only, no products
- [x] Info questions ("what is X", "wht is swadishtt") → explanation only, no products
- [x] Product queries → bullet-point structured listing (name / brand+category+sub-cat /
      service+price), NO intro blurb before listings
- [x] FAISS distance discriminator (PRODUCT_QUERY_DISTANCE = 1.1): a query classified as
      greeting but with a close product match ("amul taaza") is re-routed to a product intent
- [x] Service mapping per category: Pharma & Wellness + Health & Hygiene → LocalMeds,
      everything else → Grokly (no fashion/food products in catalog yet)
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
| hello / hey / hi | greeting | none |
| good morning/afternoon/evening/night | greeting (time-matched reply) | none |
| good afternon (typo) | greeting (afternoon reply) | none |
| How do I join the waitlist? | waitlist_launch | none |
| do u deliver to my area ? | delivery_order (fallback) | none |
| Is my data safe? | privacy_security | none |
| what is grokly | grokly_grocery (info only) | none |
| what is swadhissht (typo) | swadisht_food (info only) | none |
| grokly / swadishtt (single word) | info only | none |
| amul milk | grokly_grocery | Amul Kool Flavoured Milk ✓ |
| amul taaza / amul taza | grokly_grocery | Amul Taaza Toned Milk ✓ |
| toned milk / milk price | grokly_grocery | milk products ✓ |
| shampoo / sunsilk | unknown → product listing | shampoo ✓ |
| i want dolo 650 | unknown → product listing | Dolo 650, LocalMeds ✓ |

## Phase 4 — Temporary UI Test (IN PROGRESS, REVERT PENDING)

- [x] Temporarily wired `AccescoInlineChatbot.jsx` to FastAPI `/chat` (fetch POST
      http://localhost:8000/chat, fallback to rule-based reply if server down)
- [x] Message bubble renders line breaks (split on `\n` → `<br/>`)
- [x] User tested end-to-end via UI; improvements shipped back into `app.py` (see Phase 3)
- [ ] **REVERT PENDING: `AccescoInlineChatbot.jsx` still has the temporary wiring —
      MUST be restored from the backup at
      `/var/folders/.../opencode/AccescoInlineChatbot.jsx.orig` (temp dir) once the
      user finishes testing. See ⚠️ REVERT AFTER TESTING note below.**
- [ ] Phase 4 proper integration not started — decision pending with user

### Commands (to re-run the UI test)

```bash
# Terminal 1 — ML server
cd accesco-chatbot/chatbot-ml/inference && python3 -m uvicorn app:app --port 8000

# Terminal 2 — Next.js dev server
cd Accesco && npm run dev

# Open http://localhost:3000 in a FRESH browser tab (hard-refresh Cmd+Shift+R if stale)
```

### ⚠️ IMPORTANT — REVERT AFTER TESTING

The temporary wiring in `Accesco/app/components/AccescoInlineChatbot.jsx`
(the fetch to `http://localhost:8000/chat` + line-break rendering) is for
**TESTING ONLY** and **MUST BE REVERTED after the user finishes testing** —
restore the original file from the backup at
`/var/folders/.../opencode/AccescoInlineChatbot.jsx.orig` (temp dir) so the
Next.js app is left 100% identical to before the test.
**DO NOT forget this — reverting is part of the task, not optional.**

## Phase 3.5 — Delivery Coverage Lookup (Completed)

- [x] `chatbot-ml/data/build_delivery_coverage.py` merges `Tier List.xlsx` (110
      pincodes, tier, opportunity score) + `coordinates .xlsx` (110 pincodes,
      areas, lat/long) → `chatbot-ml/data/delivery_coverage.json`
      (110 zones, 255 individual area names, 1 zone = 1 pincode)
- [x] `app.py` loads coverage JSON at startup; `/chat` answers coverage queries
      BEFORE product search (never misrouted to product listings)
- [x] Matching pipeline: pincode regex (6-digit) → exact area match → substring
      match (≥4 chars, handles "koramangala" → "koramangala (blocks 1-3 & 5-8)",
      "electronic city" → "Electronic City Phase 1 & 2") → difflib typo tolerance
      ("marthahalli" → Marathahalli) → 3-letter aliases (btm, hsr)
- [x] Reply templates: covered zone (area + pincode, NO tier info shown),
      uncovered pincode (waitlist nudge), area-list questions ("where do u
      deliver?", "areas u deliver", "list out few areas") → 110-pincode
      summary, "do you cover bangalore/bengaluru?" (summary), no-match
      delivery intent (asks for area/pincode)
- [x] FALLBACK_RULES: added delivery_order rule for coverage keywords
      (cover/coverage/serviceable) — no secondary keyword needed
- [x] Verified: 17-query test pass incl. regression (greeting, amul milk,
      amul taaza, shampoo, what is grokly all unchanged)

### Commands

```bash
# Rebuild coverage JSON after editing Tier List / coordinates spreadsheets
python3 accesco-chatbot/chatbot-ml/data/build_delivery_coverage.py
```

## Known Open Questions / Decisions

- Buy-redirect button SKIPPED for now (SKU Master xlsx has no product URLs) —
  revisit in Phase 4 if product detail pages get URLs
- No venv; use `python3` with global site-packages (Python 3.14)
- Git rule: ALWAYS ask user before any git operation (push/commit/merge)
- The "1 of 1 error" in dev overlay (`r["@context"].toLowerCase`) is NOT from the
  chatbot changes — likely a browser extension parsing JSON-LD arrays in layout.js;
  test in incognito to confirm
- Pushed commit history note: `faq_data.json` / `faq_labeled.csv` were removed from
  tracking (commit f7d7511) but still exist in earlier commit history

## How to Update This File

After completing each phase, mark it as ✅ Completed and update the Current Status table.
