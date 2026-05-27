# GA4 Events — Code Registry

**Last reviewed:** May 21, 2026
**Property ID:** `G-5MX2NE7C73` via `NEXT_PUBLIC_GA_ID` — Tier 1: `@next/third-parties/google` `<GoogleAnalytics />` in `frontend/components/ProductionAnalytics.jsx`
**Ground rule:** Only events listed here as “in code” are fired by the app. GA4 Admin renames and key-event toggles are **user actions**, not shipped code.

---

## Events fired in production code

| Event name | Parameters | File(s) | When it fires |
|---|---|---|---|
| `form_submit_lead` | `lead_type`, `page_path` | `components/LeadForm.jsx`, `components/SimpleContactForm.jsx` | After successful `POST /api/leads` (HTTP 2xx) |
| `phone_click` | `phone_number`, `link_text`, `page_path`, `cta_source` | `components/PhoneClickTracker.jsx` (mounted in `app/layout.js`) | Any `tel:` link click (document delegation) |
| `thanks_page_view` | `lead_type`, `page_path` | `app/thanks/ThanksAnalytics.jsx` | Once on `/thanks` hydration |
| `estimator_complete` | `estimate_low`, `estimate_high`, `systems`, `page_path` | `app/replacement-estimator/EstimatorWizard.jsx` | User reaches result screen |
| `estimator_opt_in` | _(none)_ | `app/replacement-estimator/EstimatorWizard.jsx` | User opts in for on-site estimate after seeing range |

### `cta_source` values (phone_click)

| Value | Surface |
|---|---|
| `sticky_mobile_cta` | `StickyMobileCTA.jsx` |
| `header_topbar_link` | `Header.jsx` top bar phone link |
| `header_topbar_cta` | `Header.jsx` top bar CTA button |
| `header_desktop_cta` | `Header.jsx` desktop nav CTA |
| `header_mobile_menu` | `Header.jsx` mobile menu CTA |
| `footer` | `Footer.jsx` |
| `inline` | Default — any other `tel:` link |

---

## GA4 Admin vs code (do not conflate)

| GA4 display name | Code event | Notes |
|---|---|---|
| `generate_lead` | `form_submit_lead` | **Not fired in code.** Appears in GA4 only if a **Modify event** rule renames `form_submit_lead` → `generate_lead` (intentional for Smart Bidding). |
| `phone_click` | `phone_click` | Same name in code and GA4 |

---

## Key events — user toggles in GA4 Admin

Mark under **Admin → Data display → Events → Mark as key event** after Realtime confirms ingestion (~24–48h for new events).

| ID | Code event to find in GA4 | Recommended key event? | Status (May 21, 2026) |
|---|---|---|---|
| G3 | `form_submit_lead` (or `generate_lead` if renamed) | Yes — primary form conversion | User marked `generate_lead` Apr 24 (see `POST_DEPLOY_ACTION_ITEMS_PR2.md`) |
| G4 | `phone_click` | Yes — primary call conversion | Toggle pending ingestion (per post-deploy doc) |
| G5 | `thanks_page_view` | Yes — durable post-submit landmark | User action — not yet in post-deploy checklist |
| G6 | `estimator_opt_in` | Yes — high-intent estimator | User action — optional until volume justifies |

**Not yet in code (future):** `form_step_1_complete` (P1.10 progressive form).

---

## Preview / non-production behavior

| Guard | File | Behavior |
|---|---|---|
| No GA scripts in HTML | `lib/analytics.js` `shouldIncludeAnalyticsScripts()` | Requires `NEXT_PUBLIC_GA_ID`, `NODE_ENV=production`, `VERCEL_ENV≠preview` |
| Hostname allow-list | `ProductionAnalytics.jsx` | Scripts only send hits on `dfwhvac.com` / `www.dfwhvac.com` |
| SPA `page_view` | `@next/third-parties` `GoogleAnalytics` | Auto on App Router navigations (Enhanced Measurement) |
| Excluded paths | `GaExcludedPathGuard` | `ga-disable` on `/studio`, `/internal`, `/api` |
| Clarity (Tier 2) | `ProductionAnalytics.jsx` | `lazyOnload` + hostname check |
| Lead emails | `app/api/leads/route.js` | Skipped on preview unless `FORCE_LEAD_EMAIL_IN_PREVIEW=true` |

---

## Verification commands (agent / developer)

Custom events use `trackEvent()` in `frontend/lib/track-event.js` (`sendGAEvent` from `@next/third-parties/google`).

```bash
# List every custom GA4 event name in frontend
rg "trackEvent\\(" frontend --glob '*.{js,jsx}'

# Confirm PhoneClickTracker is mounted
rg "PhoneClickTracker" frontend/app/layout.js
```

**Manual smoke test (production):** DevTools → Network → filter `collect` → tap `tel:` link → expect `en=phone_click`; submit test lead → expect `en=form_submit_lead`.

---

## Related docs

- User checklist: `memory/POST_DEPLOY_ACTION_ITEMS_PR2.md`
- MVP truth snapshot: `memory/CHANGELOG.md` (May 21, 2026 entry)
- Open conversion work: `memory/ROADMAP.md` (P3 section)
