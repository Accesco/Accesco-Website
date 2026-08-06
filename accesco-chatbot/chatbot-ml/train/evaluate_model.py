# Evaluate the saved intent_model on the held-out split — no retraining.
#
# Usage:
#   python chatbot-ml/train/evaluate_model.py           # held-out eval split (same seed as training)
#   python chatbot-ml/train/evaluate_model.py --full    # evaluate on the full dataset
#
# Loads models/intent_model + label_map.json, reproduces the exact 80/20
# split used by train_classifier.py (SEED=42), and reports:
#   - overall accuracy
#   - per-intent precision / recall / F1 / support
#   - top misclassification pairs

import csv
import json
import os
import random
import sys
from collections import Counter, defaultdict

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE, "../data/faq_labeled.csv")
MODELS_DIR = os.path.join(BASE, "../models")
MODEL_DIR = os.path.join(MODELS_DIR, "intent_model")
LABEL_MAP_PATH = os.path.join(MODELS_DIR, "label_map.json")

SEED = 42
BATCH_SIZE = 32

FULL_DATASET = "--full" in sys.argv

random.seed(SEED)
torch.manual_seed(SEED)


def load_data():
    # Must mirror train_classifier.load_data() exactly so the shuffle/split
    # reproduces the same held-out set the model never trained on.
    rows = []
    with open(DATA_PATH, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows.append(r)
    intents = sorted({r["intent"] for r in rows})
    data = [
        {"text": r["question"], "labels": intents.index(r["intent"])}
        for r in rows
    ]
    return data, intents


def main():
    data, intents = load_data()

    with open(LABEL_MAP_PATH, encoding="utf-8") as f:
        label_map = {int(k): v for k, v in json.load(f).items()}

    # Sanity check: saved label map must match the dataset's intent order,
    # otherwise the model was trained on different data than this CSV.
    if [label_map[i] for i in range(len(label_map))] != intents:
        print("WARNING: label_map.json does not match intents in faq_labeled.csv")
        print("         Results below may be invalid — retrain or check data.")

    random.shuffle(data)
    split = int(len(data) * 0.8)
    eval_data = data if FULL_DATASET else data[split:]
    which = "FULL dataset" if FULL_DATASET else "held-out eval split (unseen during training)"
    print(f"Model:   {os.path.normpath(MODEL_DIR)}")
    print(f"Data:    {len(eval_data)} examples — {which}")
    print(f"Intents: {len(label_map)}")
    print()

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model.eval()

    texts = [d["text"] for d in eval_data]
    labels = [d["labels"] for d in eval_data]

    # ─── Batched inference ──────────────────────────────────────────────────
    preds = []
    with torch.no_grad():
        for i in range(0, len(texts), BATCH_SIZE):
            enc = tokenizer(
                texts[i:i + BATCH_SIZE],
                truncation=True,
                padding=True,
                max_length=128,
                return_tensors="pt",
            )
            logits = model(**enc).logits
            preds.extend(logits.argmax(-1).tolist())
            done = min(i + BATCH_SIZE, len(texts))
            print(f"  evaluated {done}/{len(texts)}", end="\r")
    print()

    # ─── Overall accuracy ───────────────────────────────────────────────────
    correct = sum(p == l for p, l in zip(preds, labels))
    accuracy = correct / len(labels)
    print()
    print("=" * 62)
    print(f"  OVERALL ACCURACY: {accuracy:.1%}  ({correct}/{len(labels)} correct)")
    print("=" * 62)
    print()

    # ─── Per-intent precision / recall / F1 ─────────────────────────────────
    tp, fp, fn = Counter(), Counter(), Counter()
    for p, l in zip(preds, labels):
        if p == l:
            tp[l] += 1
        else:
            fp[p] += 1
            fn[l] += 1
    support = Counter(labels)

    print(f"{'Intent':<24}{'Prec':>7}{'Rec':>7}{'F1':>7}{'N':>5}")
    print("-" * 50)
    for i in range(len(label_map)):
        if support[i] == 0:
            continue
        prec = tp[i] / (tp[i] + fp[i]) if (tp[i] + fp[i]) else 0.0
        rec = tp[i] / (tp[i] + fn[i]) if (tp[i] + fn[i]) else 0.0
        f1 = 2 * prec * rec / (prec + rec) if (prec + rec) else 0.0
        print(f"{label_map[i]:<24}{prec:>7.2f}{rec:>7.2f}{f1:>7.2f}{support[i]:>5}")
    print("-" * 50)

    # ─── Top confusions ─────────────────────────────────────────────────────
    confusions = defaultdict(int)
    for p, l in zip(preds, labels):
        if p != l:
            confusions[(l, p)] += 1
    if confusions:
        print()
        print("Top misclassifications (true -> predicted):")
        ranked = sorted(confusions.items(), key=lambda kv: -kv[1])[:5]
        for (l, p), n in ranked:
            print(f"  {label_map[l]} -> {label_map[p]}: {n}x")


if __name__ == "__main__":
    main()
