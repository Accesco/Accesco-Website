# Extract Q&A pairs from FAQ PDFs → faq_data.json
#
# Scans all PDFs in chatbot-data/ (mergedFAQs.pdf + any future FAQ PDFs),
# detects numbered questions like "12. How is Accesco Living different...?"
# and pairs each with the following answer text.
#
# Usage:
#   python3 chatbot-ml/data/extract_faq.py

import json
import os
import re

import fitz

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../chatbot-data")
OUT_PATH = os.path.join(os.path.dirname(__file__), "../data/faq_data.json")

# Matches a numbered question: "12. How is Accesco Living different...?"
QUESTION_RE = re.compile(r"^(\d{1,4})\.\s+(.+)$")

IGNORE_PREFIXES = (
    "Source", "Accesco Living —", "All questions", "Previously unanswered",
)


def is_question(line):
    """True if the line looks like a numbered question."""
    if not QUESTION_RE.match(line.strip()):
        return False
    stripped = line.strip()
    return not any(stripped.startswith(p) for p in IGNORE_PREFIXES)


def extract_faqs():
    faqs = []
    pdfs = sorted(f for f in os.listdir(DATA_DIR) if f.lower().endswith(".pdf"))
    if not pdfs:
        raise FileNotFoundError(f"No PDF files found in {DATA_DIR}")
    print(f"Processing {len(pdfs)} PDF(s): {pdfs}")

    for filename in pdfs:
        path = os.path.join(DATA_DIR, filename)
        doc = fitz.open(path)
        text = "\n".join(page.get_text() for page in doc)
        doc.close()

        lines = [l.strip() for l in text.split("\n") if l.strip()]
        for i, line in enumerate(lines):
            if not is_question(line):
                continue
            number, question = QUESTION_RE.match(line).groups()
            # Multi-line question: merge following lines until it ends with ? or .
            j = i + 1
            while j < len(lines) and not is_question(lines[j]):
                if question.endswith("?") or question.endswith("."):
                    break
                question += " " + lines[j]
                j += 1
            # Answer = everything until the next numbered question
            answer_lines = []
            while j < len(lines) and not is_question(lines[j]):
                answer_lines.append(lines[j])
                j += 1
            answer = " ".join(answer_lines).strip()
            if answer:
                faqs.append({
                    "id": int(number),
                    "question": question,
                    "answer": answer,
                    "source": filename,
                })
    faqs.sort(key=lambda x: x["id"])
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(faqs, f, indent=2, ensure_ascii=False)
    print(f"Extracted {len(faqs)} Q&A pairs → {OUT_PATH}")
    return faqs


if __name__ == "__main__":
    extract_faqs()
