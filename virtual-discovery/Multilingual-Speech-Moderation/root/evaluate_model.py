import numpy as np
from transformers import Trainer, TrainingArguments

from sklearn.metrics import (classification_report, confusion_matrix)

from config import (
    TEST_DATA,
    MODEL_SAVE_DIR,
    TEXT_COLUMN,
    LABEL_COLUMN
)

from dataset import HateSpeechDataset
from model import MuRILClassifier
from metrics import compute_metrics

# need this for Pylance error fixes
from typing import cast
from datasets import Dataset

def main():

    dataset_builder = HateSpeechDataset(text_col=TEXT_COLUMN,label_col=LABEL_COLUMN)
    test_dataset = dataset_builder.build_dataset(TEST_DATA)

    print(f"Loaded {len(test_dataset)} test samples.")

    # model
    classifier = MuRILClassifier.load(MODEL_SAVE_DIR)
    model = classifier.get_model()
    model.eval()

    # for after eval
    eval_args = TrainingArguments(
    output_dir="outputs/evaluation",
    per_device_eval_batch_size=16,
    report_to="none")

    trainer = Trainer(
    model=model,
    args=eval_args)

    # interpret evals now
    print("\nRunning evaluation...\n")

    test_dataset = cast(Dataset, test_dataset)

    predictions = trainer.predict(test_dataset) # type: ignore

    # logits to labels
    preds = np.argmax(predictions.predictions, axis=1)
    labels = cast(np.ndarray, predictions.label_ids)
    # prints needed

    print("\nClassification Report\n")
    print(classification_report(labels, preds, digits=4))

    cm = confusion_matrix(labels, preds)
    print("\nConfusion Matrix\n")
    print(cm)

    print("\nTrainer Metrics\n")
    print(predictions.metrics)  

    print("Model loaded successfully.")
    
    # the raw logits

    print("\nRaw logits:\n")
    
    logits = predictions.predictions
    print(logits)

if __name__ == "__main__":
    main()