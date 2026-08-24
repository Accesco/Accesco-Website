"""IndicTrans2 distilled translation sidecar (port 8001).

Runs in its own venv (.venv-translate, transformers 4.x) because IndicTrans2's
custom modeling/tokenizer code predates transformers 5.x used by the main
inference server. The main server calls this over HTTP:

    POST /to_english    {"text": "...", "lang": "hi|te|kn"}
    POST /from_english  {"text": "...", "lang": "hi|te|kn"}
    GET  /health

Start with:
    .venv-translate/bin/python -m uvicorn inference.translate_service:app \
        --port 8001
"""

import os

import torch
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

try:
    from IndicTransToolkit import IndicProcessor
except ImportError:
    from IndicTransToolkit.processor import IndicProcessor

LANG_MAP = {
    "hi": "hin_Deva",
    "te": "tel_Telu",
    "kn": "kan_Knda",
}

IE_NAME = "ai4bharat/indictrans2-indic-en-dist-200M"
EI_NAME = "ai4bharat/indictrans2-en-indic-dist-200M"

app = FastAPI(title="Accesco translate sidecar")
_state = {"ready": False, "ie_tok": None, "ie_model": None,
          "ei_tok": None, "ei_model": None, "ip": None}


class TranslateRequest(BaseModel):
    text: str
    lang: str


class TranslateResponse(BaseModel):
    translation: str


def _load():
    ip = IndicProcessor(inference=True)

    def _one(name):
        tok = AutoTokenizer.from_pretrained(name, trust_remote_code=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(name, trust_remote_code=True)
        model.eval()
        return tok, model

    ie_tok, ie_model = _one(IE_NAME)
    ei_tok, ei_model = _one(EI_NAME)
    torch.set_num_threads(int(os.environ.get("TORCH_THREADS", "4")))
    _state.update(ready=True, ip=ip, ie_tok=ie_tok, ie_model=ie_model,
                  ei_tok=ei_tok, ei_model=ei_model)


@app.on_event("startup")
def _startup():
    _load()


def _generate(tok, model, texts, src_flores, tgt_flores,
              max_new_tokens=128):
    ip = _state["ip"]
    batch = ip.preprocess_batch(texts, src_lang=src_flores, tgt_lang=tgt_flores)
    inputs = tok(batch, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        out = model.generate(**inputs, min_length=1,
                             max_new_tokens=max_new_tokens, num_beams=5)
    with tok.as_target_tokenizer():
        dec = tok.batch_decode(out, skip_special_tokens=True)
    return ip.postprocess_batch(dec, lang=tgt_flores)


@app.get("/health")
def health():
    return {"ready": _state["ready"]}


@app.post("/to_english", response_model=TranslateResponse)
def to_english(req: TranslateRequest):
    flores = LANG_MAP.get(req.lang)
    if not flores or not req.text.strip() or not _state["ready"]:
        return TranslateResponse(translation=req.text)
    out = _generate(_state["ie_tok"], _state["ie_model"],
                    [req.text], flores, "eng_Latn")
    return TranslateResponse(translation=out[0].strip())


@app.post("/from_english", response_model=TranslateResponse)
def from_english(req: TranslateRequest):
    flores = LANG_MAP.get(req.lang)
    if not flores or not req.text.strip() or not _state["ready"]:
        return TranslateResponse(translation=req.text)
    out = _generate(_state["ei_tok"], _state["ei_model"],
                    [req.text], "eng_Latn", flores)
    return TranslateResponse(translation=out[0].strip())


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
