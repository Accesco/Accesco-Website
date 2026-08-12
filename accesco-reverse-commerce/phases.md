# Accesco Reverse Commerce — Implementation Phases

## Phase 1: Data Collection & Labeling (Week 1)
- [ ] Photo capture + upload flow (reuse InstaStyle listing UI; add capture
      screens for rider/hub in Grokly & Swadisht return flows)
- [ ] Collect 1500+ labeled photos across verticals (bottles, containers,
      garments + damage/soiled states)
- [ ] Label schema: category, state (new/used/soiled/damaged),
      grade (A/B/C/reject), missing parts (cap, label)
- [ ] Category config from SKU Recovery Framework (allowlist + Reject set)
- [ ] Set up W&B project + Colab notebook

## Phase 2: Model Training (Week 1–2)
- [ ] Train YOLOv8s/m per vertical on Colab (free GPU)
- [ ] Log runs to W&B; target accuracy > 75%, reject precision ≥ 90%
- [ ] Evaluate on holdout set; fix class imbalance (undersample/oversample)
- [ ] Export + pin promoted weights (`models/latest.pt`)

## Phase 3: Backend API + Rules Engine (Week 2)
- [ ] FastAPI service: `POST /grade`, `POST /feedback`, `GET /health`
- [ ] `rules.py`: food-safety gate, category gate, confidence floor (0.7),
      grade→decision mapping
- [ ] Firestore schema: `return_events`, `grade_tiers`, `review_queue`,
      `resale_listings`
- [ ] Firebase Storage upload wiring
- [ ] Fixture-based test suite (`test_grade_suite.py`); all green before deploy

## Phase 4: Integration + Deploy (Week 2)
- [ ] InstaStyle end-to-end first: seller photos → grade → payout + listing
- [ ] Grokly: "packaging return due" flag on next order + wallet credit incentive
- [ ] Swadisht: return-with-next-order + sanitization gate + container batch tracking
- [ ] Cloud Run deploy (Mumbai), secrets, `/health` readiness
- [ ] E2E manual run across all three verticals; fix defects

## Phase 5: Active Learning (Week 3+)
- [ ] Rider/counter corrections streamed via `/feedback` to Firestore
- [ ] Weekly export script → Colab retrain → W&B → promote best weights
- [ ] Monitor review-queue rate and reject precision; tune thresholds
- [ ] A/B test incentive sizes (wallet credit vs waived packaging fee)

## Verification Commands (per phase)

```bash
# Phase 3 — run the suite locally
python -m uvicorn grading-api.app:app --port 8000
python grading-api/test_grade_suite.py

# Phase 4 — health check after deploy
curl https://<cloudrun-url>/health
```