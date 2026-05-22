# Post-Deploy Action Items — GA4 Key Events (PR #2)

**Created:** April 21, 2026
**Last reviewed:** May 21, 2026 (aligned to live `frontend/` + `GA4_EVENTS.md`)
**Status:** Mostly complete — remaining user toggles below

---

## What the code actually fires

| Code event | File | GA4 Admin note |
|---|---|---|
| `form_submit_lead` | `LeadForm.jsx`, `SimpleContactForm.jsx` | May display as **`generate_lead`** if a Modify Event rule renames it — that is admin config, not code |
| `phone_click` | `PhoneClickTracker.jsx` (global in `layout.js`) | Same name in GA4 |
| `thanks_page_view` | `ThanksAnalytics.jsx` | Same name in GA4 |
| `estimator_opt_in` | `EstimatorWizard.jsx` | High-intent estimator opt-in |

**Registry:** `memory/GA4_EVENTS.md`

---

## Checklist

### Step 0 — Verify production deploy

- [x] Visit `https://dfwhvac.com` → hard refresh
- [x] DevTools → Network → filter `collect` → tap `tel:` link → `en=phone_click` (confirmed Apr 24, 2026)
- [x] Submit test lead → `en=form_submit_lead` (confirmed Apr 24, 2026)

### Step 1 — Confirm events in GA4 Realtime

- [x] Property `G-5MX2NE7C73` → Realtime shows `phone_click` and/or `form_submit_lead`

### Step 2 — Mark key events (Admin → Events)

| ID | Find this event in GA4 | Action | Status |
|---|---|---|---|
| G3 | `form_submit_lead` or `generate_lead` (if renamed) | Mark as key event | [x] `generate_lead` marked Apr 24, 2026 |
| G4 | `phone_click` | Mark as key event | [ ] Pending — verify event appears in Events list, then toggle |
| G5 | `thanks_page_view` | Mark as key event | [ ] Optional — submit any form, land on `/thanks`, confirm in Realtime first |
| G6 | `estimator_opt_in` | Mark as key event | [ ] Optional — complete estimator opt-in flow once |

### Step 3 — Custom dashboard (optional)

- [ ] GA4 → Reports → Library → "Lead Conversions Overview" (form + phone + thanks + estimator widgets)

### Step 4 — Baseline capture

- [ ] Note "GA4 key events live" in performance scorecard / KPI notes
- [ ] After 7d / 30d / 60d: record rolling counts for `form_submit_lead`, `phone_click`, `thanks_page_view`, `estimator_opt_in`

---

## Why this matters

Smart Bidding needs 30+ conversions/month and stable key events **before** Phase 5 ad spend (~July 2026 target). Marking key events early starts the clock.

---

## Code references

- `frontend/components/LeadForm.jsx` — `form_submit_lead`
- `frontend/components/SimpleContactForm.jsx` — `form_submit_lead`
- `frontend/components/PhoneClickTracker.jsx` — `phone_click` + `cta_source`
- `frontend/app/thanks/ThanksAnalytics.jsx` — `thanks_page_view`
- `frontend/app/replacement-estimator/EstimatorWizard.jsx` — `estimator_complete`, `estimator_opt_in`
- `frontend/app/layout.js` — GA4 ID + preview mute

**When all toggles are done:** move this file to `frontend/internal/` as historical record or delete per owner preference.
