# Live product catalog sync for the Accesco chatbot.
#
# Replaces the static SKU-Master-xlsx catalog with a live catalog fetched from
# the Accesco Next.js site's Firestore-backed product APIs. Rebuilds the FAISS
# index in memory and hot-swaps it atomically.
#
# Refresh triggers:
#   - request_refresh() (the site's /refresh-products push hook after writes)
#   - 10-minute polling backup (single daemon worker, coalesces bursts)
#
# Disk cache (data/live_catalog.json) survives chatbot restarts while the site
# is down. FAISS is never persisted - rebuilding takes seconds.

import hashlib
import json
import os
import threading
import time
import urllib.parse

import faiss
import numpy as np
import requests

GROKLY_ENDPOINT = "/api/products"
INSTASTYLE_ENDPOINT = "/api/instastyle/products"
HTTP_TIMEOUT = 15
CACHE_FILENAME = "live_catalog.json"

# Grokly venture products in these categories are sold through LocalMeds
# (slug-style Firestore categories map to the old "Pharma & Wellness" labelling)
LOCALMEDS_CATEGORIES = {"pharma-wellness"}


def _to_price_str(value) -> str:
    if value is None or value == "":
        return ""
    try:
        f = float(value)
        if f == int(f):
            return str(int(f))
        return str(f)
    except (TypeError, ValueError):
        return str(value).strip()


def _normalize_grokly(item: dict) -> dict:
    category = str(item.get("category") or "")
    return {
        "sku": str(item.get("sku") or item.get("id") or ""),
        "name": str(item.get("name") or ""),
        "brand": str(item.get("brand") or ""),
        "category": category,
        "sub_category": str(item.get("subCategory") or ""),
        "price": _to_price_str(item.get("price")),
        "mrp": _to_price_str(item.get("mrp")),
        "unit": str(item.get("unit") or ""),
        "image": str(item.get("image") or ""),
        "in_stock": item.get("inStock", True),
        "service": "LocalMeds" if category in LOCALMEDS_CATEGORIES else "Grokly",
        "url": "/services/grokly?search="
        + urllib.parse.quote(str(item.get("name") or "")),
    }


def _first_image_url(item: dict) -> str:
    """Extract the primary image URL from an InstaStyle doc. The top-level
    `images` field is a list of {url, alt, ...} objects; color images are
    plain strings. Sentinel/absent values return ''."""
    for images in (item.get("images"), (item.get("colors") or [{}])[0].get("images")):
        if not images:
            continue
        first = images[0]
        if isinstance(first, dict):
            return str(first.get("url") or "")
        if isinstance(first, str):
            return str(first)
    return ""


def _normalize_instastyle(item: dict) -> dict:
    # discountedPrice is a -1 sentinel when there is no discount
    price = item.get("discountedPrice")
    if price is None or (isinstance(price, (int, float)) and price <= 0):
        price = item.get("price")
    return {
        "sku": str(item.get("id") or item.get("_docId") or ""),
        "name": str(item.get("name") or ""),
        "brand": str(item.get("brand") or ""),
        "category": str(item.get("category") or ""),
        "sub_category": str(item.get("subcategory") or ""),
        "price": _to_price_str(price),
        "mrp": _to_price_str(item.get("originalPrice")),
        "unit": str(item.get("unit") or ""),
        "image": _first_image_url(item),
        "in_stock": item.get("inStock", True),
        "service": "InstaStyle",
        "url": "/services/instastyle/products/" + str(item.get("_docId") or ""),
    }


def normalize_products(grokly_products: list[dict], instastyle_products: list[dict]) -> list[dict]:
    merged = [_normalize_grokly(i) for i in grokly_products]
    merged += [_normalize_instastyle(i) for i in instastyle_products]
    # Drop entries without a name - nothing meaningful to embed or search
    return [p for p in merged if p["name"]]


