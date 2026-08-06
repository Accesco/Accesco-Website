# End-to-end test suite runner for the Accesco chatbot /chat endpoint.
#
# Reads test_suite.csv (same folder) and fires every question at the running
# inference server, checking three things per row:
#   1. expected_intent  — pipe-separated alternatives ("grokly_grocery|unknown"),
#                         or "any" to skip the intent check
#   2. reply_contains   — pipe-separated substrings, case-insensitive; the reply
#                         must contain at least ONE of them (blank = skip)
#   3. expect_products  — "yes" (must return products), "no" (must not),
#                         "any" (skip)
#   4. expect_cards     — "yes" (must return product cards), "no" (must not),
#                         "any" (skip)
#   5. expect_action_url — pipe-separated substrings; at least one must appear
#                         in an action's url. Literal "none" = must have NO
#                         actions at all.
#   6. known_issue      — "yes" marks a row that currently fails because of a
#                         known model weakness (documented in notes). These are
#                         reported as XFAIL and don't fail the run; if one
#                         starts passing it's reported as XPASS (fixed — remove
#                         the flag).
#
# Usage:
#   1. Start the server:
#        cd accesco-chatbot/chatbot-ml
#        uvicorn inference.app:app --port 8000
#   2. Run the suite:
#        python test_suite_runner.py
#        python test_suite_runner.py --url http://localhost:8000 --category coverage
#        python test_suite_runner.py --only 41,55 -v
#
# Exit code 0 = all pass, 1 = failures (CI-friendly).

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request

# Windows console defaults to cp1252 which chokes on the arrows/bullets in
# server replies — force UTF-8 so printing never crashes the run.
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
SUITE_CSV = os.path.join(HERE, "test_suite.csv")


