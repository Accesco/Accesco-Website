# Append Q&A pairs from intent_training_faqs_knowledgebase.pdf to faq_labeled.csv
#
# The PDF uses its own format (section headers + Q:/A: lines) instead of the
# numbered-question format that extract_faq.py handles, so this script parses
# it directly and appends dedup-safe rows to faq_labeled.csv before retraining.
#
# Usage:
#   python3 chatbot-ml/data/add_knowledgebase_faqs.py

import csv
import os
import re

import pypdf

BASE = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE, "../../chatbot-data/intent_training_faqs_knowledgebase.pdf")
CSV_PATH = os.path.join(BASE, "../data/faq_labeled.csv")

SECTION_RE = re.compile(r"^\s*(\d{1,2})\.\s*([a-z_]+)\s*$")

# Optional per-section overrides in case the PDF's own intent names ever
# diverge from the classifier's label set. Empty for now — all 12 PDF
# sections map 1:1 to existing labels.
INTENT_OVERRIDES = {}


def extract_pairs():
    reader = pypdf.PdfReader(PDF_PATH)
    text = "\n".join((page.extract_text() or "") for page in reader.pages)

    pairs = []          # (intent, question, answer)
    current_intent = None
    pending_q = None    # collected Q lines (may span multiple lines)
    pending_a = []      # collected A lines (may span multiple lines)

    def flush():
        nonlocal pending_q, pending_a
        if current_intent and pending_q is not None and pending_a:
            pairs.append((
                current_intent,
                " ".join(pending_q).strip(),
                " ".join(pending_a).strip(),
            ))
        pending_q = None
        pending_a = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        # Section header like "1. delivery_partner" — starts a new intent
        m = SECTION_RE.match(line)
        if m and "Q:" not in line and "A:" not in line:
            flush()
            current_intent = INTENT_OVERRIDES.get(m.group(2), m.group(2))
            continue
        if line.startswith("Q:"):
            flush()
            pending_q = [line[2:].strip()]
        elif line.startswith("A:"):
            if pending_q is not None:
                pending_a = [line[2:].strip()]
        elif pending_a:
            pending_a.append(line)
        elif pending_q is not None:
            pending_q.append(line)
    flush()
    return pairs


def main():
    pairs = extract_pairs()
    if not pairs:
        raise SystemExit("No Q&A pairs parsed from the knowledgebase PDF")

    with open(CSV_PATH, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    existing_ids = {int(r["id"]) for r in rows}
    existing_questions = {r["question"].strip().lower() for r in rows}

    next_id = max(existing_ids) + 1
    added = 0
    for intent, question, answer in pairs:
        if question.lower() in existing_questions:
            continue
        rows.append({
            "id": str(next_id),
            "intent": intent,
            "question": question,
            "answer": answer,
        })
        next_id += 1
        added += 1

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    from collections import Counter
    added_intents = Counter(r["intent"] for r in rows if int(r["id"]) > max(existing_ids))
    print(f"Parsed {len(pairs)} pairs, appended {added} new rows → {CSV_PATH}")
    print(f"Added intent distribution: {dict(added_intents)}")
    print(f"Total rows: {len(rows)}")


if __name__ == "__main__":
    main()