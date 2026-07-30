# Accesco Chatbot — Development Rules

## What to Use
- **DistilBERT** for intent classification (not traditional ML)
- **all-MiniLM-L6-v2** for sentence embeddings (product/FAQ similarity)
- **FAISS** for vector similarity search
- **FastAPI** for the inference server
- **pandas + openpyxl** for xlsx parsing
- **PyMuPDF (fitz)** for PDF parsing
- **Hugging Face transformers + datasets + evaluate** for training

## What to Avoid
- No LLM APIs (OpenAI, Claude, Gemini) — avoid per-token cost and latency
- No traditional ML (SVM, Random Forest, Logistic Regression) — insufficient accuracy
- No heavy models (BERT-base, RoBERTa-large) — too slow for real-time inference
- No cloud-only vector DBs (Pinecone for production is fine, but avoid during development; use FAISS locally)
- No Docker in initial phase — deploy FastAPI directly via Railway/Render

## Error Handling
- Return fallback reply when intent confidence < 0.7
- Log all low-confidence queries for manual review and retraining
- Product lookup returns null gracefully — show "contact support" instead of broken button

## Boundaries for AI
- Do NOT modify any files inside the Accesco/ Next.js directory
- Do NOT modify .gitignore outside the accesco-chatbot directory
- All generated artifacts (models, indexes) stay in chatbot-ml/models/ and are gitignored