def call_chat(url: str, text: str, timeout: float = 30.0) -> dict:
    """POST /chat and return the parsed JSON response."""
    payload = json.dumps({"text": text}).encode("utf-8")
    req = urllib.request.Request(
        f"{url}/chat", data=payload,
        headers={"Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def check_row(row: dict, resp: dict) -> list[str]:
    """Return a list of failure descriptions (empty = pass)."""
    failures = []

    # 1. intent
    expected = row["expected_intent"].strip()
    if expected and expected != "any":
        allowed = {i.strip() for i in expected.split("|")}
        if resp["intent"] not in allowed:
            failures.append(
                f"intent: got '{resp['intent']}', expected one of {sorted(allowed)}"
            )

    # 2. reply substring (any-of, case-insensitive)
    contains = row["reply_contains"].strip()
    if contains:
        reply_l = resp["reply"].lower()
        options = [c.strip().lower() for c in contains.split("|") if c.strip()]
        if not any(opt in reply_l for opt in options):
            failures.append(f"reply: none of {options} found")

    # 3. products
    expect_products = row["expect_products"].strip().lower()
    got_products = bool(resp.get("products"))
    if expect_products == "yes" and not got_products:
        failures.append("products: expected results, got none")
    elif expect_products == "no" and got_products:
        failures.append(f"products: expected none, got {len(resp['products'])}")

    # 4. cards (Phase 4c conversion cards)
    expect_cards = row.get("expect_cards", "any").strip().lower()
    got_cards = bool(resp.get("cards"))
    if expect_cards == "yes" and not got_cards:
        failures.append("cards: expected cards, got none")
    elif expect_cards == "no" and got_cards:
        failures.append(f"cards: expected none, got {len(resp['cards'])}")

    # 5. action urls (any-of substrings; "none" = no actions at all)
    expect_url = row.get("expect_action_url", "").strip()
    if expect_url:
        action_urls = " | ".join(
            a.get("url", "") for a in (resp.get("actions") or [])
        ).lower()
        if expect_url.lower() == "none":
            if action_urls:
                failures.append(f"actions: expected none, got [{action_urls}]")
        else:
            options = [o.strip().lower() for o in expect_url.split("|") if o.strip()]
            if not any(opt in action_urls for opt in options):
                failures.append(f"actions: none of {options} in urls [{action_urls}]")

    return failures


def main() -> int:
    ap = argparse.ArgumentParser(description="Run the chatbot /chat test suite")
    ap.add_argument("--url", default="http://localhost:8000",
                    help="base URL of the inference server (default: %(default)s)")
    ap.add_argument("--csv", default=SUITE_CSV,
                    help="path to the test suite CSV (default: %(default)s)")
    ap.add_argument("--category", default=None,
                    help="only run rows of this category (e.g. coverage, recovery)")
    ap.add_argument("--only", default=None,
                    help="comma-separated row ids to run (e.g. 41,55,62)")
    ap.add_argument("-v", "--verbose", action="store_true",
                    help="print the full reply for every row, not just failures")
    args = ap.parse_args()

    with open(args.csv, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if args.category:
        rows = [r for r in rows if r["category"] == args.category]
    if args.only:
        wanted = {i.strip() for i in args.only.split(",")}
        rows = [r for r in rows if r["id"] in wanted]
    if not rows:
        print("No test rows matched the filters.")
        return 1

    # sanity: server up?
    try:
        with urllib.request.urlopen(f"{args.url}/health", timeout=5) as resp:
            health = json.loads(resp.read())
        print(f"Server OK — {health.get('products_indexed', '?')} products indexed\n")
    except (urllib.error.URLError, OSError) as e:
        print(f"ERROR: cannot reach {args.url} — is the server running?\n"
              f"  cd accesco-chatbot/chatbot-ml && uvicorn inference.app:app --port 8000\n"
              f"  ({e})")
        return 1

    passed, failed, errored = [], [], []
    xfailed, xpassed = [], []
    by_category: dict[str, list[bool]] = {}
    started = time.time()

    for row in rows:
        rid, cat, question = row["id"], row["category"], row["question"]
        known_issue = row.get("known_issue", "").strip().lower() == "yes"
        try:
            resp = call_chat(args.url, question)
        except (urllib.error.URLError, OSError, json.JSONDecodeError) as e:
            errored.append((row, str(e)))
            by_category.setdefault(cat, []).append(False)
            print(f"[ERR ] #{rid:>3} ({cat}) {question!r} — request failed: {e}")
            continue

        failures = check_row(row, resp)
        ok = not failures

        if known_issue:
            # Known model weaknesses: don't count against the run either way
            by_category.setdefault(cat, []).append(True)
            if ok:
                xpassed.append(row)
                status = "[XPASS]"  # fixed! remove the known_issue flag
            else:
                xfailed.append((row, failures, resp))
                status = "[XFAIL]"
        else:
            by_category.setdefault(cat, []).append(ok)
            if ok:
                passed.append(row)
                status = "[PASS]"
            else:
                failed.append((row, failures, resp))
                status = "[FAIL]"

        show = (status == "[FAIL]") or args.verbose or status == "[XPASS]"
        if show:
            print(f"{status} #{rid:>3} ({cat}) {question!r}")
            print(f"       intent={resp['intent']} conf={resp['confidence']:.2f} "
                  f"products={len(resp.get('products') or [])} "
                  f"cards={len(resp.get('cards') or [])} "
                  f"actions={[a.get('url') for a in (resp.get('actions') or [])]}")
            if failures:
                for fdesc in failures:
                    print(f"       ✗ {fdesc}")
            reply_preview = resp["reply"].replace("\n", " ")
            if len(reply_preview) > 160:
                reply_preview = reply_preview[:157] + "..."
            print(f"       reply: {reply_preview}")

    elapsed = time.time() - started
    total = len(rows)

    print("\n" + "=" * 62)
    print(f"RESULTS: {len(passed)}/{total} passed, {len(failed)} failed, "
          f"{len(xfailed)} known-issue (xfail), {len(xpassed)} xpass, "
          f"{len(errored)} errored  ({elapsed:.1f}s)")
    print("=" * 62)
    print(f"{'category':<12} {'pass':>5} {'total':>6}")
    for cat in sorted(by_category):
        oks = by_category[cat]
        marker = "" if all(oks) else "  <-- check"
        print(f"{cat:<12} {sum(oks):>5} {len(oks):>6}{marker}")

    if failed:
        print("\nFailed rows:", ", ".join(f"#{r['id']}" for r, _, _ in failed))
        print("Re-run just those:  python test_suite_runner.py --only " +
              ",".join(r["id"] for r, _, _ in failed) + " -v")
    if xfailed:
        print("\nKnown issues (xfail):",
              ", ".join(f"#{r['id']}" for r, _, _ in xfailed))
    if xpassed:
        print("\nXPASS (fixed — remove known_issue flag):",
              ", ".join(f"#{r['id']}" for r in xpassed))

    return 0 if not failed and not errored else 1


if __name__ == "__main__":
    sys.exit(main())
