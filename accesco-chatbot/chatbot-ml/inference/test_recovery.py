import sys
import time

sys.path.insert(0, "accesco-chatbot/chatbot-ml/inference")

t0 = time.time()
import app

print(f"models loaded in {time.time()-t0:.0f}s\n")

# expected: row category name (or "ambiguous" → expected must be in options,
# or "pass" → must NOT be answered by recovery)
TEST = [
    # General FAQ answers (marketing Q&As) — the 19-row table can't answer
    ("what is the sku recovery framework?", "packaging and items"),
    ("how does the sku recovery framework work?", "flagged for recovery"),
    ("is there a fee for returning items?", "free"),
    ("do i get rewards for returning items?", "reward points"),
    # Row-table answers (category FAQs must not steal confident row matches)
    ("do you take back glass bottles?", "Beverages"),
    # Generic "bottles" is ambiguous for the row table — the Beverages FAQ
    # answers it directly now (handed back to delivery partner)
    ("do you take back bottles?", "handed back"),
    ("what do you do with empty pet bottles?", "ambiguous"),
    ("can i return cola cans?", "Beverages"),
    ("do you take back milk bottles?", "Fresh & Dairy"),
    ("what happens to yogurt tubs?", "Fresh & Dairy"),
    ("do you take back oil bottles?", "Pantry"),
    ("spice jars taken back?", "Pantry"),
    ("do you take back snack tubs?", "ambiguous"),
    ("do you take back shampoo bottles?", "Personal Care"),
    ("what do you do with empty shampoo bottles?", "ambiguous"),
    ("is my lotion bottle taken back?", "Personal Care"),
    ("do you take back glass jars?", "Beauty"),
    ("do you take back cosmetic bottles?", "Beauty"),
    ("do you take back detergent bottles?", "Home Care"),
    ("do you take back strollers?", "Baby"),
    # Baby FAQ now answers directly instead of "which one did you mean?"
    ("do you reuse baby toys?", "returned for cleaning"),
    ("do you take back pet carriers?", "ambiguous"),
    ("do you take back old clothes?", "Fashion"),
    ("what happens to returned shoes?", "Fashion"),
    ("do you take back cookware?", "Kitchen"),
    ("do you take back old phones?", "Electronics"),
    # Electronics FAQ now answers directly ("schedule a pickup") instead of
    # the bare row-table sentence
    ("is e-waste collected?", "schedule a pickup"),
    ("can i return my old charger?", "Electronics"),
    ("do you take back books?", "Books & Stationery"),
    ("do you take back backpacks?", "Books & Stationery"),
    ("do you take back fitness gear?", "Sports"),
    ("do you take back plastic toys?", "Toys"),
    ("do you take back garden pots?", "Gardening"),
    ("do you take back cardboard boxes?", "Packaging"),
    ("do you take back bubble wrap?", "Packaging"),
    ("do you take back food wrappers?", "Reject"),
    ("is biomedical waste accepted?", "Reject"),
    # typos / paraphrases
    ("wht do u do with empty cola botles", "Beverages"),
    ("do u take bak milk bottels", "Fresh & Dairy"),
    ("shampo bottles returned?", "ambiguous"),
    ("do you take back glass?", "ambiguous"),
    # do you take back plastic? → Toys is the only row with "plastic" — a
    # bare "plastic" is accepted as a design decision (plastic toys direct)
    ("do you take back plastic?", "Toys"),
    # non-recovery — must NOT be answered by recovery
    ("amul milk", "pass"),
    ("hello", "pass"),
    ("shampoo price", "pass"),
    ("where do u deliver", "pass"),
    ("dolo 650", "pass"),
    ("can i return my order?", "pass"),
    ("do you accept UPI?", "pass"),
    ("recover my password", "pass"),
    # conceptual — must use info path, not recovery table
    ("what is circular commerce?", "pass"),
]

correct = 0
wrong = []
for q, expected in TEST:
    intent, conf = app.classify_intent(q)
    reply = app.recovery_faq_reply(q) or app.recovery_reply_for(q, intent)
    best_name = "none"
    if reply:
        vec = app.EMBED_MODEL.encode([q], normalize_embeddings=True).astype("float32")[0]
        sims = [float((vec @ rv.T).max()) for rv in app.RECOVERY_ROW_VECTORS]
        order = sorted(range(len(sims)), key=lambda i: sims[i], reverse=True)
        best_name = app.RECOVERY_ROWS[order[0]]["category"]
        in_options = any(app.RECOVERY_ROWS[i]["category"] == expected for i in order[:3]) if reply.startswith("I found") else False

    if expected == "pass":
        ok = reply is None
    elif expected == "ambiguous":
        ok = reply is not None and reply.startswith("I found")
    else:
        ok = reply is not None and not reply.startswith("I found") and expected in reply

    if ok:
        correct += 1
        tag = "OK"
    else:
        wrong.append((q, expected, reply))
        tag = "WRONG"

    r_short = (reply or "").replace("\n", " | ")[:90]
    print(f"{tag:6} {q!r:45} intent={intent:<18} best={best_name:<20} → {r_short}")

print(f"\ncorrect={correct}/{len(TEST)} ({100*correct/len(TEST):.0f}%)")
if wrong:
    print("failures:")
    for q, exp, rep in wrong:
        print(f"  {q!r} expected={exp!r} reply={rep!r}")
