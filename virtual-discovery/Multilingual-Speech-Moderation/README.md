## Overview

This project fine-tunes **Google's MuRIL Transformer** for multilingual hate speech classification across Indian languages.

The repository currently supports:

- Data preprocessing
- Dataset construction
- MuRIL fine-tuning
- Model evaluation
- Model inference (coming soon)

---

## Project Structure

```
Multilingual-Speech-Moderation/
│
├── data/
│   └── hindi/
│       ├── train/
│       ├── validation/
│       └── test/
│
├── logs/
├── models/
├── outputs/
│
├── root/
│   ├── config.py
│   ├── dataset.py
│   ├── evaluate_model.py
│   ├── metrics.py
│   ├── model.py
│   ├── prepr.py
│   ├── train.py
│   └── utils.py
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

# Setup

## 1. Clone the repository

```bash
git clone https://github.com/sdukea/Multilingual-Speech-Moderation.git
cd Multilingual-Speech-Moderation
```

---

## 2. Create a virtual environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# Dataset

Ensure the following directory structure exists:

```
data/
└── hindi/
    ├── train/
    │   └── train.csv
    ├── validation/
    │   └── validation.csv
    └── test/
        └── test.csv
```

---

# Training

To fine-tune MuRIL:

```bash
python root/train.py
```

The first run will:

- Download Google's MuRIL model
- Fine-tune it on the dataset
- Save the trained model inside:

```
models/muril_classifier/
```

Training checkpoints are stored in:

```
outputs/checkpoints/
```

---

# Evaluation

After training completes:

```bash
python root/evaluate_model.py
```

The evaluation script prints:

- Accuracy
- Precision
- Recall
- F1 Score
- Classification Report
- Confusion Matrix

---

---

# Predictions & Raw Logits

The evaluation script uses Hugging Face's `Trainer.predict()` API, which returns:

- Predicted labels
- Raw logits
- Evaluation metrics

To inspect the model's raw outputs, edit `root/evaluate_model.py` and add:

```python
print("\nRaw Logits:\n")
print(predictions.predictions)
```

To convert the logits into probabilities:

```python
import torch

logits = torch.tensor(predictions.predictions)
probabilities = torch.softmax(logits, dim=1)

print("\nProbabilities:\n")
print(probabilities)
```

Each row corresponds to a single sample:

```
[logit_nonhate, logit_hate]
```

The predicted class is obtained using:

```python
predictions = np.argmax(predictions.predictions, axis=1)
```

To convert the predictions back to labels:

```python
from config import ID2LABEL

predicted_labels = [ID2LABEL[p] for p in predictions]
print(predicted_labels)
```

# Notes

- The `models/` directory is intentionally empty when cloned.
- The trained model is generated after running `train.py`.
- `evaluate_model.py` expects a trained model to exist inside `models/muril_classifier/`.

---

# Requirements

Recommended:

- Python 3.12
- PyTorch
- Hugging Face Transformers
- CUDA (optional, but recommended)

All required packages are listed in:

```
requirements.txt
```

---

# Troubleshooting

### Model not found

Run:

```bash
python root/train.py
```

before running the evaluation script.

---

### Dataset not found

Verify the dataset exists under:

```
data/hindi/
```

and that `config.py` points to the correct paths.

---

# Author

**Syon Duke Abraham**
