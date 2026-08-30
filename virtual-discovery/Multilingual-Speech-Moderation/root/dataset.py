import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer

from config import (
    MODEL_NAME,
    LABEL2ID,
    MAX_LENGTH
)

from prepr import preprocess_dataframe

class HateSpeechDataset:

    def __init__(self, text_col, label_col):
        self.text = text_col
        self.label = label_col

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    def load_df(self, csv_p: str):

        df = pd.read_csv(csv_p)
        df = preprocess_dataframe(df, self.text)

        return df

    # cannot read hate/non-hate from data - so encode

    def encode_labels(self, df: pd.DataFrame):

        df = df.copy()
        df[self.label] = (df[self.label].map(LABEL2ID))
        return df
    
    def tokenize(self, examples):
        
        return self.tokenizer(examples[self.text], truncation=True, padding='max_length',
                              max_length=MAX_LENGTH)
    
    def df_2_datas(self, df) -> Dataset:

        dataset = Dataset.from_pandas(df)
        dataset = dataset.map(
            self.tokenize,
            batched=True
        )

        # HF expects the target column to be "labels"
        dataset = dataset.rename_column(self.label, "labels")

        dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
        return dataset

    # finally

    def build_dataset(self, csv_p) -> Dataset:

        df = self.load_df(csv_p)
        df = self.encode_labels(df)

        return self.df_2_datas(df)
