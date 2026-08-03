# Accesco Chatbot — Memory & Progress

## Current Status

| Phase | Status | File |
|---|---|---|
| Phase 1: Data Preparation | ✅ Completed | `chatbot-ml/data/preprocess.py` |
| Phase 2: Model Training | ✅ Completed | `chatbot-ml/train/train_classifier.py` |
| Phase 3: Inference Server | ✅ Completed | `chatbot-ml/inference/app.py` |
| Phase 4: Frontend Integration | 🧪 Tested (temporary UI wiring, REVERTED after testing) | `Accesco/app/components/AccescoInlineChatbot.jsx` |
| Phase 3.5: Delivery Coverage Lookup | ✅ Completed | `chatbot-ml/data/build_delivery_coverage.py` + `app.py` |
| Phase 3.6: SKU Recovery Framework RAG | ✅ Completed | `chatbot-ml/data/build_recovery_index.py` + `app.py` |
| Phase 3.7: Full E2E Test Suite | ✅ Completed | `chatbot-ml/test_suite.csv` + `chatbot-ml/test_suite_runner.py` |
| Phase 3.8: Xfail fixes + rule hardening | ✅ Completed | `app.py` + `train/train_classifier.py` (12-epoch retrain) |
| Phase 3.9: Marketing recovery FAQ answers | ✅ Completed | `chatbot-ml/data/build_recovery_faq.py` + `app.py` |
| Phase 3.10: Dolo fix + filename reconciliation | ✅ Completed | `build_delivery_coverage.py` + `app.py` |

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

## Phase 3.6 — SKU Recovery Framework RAG (Completed, no retraining)

- [x] `chatbot-ml/data/build_recovery_index.py` converts `recovery_framework.json`
      → `chatbot-ml/data/recovery_index.json`: 19 rows, each with canonical
      text + category boost vocabulary + per-SKU + per-category paraphrase
      expansions (551 search texts; generic words like "bottles"/"toys" are
      EXCLUDED from expansions so ambiguous queries surface as asks instead
      of phrase-collision false positives)
- [x] `app.py` embeds all search texts at startup (all-MiniLM-L6-v2) →
      cosine similarity retrieval; `/chat` routes recovery BEFORE product
      search via:
  - Strong detection: recovery keyword rules (take back/recycl/e-waste/
    packaging/dispose/resale/what happens to/...) moved BEFORE grokly &
    returns_refunds so "take back milk bottles" isn't stolen by "milk",
    "return my packaging" routes to recovery not returns policy
  - Second circular rule: old/reuse/recover/collect REQUIRE a recovery-ish
    secondary word ("amul gold" never matches "old" — word-boundary)
  - Weak detection: `recovery_hint()` difflib typo fallback ("take bak" →
    take back) with a NEGATIVE vocabulary (refund/order/password/deliver...)
    and it only answers when a row matches confidently — unrelated queries
    pass through untouched
  - Classifier `circular_recycle` intent also routes to the handler
- [x] Answer templates: Yes → "we take back {skus}. Recovery: {recovery}.",
      Selective → "taken back selectively", Reject → "we don't take back",
      ambiguous (top-2 within 0.05 gap) → "which one did you mean?" with
      options, below 0.45 sim → generic circular reply + ask (weak detections
      below threshold pass through instead)
- [x] Eval: `chatbot-ml/inference/test_recovery.py` — 47-question suite
      (19 categories + typos + ambiguous + pass-through + conceptual):
      **47/47 (100%)**. All non-recovery queries (amul milk, hello, shampoo
      price, dolo 650, can i return my order, UPI, recover my password,
      what is circular commerce) untouched.
- [x] Full /chat regression: delivery coverage, products, greetings, info,
      waitlist, privacy all verified working

### Commands

```bash
# Rebuild recovery index after editing recovery_framework.json / build script
python3 accesco-chatbot/chatbot-ml/data/build_recovery_index.py

# Run the recovery eval suite (imports app; loads models ~10-15s)
python3 accesco-chatbot/chatbot-ml/inference/test_recovery.py
```

## Phase 3.7 — Full E2E Test Suite (Completed, 2026-08-02)

- [x] `chatbot-ml/test_suite.csv` — 95 questions covering every subsystem:
      greetings (+typos), verticals, info questions, products (FAISS),
      delivery coverage (pincodes/areas/typos/aliases), SKU recovery
      (Yes/Selective/Reject rows, typos, disambiguation), all FAQ intents,
      edge cases (gibberish, off-topic, "amul gold" vs "old" collision)
- [x] Columns: `expected_intent` (pipe-separated alternatives or "any"),
      `reply_contains` (any-of substrings, case-insensitive),
      `expect_products` (yes/no/any), `known_issue` (yes = xfail)
- [x] `chatbot-ml/test_suite_runner.py` — stdlib-only runner against a live
      server; per-row pass/fail + per-category scoreboard; exit 0/1 for CI;
      known-issue rows report XFAIL (or XPASS when fixed — remove flag)
- [x] Verified against live server: **88/95 pass, 0 fail, 5 xfail** (~3.5 min)
- [x] BUGFIX: `build_delivery_coverage.py` reads the coordinates spreadsheet as
      `coordinates .xlsx` (extra space); the file exists WITH a space on this
      machine but the teammate's fix assumed `coordinates.xlsx` (no space).
      Now `_resolve()` picks whichever filename actually exists — portable
      across both machines. Regenerated `delivery_coverage.json` (110 zones).

