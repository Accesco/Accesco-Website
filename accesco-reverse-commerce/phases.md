# Accesco Reverse Commerce — Implementation Phases

> **Scope update (v1, per dataset review):**
> 1. **InstaStyle is deferred** — v1 covers **Grokly + Swadisht only**. Dropping
>    apparel removes fabric/wear-grade complexity; Swadisht (food safety) is
>    the hardest problem and gets solved first — Grokly is easier after that.
> 2. **The v1 model is a binary photo-quality classifier** — `selected` vs
>    `rejected`. It answers "is this photo/item usable?", NOT
>    category/state/grade (A/B/C). Full grading moves to a v2 model (Phase 6).
> 3. **No labels.csv / JSONL** — folder names are the labels (Ultralytics
>    ImageFolder convention). Existing filenames (e.g. `cans001.png`) stay as-is.
> 4. **One combined binary classifier** trained first (both verticals share the
>    "clean/usable vs soiled/unusable" signal); per-vertical models only if
>    metrics demand it. FastAPI + rules engine + Cloud Run Mumbai unchanged —
>    only the model output contract is simpler.

## Dataset Status (measured — 1,516 image files; Phase 1 quantity target MET)

| Vertical | Raw / unprocessed | Selected (training-ready) | Rejected (filtered) | Total |
|----------|------------------:|--------------------------:|--------------------:|------:|
| Grokly   |               270 |                       206 |                  64 |   540 |
| Swadisht |               501 |                       398 |                  79 |   978 |
| **Total**|           **771** |               **604**     |         **143**     | **1,516** |

- Grokly raw: cans 30, cardboard box 40, cosmetic jar 40, detergent bottles 60,
  milk bottle 40, plastic bags 20, soap bottles 40.
- Swadisht raw: steel tiffins 80, soiled tiffins 80, plastic containers 90,
  soiled containers 70, lids 51, food wrappers 40, glass jars 39, cardboard
  food boxes 31, packing cutlery 20.
- ⚠️ Class imbalance: **604 selected vs 143 rejected (≈4.2:1)** — must be
  handled before training (Phase 2).

**▶ Next action: Phase 2, step 1 — write `training/prepare_dataset.py`.**

## Phase 1: Data Collection & Curation (Week 1) — ✅ DONE
- [x] Collect 1,500+ photos across Grokly & Swadisht (1,516 measured)
- [x] Human curation: raw → `selected` / `rejected` folders (folder = label)
- [x] Photos kept out of git (`.gitignore`; shared via Storage/W&B instead)
- [ ] Optional: capture ~100–150 more *rejected* examples (blurry / dark /
      soiled close-ups) to soften the 4.2:1 imbalance
- [x] Deferred to Phase 6: grade (A/B/C), state, missing-parts labels

## Phase 2: Binary Dataset Prep + Model Training (Week 1–2)
- [ ] `training/prepare_dataset.py` — scan `grokly/` + `swadisht/` and build:
      ```
      dataset/
      ├── train/
      │   ├── selected/
      │   └── rejected/
      └── val/
          ├── selected/
          └── rejected/
      ```
      80/20 **stratified** split; COPY (never move) images; folder names are
      the labels — no CSV/manifest needed (optional audit CSV only)
- [ ] Handle imbalance: oversample `rejected` in train/ only (duplication or
      augmentation) or class weights; never oversample val
- [ ] Train `yolov8s-cls.pt` on Colab (free GPU), W&B logging, early stopping;
      real-world augmentation (lighting, angles, wet surfaces, partial views)
- [ ] Metrics: val accuracy > 75% **and** recall on `rejected` ≥ 90%
      (a bad item slipping through as "selected" is the dangerous error —
      mirrors the original reject-precision bar); track false "rejected"
      (good items sent to review) separately as a cost metric
- [ ] Tune the acceptance threshold on val (default 0.7); pick operating point
- [ ] Export + pin promoted weights → `models/latest.pt` (gitignored)

## Phase 3: Backend API + Rules Engine (Week 2)
- [ ] FastAPI service: `POST /grade`, `POST /feedback`, `GET /health`
- [ ] `/grade` returns `{result: "selected"|"rejected", confidence, decision,
      action}`
- [ ] `rules.py` — the model is a scorer, rules decide:
      - confidence < 0.7 → `review` (human queue, never auto-decided)
      - Swadisht: `rejected` → hard-recycle path, never reused; `selected` →
        sanitization bay; reuse only after the **manual** sanitization gate
        (AI approval alone is never sufficient)
      - Grokly: `selected` → reuse credit on next order; `rejected` → recycle
- [ ] Firestore schema: `return_events`, `review_queue` (`resale_listings`
      deferred with InstaStyle)
- [ ] Firebase Storage upload wiring
- [ ] Fixture-based test suite (`test_grade_suite.py`); all green before deploy

## Phase 4: Integration + Deploy (Week 2)
- [ ] Grokly: "packaging return due" flag on next order + wallet credit on
      `selected`
- [ ] Swadisht: return-with-next-order → grading → sanitization queue → reuse
- [ ] Cloud Run deploy (Mumbai), secrets, `/health` readiness
- [ ] Next.js integration via one API route + one notify hook only (rules.md)
- [ ] E2E manual run for both verticals; fix defects
- [ ] Deferred: InstaStyle payout + auto-listing funnel (Phase 6)

## Phase 5: Active Learning (Week 3+)
- [ ] Rider/counter corrections streamed via `/feedback` to Firestore
      (append-only audit trail)
- [ ] Weekly export script → Colab retrain → W&B → promote best weights
- [ ] Monitor review-queue rate and `rejected`-recall; tune thresholds
- [ ] Feed `rejected`-class corrections back to soften imbalance over time
- [ ] A/B test incentive sizes (wallet credit vs waived packaging fee)

## Phase 6: v2 Expansion (later)
- [ ] Full grading model: category + state + grade (A/B/C/reject) per the
      original PRD taxonomy — a labels.csv/JSONL becomes necessary here
- [ ] InstaStyle vertical + resale listings + payout funnel
- [ ] Split into per-vertical models if the combined classifier stalls

## Verification Commands (per phase)

```bash
# Phase 2 — build the binary dataset (folder names = labels, no CSV)
python training/prepare_dataset.py   # → dataset/{train,val}/{selected,rejected}

# Phase 2 — Colab training
#   from ultralytics import YOLO
#   YOLO("yolov8s-cls.pt").train(data="dataset/", epochs=100, imgsz=224)

# Phase 3 — run the suite locally
python -m uvicorn grading-api.app:app --port 8000
python grading-api/test_grade_suite.py

# Phase 4 — health check after deploy
curl https://<cloudrun-url>/health
```