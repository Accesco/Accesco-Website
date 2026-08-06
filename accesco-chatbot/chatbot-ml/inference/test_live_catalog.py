# Unit tests for the live catalog sync service (chatbot-ml/inference/live_catalog.py)
#
# Stdlib-only runner (no pytest) so it runs anywhere: plain asserts + a main()
# that prints a pass/fail scoreboard and exits 0/1 — same style as
# test_suite_runner.py. Uses a fake embed model (deterministic vectors) so
# these tests never download or load the real sentence transformer.
#
# Run:
#   /opt/anaconda3/bin/python3.13 accesco-chatbot/chatbot-ml/inference/test_live_catalog.py

import hashlib
import json
import os
import sys
import tempfile
import threading
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import faiss
import numpy as np

from live_catalog import (
    LiveCatalog,
    normalize_products,
    _to_price_str,
    _first_image_url,
    LOCALMEDS_CATEGORIES,
)

PASS = 0
FAIL = 0
FAILURES = []


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        FAILURES.append(name)
        print(f"  FAIL  {name}  {detail}")


# ─── fixtures ───────────────────────────────────────────────────────────────

GROKLY_FIXTURE = [
    {
        "id": "dairy-001", "sku": "dairy-001", "ventureId": "grokly",
        "name": "Amul Gold Full Cream Milk 1 L", "brand": "Amul",
        "category": "dairy-breakfast", "subCategory": None,
        "price": 63, "mrp": 68, "unit": "1 L",
        "image": "http://img/amul.jpg", "inStock": True,
    },
    {
        "id": "pharma-001", "sku": "pharma-001", "ventureId": "grokly",
        "name": "Dolo 650", "brand": "Micro Labs", "category": "pharma-wellness",
        "subCategory": None, "price": 30, "mrp": 34, "unit": "strip",
        "image": "http://img/dolo.jpg", "inStock": False,
    },
    {
        "id": "noname-1", "sku": "noname-1", "ventureId": "grokly",
        "name": None, "category": "munchies", "price": 10, "mrp": 12,
    },
]

INSTASTYLE_FIXTURE = [
    {
        "_docId": "docA", "id": "sku_1", "name": "Classic T-Shirt", "brand": "ClassicWear",
        "category": "men", "subcategory": "T-Shirts", "price": 1500,
        "discountedPrice": -1, "originalPrice": 1800, "inStock": True,
        "images": [{"url": "http://img/tshirt.jpg", "alt": "T", "order": 1, "isPrimary": True}],
    },
    {
        "_docId": "docB", "id": "sku_2", "name": "Denim Jacket", "brand": "ThriftCo",
        "category": "women", "subcategory": "Jackets", "price": 900,
        "discountedPrice": 700, "originalPrice": 1200, "inStock": True,
        "images": [],
        "colors": [{"name": "Blue", "images": ["http://img/jacket.jpg"]}],
    },
    {
        "_docId": "docC", "id": "sku_3", "name": "Stripe Shirt", "brand": "Unbranded",
        "category": "men", "subcategory": None, "price": 800, "inStock": True,
        "images": [],
    },
]


class FakeEmbed:
    """Deterministic pseudo-embedder: hash each text into a fixed vector."""

    def encode(self, texts, normalize_embeddings=True):
        vecs = []
        for t in texts:
            h = hashlib.sha256(t.encode("utf-8")).digest()
            v = np.frombuffer(h, dtype=np.uint8)[:16].astype(np.float32)
            v = v / (np.linalg.norm(v) + 1e-9)
            vecs.append(v)
        return np.stack(vecs) if vecs else np.zeros((0, 16), dtype=np.float32)


# ─── normalization ──────────────────────────────────────────────────────────

def test_normalization(_=None):
    norm = normalize_products(GROKLY_FIXTURE, INSTASTYLE_FIXTURE)
    check("normalized count drops unnamed rows", len(norm) == 5, f"got {len(norm)}")

    amul = next(p for p in norm if p["sku"] == "dairy-001")
    check("grokly price coerced", amul["price"] == "63", amul["price"])
    check("grokly unit kept", amul["unit"] == "1 L")
    check("grokly url is search link", amul["url"].startswith("/services/grokly?search="))
    check("grokly sub_category empty for null", amul["sub_category"] == "")

    dolo = next(p for p in norm if p["sku"] == "pharma-001")
    check("pharma slug maps to LocalMeds", dolo["service"] == "LocalMeds", dolo["service"])
    check("in_stock preserved", dolo["in_stock"] is False)

    tee = next(p for p in norm if p["sku"] == "sku_1")
    check("instastyle -1 discount falls back to price", tee["price"] == "1500", tee["price"])
    check("instastyle mrp from originalPrice", tee["mrp"] == "1800")
    check("instastyle image from images[0].url", tee["image"] == "http://img/tshirt.jpg")
    check("instastyle url uses _docId",
          tee["url"] == "/services/instastyle/products/docA", tee["url"])
    check("instastyle service", tee["service"] == "InstaStyle")

    jacket = next(p for p in norm if p["sku"] == "sku_2")
    check("instastyle discount price wins", jacket["price"] == "700", jacket["price"])
    check("instastyle image fallback to color images",
          jacket["image"] == "http://img/jacket.jpg", jacket["image"])

    shirt = next(p for p in norm if p["sku"] == "sku_3")
    check("instastyle no image -> empty", shirt["image"] == "")
    check("instastyle empty subcategory", shirt["sub_category"] == "")


