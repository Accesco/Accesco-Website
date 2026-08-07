# Accesco Chatbot — Architecture

## App Flow

User Message → AccescoInlineChatbot.jsx → POST /api/chat → FastAPI Inference Server → DistilBERT Intent Classifier → Product FAISS Index → Response JSON → Frontend renders reply + optional buy button

## Folder Structure

```
accesco-chatbot/
├── chatbot-data/                    # Raw data (gitignored)
│   ├── Accesco QC SKU Master Inventory.xlsx
│   ├── Accesco_Circular_Commerce_SKU_Recovery_Framework.pdf
│   └── faq_data.csv
└── chatbot-ml/                      # Source code (committed)
    ├── data/
    │   └── preprocess.py            # Parse xlsx/PDF/FAQ into training format
    ├── train/
    │   └── train_classifier.py      # Fine-tune DistilBERT
    ├── inference/
    │   ├── app.py                   # FastAPI server
    │   └── requirements.txt
    └── models/                      # Trained artifacts (gitignored)
        ├── intent_model.bin
        └── product_index.faiss
```

## Tech Stack

- **ML/DL:** Hugging Face Transformers (DistilBERT), SentenceTransformers (all-MiniLM-L6-v2), FAISS
- **Data:** pandas, openpyxl, PyMuPDF
- **Inference Server:** FastAPI + uvicorn
- **Frontend:** Existing Next.js AccescoInlineChatbot.jsx (fetch to FastAPI)
- **Deployment:** Railway / Render for inference server; Vercel for frontend
