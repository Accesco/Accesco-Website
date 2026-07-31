# Fine-tune DistilBERT for intent classification → intent_model/
#
# Usage:
#   python3 chatbot-ml/train/train_classifier.py [epochs]
#
# Outputs (saved to chatbot-ml/models/):
#   intent_model/  — Hugging Face model + tokenizer
#   label_map.json — intent id → intent name mapping

import csv
import json
import os
import random
import sys

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE, "../data/faq_labeled.csv")
MODELS_DIR = os.path.join(BASE, "../models")
OUTPUT_DIR = os.path.join(MODELS_DIR, "intent_model")
LABEL_MAP_PATH = os.path.join(MODELS_DIR, "label_map.json")

MODEL_NAME = "distilbert-base-uncased"
SEED = 42
BATCH_SIZE = 16
LEARNING_RATE = 3e-5

# Optional CLI arg: number of epochs (default 5)
EPOCHS = int(sys.argv[1]) if len(sys.argv) > 1 else 5

random.seed(SEED)
torch.manual_seed(SEED)


def load_data():
    rows = []
    with open(DATA_PATH) as f:
        for r in csv.DictReader(f):
            rows.append(r)
    intents = sorted({r["intent"] for r in rows})
    label_map = {i: intent for i, intent in enumerate(intents)}
    data = [
        {"text": r["question"], "labels": intents.index(r["intent"])}
        for r in rows
    ]
    return data, label_map


def main():
    data, label_map = load_data()
    with open(LABEL_MAP_PATH, "w") as f:
        json.dump(label_map, f, indent=2)

    random.shuffle(data)
    split = int(len(data) * 0.8)
    train_data, eval_data = data[:split], data[split:]
    print(f"Train: {len(train_data)} | Eval: {len(eval_data)} | Intents: {len(label_map)}")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=len(label_map)
    )

    # Class weights to counter imbalance (small classes get higher weight)
    from collections import Counter
    counts = Counter(d["labels"] for d in train_data)
    total = len(train_data)
    weights = torch.tensor(
        [total / (len(label_map) * counts[i]) for i in range(len(label_map))],
        dtype=torch.float32,
    )

    model.train()
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)

    train_texts = [d["text"] for d in train_data]
    train_labels = [d["labels"] for d in train_data]

    # ─── Training loop ──────────────────────────────────────────────────────
    for epoch in range(EPOCHS):
        total_n, correct = 0, 0
        for i in range(0, len(train_texts), BATCH_SIZE):
            enc = tokenizer(
                train_texts[i:i + BATCH_SIZE],
                truncation=True,
                padding=True,
                max_length=128,
                return_tensors="pt",
            )
            labels = torch.tensor(train_labels[i:i + BATCH_SIZE])
            optimizer.zero_grad()
            out = model(**enc, labels=labels)
            loss = torch.nn.functional.cross_entropy(
                out.logits, labels, weight=weights
            )
            loss.backward()
            optimizer.step()
            total_n += labels.size(0)
            correct += (out.logits.argmax(-1) == labels).sum().item()
        print(f"Epoch {epoch + 1}/{EPOCHS}: train_acc={correct / total_n:.3f}")

    # ─── Evaluation on held-out set ────────────────────────────────────────
    model.eval()
    enc = tokenizer(
        [d["text"] for d in eval_data],
        truncation=True,
        padding=True,
        max_length=128,
        return_tensors="pt",
    )
    labels = torch.tensor([d["labels"] for d in eval_data])
    with torch.no_grad():
        logits = model(**enc).logits
    preds = logits.argmax(-1)
    accuracy = (preds == labels).float().mean().item()
    print(f"Eval accuracy: {accuracy:.3f}")

    # ─── Save model ────────────────────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Model saved → {OUTPUT_DIR}")
    print(f"Label map saved → {LABEL_MAP_PATH}")


if __name__ == "__main__":
    main()