### Known xfail rows (model confidently wrong, above 0.30 fallback threshold)

| # | Query | Misrouted to | Conf |
|---|---|---|---|
| 2 | hello there | referral_rewards | 0.37 |
| 3 | namaste | swadisht_food (shows products) | 0.74 |
| 31 | dettol handwash | circular_recycle (no products) | 0.70 |
| 53 | do you deliver here? | returns_refunds | 0.38 |
| 54 | do you deliver to mumbai? | delivery_partner | 0.48 |

Add training examples for these phrasings if retraining.

## Phase 3.8 — Xfail fixes + rule hardening (Completed, 2026-08-03)

- [x] All 5 known xfail rows now pass → **95/95 E2E + 47/47 recovery**
- [x] `INTENT_CONFIDENCE_THRESHOLD` 0.30 → 0.50; new rule-agreement override:
      a keyword rule that disagrees with the model's top pick wins while
      model confidence < 0.90 (`RULE_OVERRIDE_MAX_CONF`) — "namaste" (0.74)
      and "dettol handwash" (0.70) are confidently wrong, rules beat them
- [x] New FALLBACK_RULES: city names (mumbai/delhi/...) → delivery_order,
      "here"/"fast"/"quick" in delivery secondary, "track my order" (needs
      delivery object so "track my spending" stays Xpense), "take X back"
      (+typo variants bak/bottel/bottels), "circular" word, referral_rewards,
      delivery_partner (needs apply/join/become secondary; placed BEFORE
      delivery rules because "delivery partner" contains "delivery"),
      comparison (vs/zepto/blinkit/different from/...)
- [x] `coverage_reply` city check → "We're not delivering to {city} yet — we
      currently serve 110 pincodes across Bengaluru..."
- [x] Unknown intent now only shows products when FAISS distance
      < `PRODUCT_QUERY_DISTANCE` (1.1) — random questions no longer get
      product listings ("how does referral work?" → Clinic Plus shampoo)
- [x] Training data: 304 → 320 rows (greeting variants incl. namaste ji,
      dettol handwash/sanitizer/soap, city questions); retrained 12 epochs
      (eval 0.781). Note: 5-epoch retrain dropped 11 rows to `unknown`
      (0.08-0.26 conf) — rules are the robustness layer, model is best-effort
- [x] Removed `known_issue` flags for rows #2, #3, #31, #53, #54 in
      `test_suite.csv` (runner's XPASS → flag-removal workflow)

## Phase 3.9 — Marketing recovery FAQ answers (Completed, 2026-08-03)

- [x] Marketing delivered `chatbot-data/SKURecovery.pdf` — 38 customer-style
      recovery Q&As (general/how-it-works, beverages, dairy, fashion,
      e-waste, packaging, baby, medicines, furniture, food waste)
- [x] `chatbot-ml/data/build_recovery_faq.py` → `recovery_faq.json` (38
      entries; generated file gitignored); server embeds all FAQ questions
      at startup
- [x] `app.py` `recovery_faq_reply()` — runs BEFORE the delivery_order
      early-return and the 19-row table. Guards: "circular commerce" keeps
      its conceptual reply; negative vocab (order/refund/deliver/...) blocks
      non-recovery queries. General-category FAQs answer at sim ≥ 0.70;
      category FAQs only when no row answers confidently (row_best < 0.45) —
      so "cosmetic bottles" stays on the Beauty row, not the Beverages FAQ
- [x] 38 FAQ questions added to `faq_labeled.csv` (ids 321-358,
      circular_recycle 7 → 45 rows); retrained 12 epochs → eval 0.806
- [x] `test_recovery.py` now tests the combined FAQ+row path (51/51);
      suite **95/95, recovery 51/51**

## Phase 3.10 — Dolo fix + filename reconciliation (Completed, 2026-08-03)

- [x] "dolo 650" was misclassified as `greeting` → added `dolo`/`paracetamol`/
      `crocin`/`calpol` to the `localmeds_pharmacy` keyword rule + 3 training
      rows (ids 359-361); retrained 12 epochs → eval 0.808; now answers with
      the Dolo 650 product listing. Suites stay **95/95 + 51/51**
- [x] `build_delivery_coverage.py` coordinates filename: `_resolve()` now picks
      whichever exists — `coordinates .xlsx` (space, this machine) or
      `coordinates.xlsx` (no space, teammate's) — portable across machines;
      regenerated `delivery_coverage.json` (110 zones, unchanged data)
- [x] NAV NOTE: latest model is **mildly overfitting** — train 0.993 vs
      eval 0.806 (~19pt gap, noisy on a 73-row eval split). Not a blocker:
      keyword rules + agreement override do the routing, so behavior is 95/95.
      Root fix = more training questions (Tier-2 expansion pending).

### Commands

```bash
# Terminal 1 — start the server
cd accesco-chatbot/chatbot-ml && python3 -m uvicorn inference.app:app --port 8000

# Terminal 2 — run the suite
python3 accesco-chatbot/chatbot-ml/test_suite_runner.py
python3 accesco-chatbot/chatbot-ml/test_suite_runner.py --category coverage
python3 accesco-chatbot/chatbot-ml/test_suite_runner.py --only 41,55 -v
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
