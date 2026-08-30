from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split

from config import RANDOM_SEED


PROJECT_ROOT = Path(__file__).resolve().parent.parent

original_validation = (PROJECT_ROOT /
    "data" /
    "hindi" /
    "validation" /
    "validation_original.csv"
)

validation_output = (PROJECT_ROOT /
    "data" /
    "hindi" /
    "validation" /
    "validation.csv"
)

test_output = (PROJECT_ROOT /
    "data" /
    "hindi" /
    "test" /
    "test.csv"
)


def main():

    print("Loading validation dataset...")
    df = pd.read_csv(original_validation)

    print(f"Loaded {len(df)} samples.")

    validation_df, test_df = train_test_split(df, test_size=0.5, random_state=RANDOM_SEED,
                                              shuffle=True)

    test_output.parent.mkdir(parents=True, exist_ok=True)
    validation_df.to_csv(validation_output, index=False)
    test_df.to_csv(test_output, index=False)

    print(f"Validation samples: {len(validation_df)}")
    print(f"Test samples       : {len(test_df)}")

if __name__ == "__main__":
    main()