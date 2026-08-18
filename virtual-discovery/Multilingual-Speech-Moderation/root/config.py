# all this so that you don't hardcode - ever again

from pathlib import Path

# paths

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR = PROJECT_ROOT / "data"
MODEL_DIR = PROJECT_ROOT / "models"
OUTPUT_DIR = PROJECT_ROOT / "outputs"
LOG_DIR = PROJECT_ROOT / "logs"

TRAIN_DATA = DATA_DIR / "hindi" / "train" / "train.csv"
VAL_DATA = DATA_DIR / "hindi" / "validation" / "validation.csv"
TEST_DATA = DATA_DIR / "hindi" / "test" / "test.csv"

# model

MODEL_NAME = "google/muril-base-cased"
NUM_LABELS = 2
MAX_LENGTH = 128
MODEL_SAVE_DIR = "models/muril_classifier"

# training

BATCH_SIZE = 16

LEARNING_RATE = 2e-5

NUM_EPOCHS = 4

WEIGHT_DECAY = 0.01

RANDOM_SEED = 42

# labels
LABEL2ID = {
    "nonhate": 0,
    "hate": 1
}
ID2LABEL = {
    0: "nonhate",
    1: "hate"
}

TEXT_COLUMN = "text"
LABEL_COLUMN = "label"