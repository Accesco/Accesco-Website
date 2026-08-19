# Fine-tune DistilBERT for intent classification → intent_model/
#
# Usage:
#   python3 chatbot-ml/train/train_classifier.py [max_epochs]
#
# Outputs (saved to chatbot-ml/models/):
#   intent_model/  — Hugging Face model + tokenizer
#   label_map.json — intent id → intent name mapping
#
# 2026-08-19: recipe now uses stratified validation split + early stopping,
# weight decay (1e-2) and label smoothing (0.1) — see experiment_frozen_head.py.

import csv
import json
import os
import random
import sys

import numpy as np
import torch
from sklearn.model_selection import StratifiedShuffleSplit
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

# Regularization recipe validated by train/experiment_frozen_head.py (5-fold CV:
# fine-tune 0.822 ± 0.032 vs frozen-head 0.622 ± 0.031 → keep fine-tuning). Weight
# decay + label smoothing + early stopping lifted the production eval from 0.672
# to 0.816 while shrinking the train/eval gap (0.156 → 0.104) with no suite
# regressions (150/150, recovery 51/51, live catalog 43/43).
WEIGHT_DECAY = 1e-2
LABEL_SMOOTHING = 0.1
PATIENCE = 3

# Optional CLI arg: max epochs (default 12; early stopping picks the best epoch)
MAX_EPOCHS = int(sys.argv[1]) if len(sys.argv) > 1 else 12

random.seed(SEED)
torch.manual_seed(SEED)


def load_data():
    rows = []
    with open(DATA_PATH, encoding="utf-8") as f:
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

    labels_arr = np.array([d["labels"] for d in data])
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=SEED)
    (tr_idx, va_idx) = next(sss.split(np.zeros(len(data)), labels_arr))
    train_data = [data[i] for i in tr_idx]
    eval_data = [data[i] for i in va_idx]
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
    optimizer = torch.optim.AdamW(
        model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY
    )

    train_texts = [d["text"] for d in train_data]
    train_labels = [d["labels"] for d in train_data]
    eval_texts = [d["text"] for d in eval_data]
    eval_labels = torch.tensor([d["labels"] for d in eval_data])

    # ─── Training loop with early stopping ─────────────────────────────────
    best_acc, best_state, patience = 0.0, None, 0
    for epoch in range(MAX_EPOCHS):
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
                out.logits, labels, weight=weights, label_smoothing=LABEL_SMOOTHING
            )
            loss.backward()
            optimizer.step()
            total_n += labels.size(0)
            correct += (out.logits.argmax(-1) == labels).sum().item()
        train_acc = correct / total_n

        model.eval()
        with torch.no_grad():
            enc = tokenizer(
                eval_texts, truncation=True, padding=True, max_length=128,
                return_tensors="pt",
            )
            eval_logits = model(**enc).logits
        eval_acc = (eval_logits.argmax(-1) == eval_labels).float().mean().item()
        print(f"Epoch {epoch + 1}/{MAX_EPOCHS}: train_acc={train_acc:.3f} eval_acc={eval_acc:.3f}")

        if eval_acc > best_acc:
            best_acc = eval_acc
            best_state = {k: v.clone() for k, v in model.state_dict().items()}
            patience = 0
        else:
            patience += 1
            if patience >= PATIENCE:
                print(f"Early stopping at epoch {epoch + 1} (patience {PATIENCE})")
                break

    model.load_state_dict(best_state)
    print(f"Best eval accuracy: {best_acc:.3f}")

    # ─── Save model ────────────────────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Model saved → {OUTPUT_DIR}")
    print(f"Label map saved → {LABEL_MAP_PATH}")


if __name__ == "__main__":
    main()
