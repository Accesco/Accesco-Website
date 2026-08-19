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

## Phase 6: Add-to-Cart + Variant Selection (PLANNED 2026-08-19)

Feature request: product searches should show an **Add to Cart** button
alongside the existing redirect button. Products with **variants** (different
weights/forms of the same item — e.g. milk → toned, full cream) should first
show the variant list, let the user pick one, then show that product with both
buttons.

### Current state

- `commerce_reply()` already returns product `cards` + `actions` (Order/
  redirect buttons) — redirect path works.
- Grokly cart exists: `addToCart(productId, qty)` in
  `Accesco/app/services/grokly/contexts/GroklyContext.jsx` (localStorage
  `grokly_cart` + Firestore sync).
- Catalog (`live_catalog.json`, 271 products) has **no variant grouping** —
  each SKU is standalone.
- `ProductCard` model has **no `sku` field** — needed for `addToCart`.
- Chatbot widget renders on the homepage, but `GroklyProvider` only wraps
  `/services/grokly` routes — `useGrokly()` unavailable where the chatbot
  renders.

### Backend steps

1. Add `sku` to `ProductCard`.
2. Variant grouping: normalize names (strip unit/weight words) + group by
   brand + base name; prefer a curated `variant_group` field in the catalog
   build script over auto-normalization (risk of wrong groupings).
3. `commerce_reply()` flow: family with variants → variant list reply
   (sku/name/unit/price) + picker prompt; after pick → single product card
   with **Add to Cart** action (new `cart` type carrying `sku`) + redirect.

### Frontend steps

4. Render "Add to Cart" on cards (or `cart`-type action) → `addToCart(sku, 1)`.
5. Provider wiring — option A: lift `GroklyProvider` to root layout;
   option B: widget writes `grokly_cart` localStorage + dispatches
   `grokly-cart-updated` event.
6. Variant-chip UI: render selectable chips on `variants`, send selection to
   `/chat`, render final card + both buttons.

### Verification

- New suite rows: variant search → variant list; variant pick → single card +
  cart action; cart action carries correct sku.
- Keep green: suite 150/150, recovery 51/51, live catalog 43/43.

### Open decision

- Variant grouping: automatic (name normalization, risky) vs curated manual
  per-family (recommended).
