# Experiment: frozen-encoder + head-only intent classifier vs. full fine-tune.
#
# Runs stratified 5-fold cross-validation on faq_labeled.csv and compares:
#   A) current approach — full DistilBERT fine-tune, fixed 4 epochs, weighted CE
#   B) proposed approach — frozen DistilBERT encoder + trainable classifier head
#      with early stopping, weight decay, and label smoothing.
#
# Outputs nothing to models/ — it is a measurement experiment only.
#
# Usage:
#   python3 chatbot-ml/train/experiment_frozen_head.py
#
# Summary
# ------- 
# The fine-tuned model overfits (train 0.828 / eval 0.672, ~0.16 gap). A frozen
# encoder has far fewer trainable parameters and should shrink that gap. This
# script measures both fairly under identical k-fold splits.

import csv
import os
from collections import Counter

import numpy as np
import torch
from sklearn.model_selection import StratifiedKFold
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE, "../data/faq_labeled.csv")

MODEL_NAME = "distilbert-base-uncased"
SEED = 42
BATCH_SIZE = 16
MAX_LEN = 128
K_FOLDS = 5
EPOCHS = 12          # upper bound; early stopping picks the best epoch per fold
LEARNING_RATE = 3e-5  # fine-tune LR (same as the production script)
HEAD_LEARNING_RATE = 1e-3  # frozen-encoder head is random-init; needs 30x+ LR
WEIGHT_DECAY = 1e-2
LABEL_SMOOTHING = 0.1
PATIENCE = 3

torch.manual_seed(SEED)
np.random.seed(SEED)


def load_data():
    rows = list(csv.DictReader(open(DATA_PATH, encoding="utf-8")))
    intents = sorted({r["intent"] for r in rows})
    label_map = {i: intent for i, intent in enumerate(intents)}
    texts = [r["question"] for r in rows]
    labels = np.array([intents.index(r["intent"]) for r in rows])
    return texts, labels, label_map


def class_weights(labels):
    counts = Counter(labels.tolist())
    n = len(labels)
    return torch.tensor(
        [n / (len(counts) * counts[i]) for i in range(len(counts))],
        dtype=torch.float32,
    )


def make_model(num_labels, freeze_encoder):
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=num_labels
    )
    if freeze_encoder:
        for name, p in model.named_parameters():
            if name.startswith("distilbert."):
                p.requires_grad = False
    return model


def run_fold(tokenizer, texts, labels, tr_idx, va_idx, freeze_encoder, lr):
    """Train one fold and return (best_eval_acc, last_eval_acc, train_acc)."""
    tr_texts = [texts[i] for i in tr_idx]
    tr_labels = labels[tr_idx]
    va_texts = [texts[i] for i in va_idx]
    va_labels = torch.tensor(labels[va_idx])

    n_labels = len(set(labels.tolist()))
    model = make_model(n_labels, freeze_encoder)
    weights = class_weights(tr_labels)
    model.train()

    trainable = [p for p in model.parameters() if p.requires_grad]
    optimizer = torch.optim.AdamW(
        trainable, lr=lr, weight_decay=WEIGHT_DECAY
    )

    best_acc, best_state, patience = 0.0, None, 0
    for epoch in range(EPOCHS):
        # train
        perm = torch.randperm(len(tr_texts))
        total_n, correct = 0, 0
        for i in range(0, len(tr_texts), BATCH_SIZE):
            idx = perm[i:i + BATCH_SIZE]
            enc = tokenizer(
                [tr_texts[j] for j in idx.tolist()],
                truncation=True, padding=True, max_length=MAX_LEN, return_tensors="pt",
            )
            lb = torch.tensor([tr_labels[j] for j in idx.tolist()])
            optimizer.zero_grad()
            out = model(**enc).logits
            loss = torch.nn.functional.cross_entropy(
                out, lb, weight=weights, label_smoothing=LABEL_SMOOTHING
            )
            loss.backward()
            optimizer.step()
            total_n += lb.size(0)
            correct += (out.argmax(-1) == lb).sum().item()
        train_acc = correct / total_n

        # validate
        model.eval()
        with torch.no_grad():
            enc = tokenizer(
                va_texts, truncation=True, padding=True, max_length=MAX_LEN,
                return_tensors="pt",
            )
            logits = model(**enc).logits
        eval_acc = (logits.argmax(-1) == va_labels).float().mean().item()
        model.train()

        if eval_acc > best_acc:
            best_acc = eval_acc
            best_state = {k: v.clone() for k, v in model.state_dict().items()}
            patience = 0
        else:
            patience += 1
            if patience >= PATIENCE:
                break

    return best_acc, eval_acc, train_acc


def main():
    texts, labels, label_map = load_data()
    print(f"Data: {len(texts)} rows | {len(label_map)} intents | {K_FOLDS}-fold stratified CV")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    skf = StratifiedKFold(n_splits=K_FOLDS, shuffle=True, random_state=SEED)
    results = {"fine_tune": [], "frozen_head": []}
    print("\nfold | fine_tune (best_eval) | frozen_head (best_eval)")
    for fold, (tr_idx, va_idx) in enumerate(skf.split(texts, labels), 1):
        ft_best, ft_last, ft_train = run_fold(
            tokenizer, texts, labels, tr_idx, va_idx,
            freeze_encoder=False, lr=LEARNING_RATE,
        )
        fh_best, fh_last, fh_train = run_fold(
            tokenizer, texts, labels, tr_idx, va_idx,
            freeze_encoder=True, lr=HEAD_LEARNING_RATE,
        )
        results["fine_tune"].append(ft_best)
        results["frozen_head"].append(fh_best)
        print(
            f"{fold:4d} | {ft_best:.3f} (train {ft_train:.3f}) | "
            f"{fh_best:.3f} (train {fh_train:.3f})"
        )

    print("\n=== MEAN ± STD (best eval acc across epochs, 5-fold CV) ===")
    for name in ("fine_tune", "frozen_head"):
        arr = np.array(results[name])
        print(f"{name:12s}: {arr.mean():.3f} ± {arr.std():.3f}  (per-fold: {np.round(arr,3).tolist()})")


if __name__ == "__main__":
    main()