def test_price_str(_=None):
    check("price int stays int str", _to_price_str(21) == "21")
    check("price float truncates .0", _to_price_str(21.0) == "21")
    check("price float keeps decimals", _to_price_str(21.5) == "21.5")
    check("price str passes through", _to_price_str("63") == "63")
    check("price None -> empty", _to_price_str(None) == "")
    check("price empty -> empty", _to_price_str("") == "")


def test_image_url(_=None):
    check("dict image", _first_image_url({"images": [{"url": "a.jpg"}]}) == "a.jpg")
    check("string image", _first_image_url({"images": ["a.jpg"]}) == "a.jpg")
    check("colors fallback",
          _first_image_url({"colors": [{"images": ["b.jpg"]}]}) == "b.jpg")
    check("empty -> ''", _first_image_url({}) == "")


# ─── LiveCatalog behaviour ──────────────────────────────────────────────────

def make_catalog(tmpdir, products=None, poll=600):
    return LiveCatalog(
        "http://stub.invalid", FakeEmbed(),
        cache_path=os.path.join(tmpdir, "live_catalog.json"),
        poll_seconds=poll, autostart=False,
    )


def test_hash_and_guard(tmpdir):
    cat = make_catalog(tmpdir)
    prods = normalize_products(GROKLY_FIXTURE, INSTASTYLE_FIXTURE)
    h1 = LiveCatalog.compute_hash(prods)
    h2 = LiveCatalog.compute_hash(list(reversed(prods)))
    check("hash stable under ordering", h1 == h2)
    check("hash differs with data", h1 != LiveCatalog.compute_hash(prods[:-1]))

    # monkeypatch fetch so refresh() runs offline
    cat.fetch_products = lambda: prods
    check("first refresh rebuilds", cat.refresh() == "rebuilt")
    check("hash guard skips identical rebuild", cat.refresh() == "unchanged")
    prods2 = list(prods) + [dict(prods[0], sku="new-1", name="New SKU")]
    cat.fetch_products = lambda: prods2
    check("changed data rebuilds", cat.refresh() == "rebuilt")
    check("state count after rebuild", cat.state()["products_indexed"] == len(prods2))
    check("cache file written", os.path.exists(cat._cache_path))


def test_atomic_swap(tmpdir):
    cat = make_catalog(tmpdir)
    prods = normalize_products(GROKLY_FIXTURE, INSTASTYLE_FIXTURE)
    cat._products, cat._index, cat._hash = [], None, None
    cat.fetch_products = lambda: prods
    cat.refresh()

    # Readers must never observe a partial swap: take snapshots while
    # refreshing repeatedly and verify product/index pairs stay consistent.
    snapshots = []
    def reader():
        for _ in range(40):
            p, i = cat.snapshot()
            snapshots.append((len(p), i is not None))
            time.sleep(0.001)
    t = threading.Thread(target=reader)
    t.start()
    cat.fetch_products = lambda: [dict(prods[0], name=f"v{n}") for n in range(5)]
    for _ in range(10):
        cat.refresh()
    t.join()
    check("all reader snapshots consistent",
          all(n == len(prods) for n, _ in snapshots),
          f"{snapshots[:5]}...")


def test_empty_catalog(tmpdir):
    cat = make_catalog(tmpdir)
    check("cold snapshot empty", cat.snapshot() == ([], None))
    check("cold state zero", cat.state()["products_indexed"] == 0)
    cat.fetch_products = lambda: (_ for _ in ()).throw(
        RuntimeError("both endpoints empty"))
    check("fetch failure propagates on refresh", _raises(cat.refresh))
    check("state still zero after failure", cat.state()["products_indexed"] == 0)


def test_cache_roundtrip(tmpdir):
    cat = make_catalog(tmpdir)
    prods = normalize_products(GROKLY_FIXTURE, INSTASTYLE_FIXTURE)
    cat.fetch_products = lambda: prods
    cat.refresh()
    first = cat.state()

    cat2 = make_catalog(tmpdir)
    st = cat2.state()
    check("cache reload count", st["products_indexed"] == len(prods),
          st["products_indexed"])
    check("cache reload hash", st["catalog_hash"] == first["catalog_hash"])
    check("cache reload builds searchable index", cat2.snapshot()[1] is not None)

    # a corrupted cache must not crash startup
    with open(cat2._cache_path, "w") as f:
        f.write("{not json")
    cat3 = make_catalog(tmpdir)
    check("corrupted cache ignored", cat3.state()["products_indexed"] == 0)


def test_fetch_failure_raise(tmpdir=None):
    cat = make_catalog(tmpdir)
    try:
        cat._get_json("/nope")
    except Exception as exc:
        check("unreachable site raises", isinstance(exc, Exception))
    else:
        check("unreachable site raises", False)


def _raises(fn):
    try:
        fn()
        return False
    except Exception:
        return True


def main():
    global PASS, FAIL, FAILURES
    tests = [
        ("normalization", test_normalization),
        ("price coercion", test_price_str),
        ("image url extraction", test_image_url),
        ("hash + guard", test_hash_and_guard),
        ("atomic swap", test_atomic_swap),
        ("empty catalog", test_empty_catalog),
        ("disk cache round-trip", test_cache_roundtrip),
        ("fetch failure", test_fetch_failure_raise),
    ]
    for name, fn in tests:
        print(f"\n[{name}]")
        with tempfile.TemporaryDirectory() as tmp:
            fn(tmp)
    print(f"\n{'-'*40}\n{PASS} passed, {FAIL} failed")
    if FAIL:
        print("Failed:", ", ".join(FAILURES))
        sys.exit(1)


if __name__ == "__main__":
    main()
