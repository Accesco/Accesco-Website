import torch
from transformers import (AutoTokenizer, AutoModelForSequenceClassification)
from config import (
    MODEL_NAME,
    NUM_LABELS,
    ID2LABEL,
    LABEL2ID
)

# MuRIL knows hindi, tamil, kannada, telugu + sentence meaning
# but we now have to fine tune it to add a classification head - that is what
# AutoModelForSequenceClassification does


class MuRILClassifier:
    def __init__(self):
        
        self.model = (
            AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=NUM_LABELS,
                                                               id2label=ID2LABEL, label2id=LABEL2ID))
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)

    def get_model(self):
        return self.model
    
    def get_tokenizer(self):
        return self.tokenizer

    def save(self, save_dir):
        self.model.save_pretrained(save_dir)

    @classmethod
    def load(cls, model_dir):
        inst = cls()

        # for both - almost forgot
        inst.model = (AutoModelForSequenceClassification.from_pretrained(model_dir))
        inst.tokenizer = AutoTokenizer.from_pretrained(model_dir)

        inst.model.to(inst.device)
        return inst
    
    def predict(self, inputs):
        self.model.eval()

        with torch.no_grad():
            outputs = self.model(**inputs)

            prediction = torch.argmax(outputs.logits, dim=1)

            return prediction

    