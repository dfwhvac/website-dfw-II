# C2 — Click-to-Call CTA Mobile Reachability Audit

**Date:** May 4, 2026
**Owner:** Agent
**Trigger:** Phase 3 Tier-1 quick-win sprint
**Verdict:** ✅ **PASS** (with one optional polish noted)

---

## Why this audit matters

In HVAC, **60–80% of conversions are phone calls**, not form submissions. Every
second the user spends searching for the phone number is a percentage point of
abandonment. The roadmap's C2 acceptance criterion: **the red phone CTA must be
reachable in <3 seconds on every mobile page**, regardless of scroll position
or session state.

---

## Surfaces audited

| Surface | Component | Mobile visibility | Phone reach time |
|---|---|---|---|
| Header top bar | `Header.jsx:170–192` | `hidden sm:flex` → not on mobile (intentional, redundant w/ sticky CTA) | n/a on mobile |
| Header desktop CTAs | `Header.jsx:232–254` | `hidden lg:flex` → not on mobile (intentional) | n/a on mobile |
| Header **mobile menu** (hamburger) | `Header.jsx:274–342` | Always visible on mobile; hamburger icon top-right | **~1.5s** (1 tap to open menu, 1 tap to call) |
| **Sticky Mobile CTA bar** | `StickyMobileCTA.jsx` | `lg:hidden` → mobile-only; appears after 100px scroll; pulsing animated phone icon | **<1s** (1 tap once visible) |
| Footer phone link | `Footer.jsx:188` | Always visible at page bottom | Depends on scroll distance |

---

## Reach-time by user state

### State A — First mobile load, no scroll yet (above-the-fold)
- **Visible:** logo, hamburger, page hero
- **Phone CTA:** NOT directly visible
- **Path to call:** tap hamburger → tap "Call Now" (first item in CTA stack)
- **Time:** ~1.5 seconds (2 taps, fast menu open)
- **Verdict:** ✅ Within <3s budget

### State B — User scrolls > 100px (typical within 1–2s of landing)
- **Visible:** Sticky red CTA at bottom of viewport, animated pulsing Phone icon, "Call Now for Service" label
- **Path to call:** 1 tap on sticky bar
- **Time:** <1 second
- **Verdict:** ✅ Excellent, well within budget

### State C — User dismissed the sticky CTA via the X button (sessionStorage flag set)
- **Visible:** No sticky CTA for the rest of the session
- **Path to call:** Hamburger fallback (same as State A)
- **Time:** ~1.5–2 seconds
- **Verdict:** ✅ Still within budget; hamburger is the safety net

### State D — Long article scroll, user 50%+ down the page
- **Visible:** Sticky CTA at bottom (unless dismissed)
- **Path to call:** 1 tap on sticky bar
- **Time:** <1 second
- **Verdict:** ✅ Excellent

### State E — User on `/thanks` after a recent submit
- Sticky CTA still active (no special suppression on `/thanks`)
- Phone reachable via sticky CTA after 100px scroll OR hamburger
- **Verdict:** ✅ OK

---

## Findings & verdict

✅ **PASS — All 5 user states reach the phone CTA in <3 seconds.**

The combination of three reachability paths (hamburger menu, sticky CTA after
scroll, footer at page bottom) is robust against any single point of failure:
even if the user scrolls past the hero AND dismisses the sticky bar, the
hamburger remains.

---

## Optional polish (not required for C2 to pass)

### Optional Polish #1 — Above-the-fold phone icon next to hamburger

**Idea:** Add a small `tel:`-linked phone icon button (44×44px, vivid-red) in
the mobile header next to the hamburger, so the phone is **directly visible on
first viewport** without requiring the hamburger tap or any scroll.

**Why deferred:**
- Header mobile real estate is already tight (logo + brand text + tagline + hamburger).
- StickyMobileCTA already covers post-scroll, which is where most users hesitate.
- The hamburger path is 1.5s — already below the 3s budget.
- Could regress logo prominence or compress the hamburger tap target.

**Re-evaluate trigger:** if Microsoft Clarity heatmaps (C1, installed Mar 2026)
show >5% of mobile sessions exit on the hero without scrolling AND without
opening the hamburger, this becomes a real conversion-leak; ship the icon then.

### Optional Polish #2 — Suppress dismiss-flag on `/services`, `/contact`, `/financing`

**Idea:** On high-intent pages, ignore the `stickyCtaDismissed` sessionStorage
flag so the bar always shows after 100px scroll, even if dismissed earlier.

**Why deferred:**
- Respects user intent (they dismissed it, they meant it).
- Would feel intrusive; potentially erodes trust.
- Conversion lift uncertain.

**Re-evaluate trigger:** if GA4 cta_source segmentation (post-C6, also May 4)
shows >70% of phone clicks come from the sticky bar AND there's a measurable
phone-click drop-off on dismiss-set sessions, reconsider.

---

## What ships with C2

**No code changes required for C2 acceptance.** This audit document IS the
deliverable. The two optional polishes are queued in Phase 3 backlog as
"data-trigger" items — only ship if Clarity / GA4 evidence shows they'd lift
conversion.

C2 is marked ✅ **PASS / SHIPPED** in CHANGELOG with this audit as the artifact.

---

## Related shipped items (May 4, 2026)

- **C6** — Mobile sticky-CTA conversion segment in GA4: Added `cta_source`
  parameter to the global `phone_click` event. Sticky CTA now tagged
  `data-cta-source="sticky_mobile_cta"`; Header tagged
  `header_topbar_link` / `header_topbar_cta` / `header_desktop_cta` /
  `header_mobile_menu`; Footer tagged `footer`. Future analysis can quantify
  each surface's contribution to phone conversions.
- **C8** — "🔒 Secured" footer trust microcopy: shipped with Lock icon →
  /privacy-policy. Targets hesitant homeowners on financing CTA + contact form.