class LiveCatalog:
    """Fetches the live product catalog, rebuilds the FAISS index in memory,
    and hot-swaps it atomically. One daemon worker thread handles push
    events and the 10-minute polling backup."""

    def __init__(self, site_url, embed_model, cache_path=None, poll_seconds=600,
                 autostart=True, log=print):
        self._site_url = site_url.rstrip("/")
        self._embed = embed_model
        self._cache_path = cache_path
        self._poll_seconds = poll_seconds
        self._log = log
        self._lock = threading.Lock()
        self._products = []
        self._index = None
        self._hash = None
        self._last_sync = None
        self._rebuild_pending = threading.Event()
        self._load_cache()
        if autostart:
            self._worker = threading.Thread(target=self._run, daemon=True)
            self._worker.start()
            self._rebuild_pending.set()

    # ---- public API ------------------------------------------------------

    def snapshot(self) -> tuple[list[dict], object | None]:
        """(products, index) pair under the lock. Never the live list itself."""
        with self._lock:
            return list(self._products), self._index

    def state(self) -> dict:
        with self._lock:
            return {
                "products_indexed": len(self._products),
                "catalog_hash": self._hash,
                "last_sync": self._last_sync,
            }

    def request_refresh(self) -> None:
        self._rebuild_pending.set()

    def refresh(self) -> str:
        """One fetch+rebuild cycle. Returns 'rebuilt' or 'unchanged'.
        Raises if the fetch fails (cache/current index stay live).
        The new index is built OUTSIDE the lock, so embedding thousands of
        products never blocks readers; the swap itself is atomic."""
        products = self.fetch_products()
        new_hash = self.compute_hash(products)
        with self._lock:
            if self._index is not None and new_hash == self._hash:
                self._last_sync = time.time()
                return "unchanged"
        index = self.build_index(products)
        with self._lock:
            self._products = products
            self._index = index
            self._hash = new_hash
            self._last_sync = time.time()
        self._save_cache()
        return "rebuilt"

    # ---- fetching --------------------------------------------------------

    def fetch_products(self) -> list[dict]:
        """GET both product APIs and merge into normalized records.
        Raises only if BOTH endpoints fail."""
        grokly = self._get_json(GROKLY_ENDPOINT + "?ventureId=grokly&limit=1000")
        grokly_items = (grokly or {}).get("products") or []
        errors = []
        instastyle_items = []
        try:
            insta = self._get_json(INSTASTYLE_ENDPOINT + "?limit=1000")
            instastyle_items = (insta or {}).get("products") or []
        except requests.RequestException as exc:
            errors.append(str(exc))
        if not grokly_items and not instastyle_items:
            detail = ("; ".join(errors)) if errors else "both endpoints empty"
            raise RuntimeError("Product fetch failed: " + detail)
        return normalize_products(grokly_items, instastyle_items)

    def _get_json(self, path: str) -> dict:
        resp = requests.get(self._site_url + path, timeout=HTTP_TIMEOUT)
        resp.raise_for_status()
        return resp.json()

    # ---- index building --------------------------------------------------

    @staticmethod
    def compute_hash(products: list[dict]) -> str:
        key = json.dumps(
            sorted(products, key=lambda p: (p["sku"], p["service"])),
            sort_keys=True,
        )
        return hashlib.sha256(key.encode("utf-8")).hexdigest()

    def build_index(self, products: list[dict]):
        texts = [
            " ".join(str(p.get(f) or "") for f in
                     ("name", "brand", "category", "sub_category"))
            for p in products
        ]
        vectors = self._embed.encode(texts, normalize_embeddings=True).astype(np.float32)
        index = faiss.IndexFlatL2(vectors.shape[1])
        index.add(vectors)
        return index

    # ---- disk cache ------------------------------------------------------

    def _load_cache(self) -> None:
        if not self._cache_path or not os.path.exists(self._cache_path):
            return
        try:
            with open(self._cache_path, encoding="utf-8") as f:
                data = json.load(f)
            products = data.get("products") or []
            if not products:
                return
            self._products = products
            self._hash = data.get("hash")
            self._last_sync = data.get("last_sync")
            self._index = self.build_index(products)
            self._log(f"[live_catalog] loaded {len(products)} products from disk cache")
        except Exception as exc:
            self._log(f"[live_catalog] cache load failed: {exc}")

    def _save_cache(self) -> None:
        if not self._cache_path:
            return
        with self._lock:
            data = {
                "products": self._products,
                "hash": self._hash,
                "last_sync": self._last_sync,
            }
        tmp = self._cache_path + ".tmp"
        try:
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(data, f)
            os.replace(tmp, self._cache_path)
        except OSError as exc:
            self._log(f"[live_catalog] cache write failed: {exc}")

    # ---- worker thread ---------------------------------------------------

    def _run(self) -> None:
        while True:
            triggered = self._rebuild_pending.wait(timeout=self._poll_seconds)
            self._rebuild_pending.clear()
            try:
                result = self.refresh()
                if result == "rebuilt":
                    self._log(f"[live_catalog] rebuilt: {len(self._products)} products")
            except Exception as exc:
                self._log(f"[live_catalog] refresh failed: {exc}")
