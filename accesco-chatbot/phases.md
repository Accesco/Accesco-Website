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
