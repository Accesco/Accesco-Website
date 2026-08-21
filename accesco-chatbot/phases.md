# Accesco Chatbot — Implementation Phases

## Phase 1: Data Preparation (waiting for FAQ)
- Parse SKU Master xlsx → product catalog JSON
- Parse SKU Recovery PDF → text chunks
- Build FAISS product index
- Set up preprocessing pipeline

## Phase 2: Model Training (after FAQ arrives)
- Label FAQ data with intents
- Split train/test (80/20)
- Fine-tune DistilBERT
- Evaluate on test set
- Export model (ONNX or PyTorch)

## Phase 3: Inference Server
- Build FastAPI endpoint with two routes:
  - POST /predict → intent classification
  - POST /search → product/FAQ vector search
- Deploy on Railway or Render

## Phase 4: Frontend Integration
- Update AccescoInlineChatbot.jsx to call FastAPI endpoint
- Render buy-redirect button when action: "buy" is returned
- Add fallback UI for low-confidence responses

## Phase 5: Iteration
- Log missed intents and edge cases
- Periodic retraining with new data
- A/B test buy button conversion

## Phase 6: Add-to-Cart + Variant Selection (COMPLETED 2026-08-20, 161/161 suite)

Feature request: product searches should show an **Add to Cart** button
alongside the existing redirect button. Products with **variants** (different
weights/forms of the same item — e.g. milk → toned, full cream) should first
show the variant list, let the user pick one, then show that product with both
buttons.

### What was done

1. `sku` added to `ProductCard`; universal inline `addToCart(card, qty)` in the
   widget writing vertical-native localStorage carts (grokly/instastyle/
   swadishtt) + `storage` event dispatch.
2. **Quantity stepper** on every product card (`− qty +`, clamp 1–20,
   per-message/per-card state), Add passes the quantity.
3. **Variant selection (manual curation)**: `VARIANT_GROUPS` in `app.py`
   (6 families: Amul milk, Kurkure, Pringles, Maggi sauce, Tata Tea Gold,
   Mango). `variant_picker_reply()` runs as P0 before the category shelf:
   family-token overlap + competitor block + generic-word exclusion
   ("fresh vegetables" never fires the milk picker).
4. **Specific-variant path**: `_specific_variant()` distinguishes packs by
   tokens (toned/gold/22g/250g/1kg...); single-char tokens ignored; the reply
   is the single card + buttons, token-driven so loose-FAISS queries
   ("kurkure 22g" at 1.25) still land on the right pack.
5. `VariantInfo.query` = name + distinguishing tokens, so frontend chips
   always land on the exact card (pack names alone are identical).
6. Frontend: variant chips (name + unit·price) under the bubble; click sends
   `v.query` as a user message; `sendMessage(e, forcedValue)` refactor.
7. Suite: `expect_variants` column + 11 new rows (151–161); row 115 "buy milk"
   updated to the variant list; coverage matcher substring floor 4→5 chars
   ("tata tea" no longer matches "Tata Silk Farm"). 161/161 green.

### Verification

- Suite 161/161, lint clean, `next build` passes.
- Live checks: milk/kurkure/tata tea/mango/pringles/maggi → variant lists;
  toned/amul gold/kurkure 22g/mango 1kg → single correct card; oat milk/
  almond milk → normal cards (competitor block); recovery + coverage intact.

## Phase 7: Mood‑aware Recommendation Engine (IN PROGRESS 2026-08-22)

Feature request: the chatbot should understand user mood (romantic, anniversary, date‑night, etc.) and suggest relevant products from the catalog, with Add‑to‑Cart buttons and regional‑language support.

### Mood Taxonomy & Detection
- Defined a core mood list (romantic, anniversary, date‑night, friendship‑gift, long‑distance, Valentine’s).
- Language detection step (script‑based Unicode check → ISO‑639 code `hi`, `bn`, `ta`, `te`, `kn`, `ml`, `gu` …) runs before intent classification.
- Intent classification kept in English; **Option A (translate‑then‑classify)** uses a small MT model (Helsinki‑NLP/opus‑mt‑en‑hi) to translate the message before the DistilBERT intent model. **Option B (multilingual model)** fine‑tunes `distilbert-base-multilingual-cased` on labeled messages per target language.

### Mood‑to‑SKU Mapping
- Created `mood_sku_map.json` loaded at server start, mapping each mood to a curated subset of the 271 catalog SKUs (e.g., romantic → premium chocolates, candle‑lit dinner kits, imported champagnes; anniversary → special‑edition hampers, personalized gifts).
- Exposed `GET /mood-products?mood=romantic` endpoint returning 3‑5 product cards with Add‑to‑Cart and redirect buttons.
- Guardrails: similarity bar 0.68, competitor‑block, intent guard, recovery/circular topics untouched.

### Reply Dictionary (Regional Language Support)
- Reply strings stored keyed by `intent + language` (e.g. `greeting.hi`, `greeting.bn`).
- If a translation is missing, fall back to English.
- Product names in catalog stay English; optional parallel `product_name_hi` / `product_name_bn` fields for top‑Seller SKUs.

### Chatbot Flow for Mood Queries
1. User message → language detection → intent classification.
2. If mood intent detected → look up `mood_sku_map`.
3. Render a small carousel (3‑4 items) with product image, name, price.
4. "Add to Cart" button per item (same single‑card flow, quantity stepper included).
5. Text prompt: “I’ve picked these for a romantic evening – would you like to add any of these?”
6. If no mood recognized → normal product search (existing P3 flow).

### Guardrails
- Mood path runs as P0 in `commerce_reply` but includes the same competitor‑block and similarity‑bar (0.68) guards.
- Never hijacks product, coverage, order, or locked canned replies.
- Regional‑language replies protected by the same dictionary‑fallback logic.

### Verification (Planned)
- Add ~10 new suite rows per mood/language with `expect_variants` = yes/no/any.
- Verify 150+/150 suite still passes, recovery 51/51, catalog 43/43.
- Spot‑check regional phrase mappings ("pyaar bhare din", "romantic season") resolve correctly.

### Housekeeping
- `mood_sku_map.json` committed to `chatbot-ml/data/`.
- Reply dictionary added to `inference/app.py` language‑branch.
- `memory.md` + `phases.md` updated with this section.
- `test_suite_runner.py` now supports `expect_mood` column (yes/no/any) – default `any`.

**Pipeline bottom line:** You need (a) a language‑detector, (b) a multilingual fine‑tuned model, (c) a reply dictionary with translations for the intents you care about, and (optional but recommended) (d) product‑name mappings for the regional scripts. With those pieces in place, the bot will reply in pure Hindi, Telugu or Kannada when the user’s message is detected in that script.
