import pandas as pd
import unicodedata


def normalize_unicode(text):
    if pd.isna(text):

        return ""

    return unicodedata.normalize("NFC", str(text))


def remove_extra_whitespace(text):
    return " ".join(text.split())


def clean_text(text):
    text = normalize_unicode(text)
    text = remove_extra_whitespace(text)
    return text


def preprocess_dataframe(df, text_column):

    df = df.copy()
    df[text_column] = df[text_column].apply(clean_text)
    df = df.drop_duplicates()
    df = df.dropna()

    return df