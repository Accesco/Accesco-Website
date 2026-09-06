# Accesco Reverse Commerce — Project Requirement Document

> **Scope update (v1, per dataset review):** InstaStyle is **deferred** — v1
> covers Grokly + Swadisht only. The v1 model is a **binary photo-quality
> classifier** (`selected` / `rejected`) that filters usable photos/items —
> not full category/state/grade prediction (that taxonomy moves to a v2
> model). Labels come from folder names; no labels.csv in v1. See
> `phases.md` for the updated plan.

## What to Build
An AI-powered grading service for the Accesco Reverse Commerce framework
(Collect → Grade → Reuse / Recycle) that works across all three verticals:

- **Grokly** — grocery packaging (bags / boxes / bottles) returned at next delivery
- **Swadisht** — food packaging (tiffins / containers) returned and sanitized
- **InstaStyle** — used clothing / apparel resold through a grading marketplace

A photo of a returned item goes in → YOLOv8 grades it (A / B / C / Reject) →
a rules engine decides the end state (reuse / resell / recycle / reject) →
Firestore records the event and the existing app surfaces the outcome
(incentives, payout, listing, or review queue).

## Targeted Users
- **InstaStyle sellers** — customers listing used clothing, paid via wallet credit,
  bank payout, or exchange voucher
- **InstaStyle buyers** — customers shopping pre-owned (Grade A/B/C) inventory
- **Riders / hub staff** — capture photos at pickup, dark store, and sanitization bay
- **Dark-store / kitchen operators** — approve or correct low-confidence grades
- **Ops / founders** — monitoring accuracy, recovery economics, review queue

## Core Features
- Photo capture + upload (rider app, hub, seller app) → Firebase Storage
- `POST /grade` → YOLOv8 inference → quality tier + damage/soiled flags
- Rules engine: food-safety gate (Swadisht), category "No-return" gate,
  grade→price mapping, resell/reuse/recycle/reject routing
- Confidence < 0.7 → human review queue (no auto-decision)
- InstaStyle auto-grade → payout suggestion + auto-listing creation
- Grokly / Swadisht "packaging return due" flag on next order + wallet credit
- Rider/seller correction feedback → active learning dataset
- W&B experiment tracking; model version pinning for deployment

## Non-Goals
- No LLM-based grading (YOLOv8 vision model only)
- No full grading model in v1 — v1 ships one combined binary
  selected/rejected classifier; per-vertical grade models are v2
- No automated food-safety sign-off — sanitization status is a hard manual gate
- No payments processing (existing wallet/razorpay systems handle payouts)
- No computer-vision grading of condition from seller-provided stock photos only
  (final grade confirmed at hub/pickup)

## Data Sources
- Photos captured in-app (riders, hubs, sellers) — 1500+ labeled images for v1
- Category allowlist from the Circular Commerce SKU Recovery Framework table
  (beverages, dairy, pantry, snacks, personal care, beauty, home care, baby, pet,
  fashion, kitchen, electronics, books, sports, toys, gardening, packaging,
  and the Reject category set)
- Existing `recovery_framework.json` / chatbot recovery data (cross-reference)
- Rider/grader manual corrections (active learning feedback)

## Success Metrics
- Grading accuracy > 75% on holdout test set (v1 bar)
- Recall on `rejected` ≥ 90% (a soiled/unsafe item slipping through as "selected" is the worst failure)
- Review-queue rate < 15% of graded items
- % of returned items successfully reused/resold vs recycled (recovery rate)
- InstaStyle resale listing creation funnel: graded → listed → sold
- Reduction in packaging cost per Grokly/Swadisht order