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
