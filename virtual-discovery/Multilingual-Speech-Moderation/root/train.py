import numpy as np
from metrics import compute_metrics
from pathlib import Path

from transformers import (Trainer, TrainingArguments)

from config import (
    TRAIN_DATA,
    VAL_DATA,
    RANDOM_SEED,
    MODEL_SAVE_DIR,
    BATCH_SIZE,
    NUM_EPOCHS,
    LEARNING_RATE,
    WEIGHT_DECAY,
    TEXT_COLUMN,
    LABEL_COLUMN
)

from dataset import HateSpeechDataset
from model import MuRILClassifier
from utils import set_seed

# the main
def main():

    set_seed(RANDOM_SEED)

    # auto mk-dir
    Path(MODEL_SAVE_DIR).parent.mkdir(parents=True, exist_ok=True)
    Path("outputs/checkpoints").mkdir(parents=True, exist_ok=True)
    Path("logs").mkdir(parents=True, exist_ok=True)

    dataset_buildr = HateSpeechDataset(
        text_col=TEXT_COLUMN,
        label_col=LABEL_COLUMN
    )

    train_dataset = dataset_buildr.build_dataset(TRAIN_DATA)
    val_dataset = dataset_buildr.build_dataset(VAL_DATA)

    # model stuff - get them here
    classifier = MuRILClassifier()
    model = classifier.get_model()

    training_args = TrainingArguments(output_dir="outputs/checkpoints", overwrite_output_dir=True,
                                      num_train_epochs=NUM_EPOCHS, learning_rate=LEARNING_RATE, 

                                      per_device_train_batch_size=BATCH_SIZE, 
                                      per_device_eval_batch_size=BATCH_SIZE, 

                                      weight_decay=WEIGHT_DECAY, eval_strategy="epoch",
                                      save_strategy="epoch", logging_strategy="epoch",
                                      load_best_model_at_end=True, metric_for_best_model="f1",
                                      greater_is_better=True, save_total_limit=2, report_to="none")
    
    trainer = Trainer(model=model, args=training_args, train_dataset=train_dataset, 
                      eval_dataset=val_dataset, compute_metrics=compute_metrics)
    
    # now start

    print("\nStarting training...\n")

    print("–––––")
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    print(f"Epochs: {NUM_EPOCHS}")
    print(f"Batch size: {BATCH_SIZE}")
    print(f"Learning rate: {LEARNING_RATE}")
    print(f"Device: {model.device}")
    print("–––––")
    
    trainer.train()
    print("\nTraining completed!\n")

    metrics = trainer.evaluate()
    print("\nValidation Results\n")

    for metric_name, metric_value in metrics.items():
        print(f"{metric_name}: {metric_value}")

    trainer.save_model(MODEL_SAVE_DIR)

    print("Model saved successfully!")

if __name__ == "__main__":
    main()