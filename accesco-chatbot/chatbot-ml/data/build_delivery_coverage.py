# Build delivery coverage JSON from Tier List.xlsx + coordinates .xlsx
#
# Merges the two planning spreadsheets (both keyed by PINCODE, 110 rows each)
# into one structured file consumed by the inference server:
#   chatbot-ml/data/delivery_coverage.json
#
# One row = one pincode zone. The "AREAS COVERED" column can contain several
# comma-separated names ("Mahadevapura, Hoodi"), so each zone stores the raw
# area string plus a flattened list of individual area names used for
# user-query matching at inference time.
#
# Usage:
#   python3 chatbot-ml/data/build_delivery_coverage.py

import json
import os

import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../chatbot-data")
OUT_PATH = os.path.join(os.path.dirname(__file__), "delivery_coverage.json")

TIER_PATH = os.path.join(DATA_DIR, "Tier List.xlsx")


def _resolve(*candidates: str) -> str:
    """Return the first existing path among candidates, or the first one."""
    for c in candidates:
        if os.path.exists(c):
            return c
    return candidates[0]


# Reconcile the "coordinates .xlsx" (space) vs "coordinates.xlsx" (no space)
# filename mismatch between machines — whichever actually exists is used.
COORD_PATH = _resolve(
    os.path.join(DATA_DIR, "coordinates .xlsx"),
    os.path.join(DATA_DIR, "coordinates.xlsx"),
)


def load_sheet(path: str) -> list[dict]:
    df = pd.read_excel(path)
    df = df.dropna(subset=["PINCODE"])
    df["PINCODE"] = df["PINCODE"].astype(int).astype(str)
    return df.to_dict("records")


def split_areas(raw: str) -> list[str]:
    parts = [p.strip() for p in str(raw).replace(" and ", ",").split(",")]
    return [p for p in parts if p]


def main():
    tiers = load_sheet(TIER_PATH)
    coords = load_sheet(COORD_PATH)
    coord_by_pin = {r["PINCODE"]: r for r in coords}

    zones = []
    for r in tiers:
        pin = r["PINCODE"]
        c = coord_by_pin[pin]
        areas_text = str(c.get("COVERED AREAS", "")).strip()
        zone = {
            "pincode": pin,
            "areas_text": areas_text,
            "areas": split_areas(areas_text),
            "tier": str(r["TIER"]).strip(),
            "opportunity_score": r["OPPORTUNITY_SCORE_V3"],
            "lat": c.get("lat"),
            "long": c.get("long"),
        }
        zones.append(zone)

    zones.sort(key=lambda z: z["pincode"])
    with open(OUT_PATH, "w") as f:
        json.dump({"zones": zones}, f, indent=2)
    total_areas = sum(len(z["areas"]) for z in zones)
    print(f"Built {len(zones)} zones, {total_areas} individual area names → {OUT_PATH}")


if __name__ == "__main__":
    main()
