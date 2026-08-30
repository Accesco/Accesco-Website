import numpy as np
import evaluate

from typing import cast

accuracy = evaluate.load("accuracy")
precision = evaluate.load("precision")
recall = evaluate.load("recall")
f1 = evaluate.load("f1")

def compute_metrics(eval_prediction):
    logits, labels = eval_prediction
    preds = np.argmax(logits, axis=1)

    accuracy_result = cast(dict, accuracy.compute(predictions=preds, references=labels))
    precision_result = cast(dict, precision.compute(predictions=preds, references=labels))
    recall_result = cast(dict, recall.compute(predictions=preds, references=labels))
    f1_result = cast(dict, f1.compute(predictions=preds, references=labels))

    # so that we don't have problems below

    return {
        "accuracy": accuracy_result["accuracy"],
        "precision": precision_result["precision"],
        "recall": recall_result["recall"],
        "f1": f1_result["f1"],
    }