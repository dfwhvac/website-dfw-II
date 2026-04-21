# Mobile Form UX Audit (P1.3-scoped, PR #2)

**Date:** April 21, 2026
**Scope:** `components/LeadForm.jsx` + `components/SimpleContactForm.jsx`
**Context:** 60–70% of DFW HVAC traffic is mobile, often in distress (AC broken, 100°F). Every
unit of form friction on mobile = lost lead. This audit covers touch targets, keyboard
optimization, autofill, and error visibility.

---

## ✅ Passing (no action needed)

| Check | Status | Detail |
|---|---|---|
| Touch target height (all inputs) | ✅ PASS | `h-12` = 48px (≥ Apple HIG 44px minimum) |
| Touch target height (submit button) | ✅ PASS | `h-12` full-width, reaches thumb zone |
| Input type="email" / type="tel" | ✅ PASS | Already correct — triggers soft keyboard hint |
| reCAPTCHA lazy-loaded | ✅ PASS | `lazyOnload` — no TBT hit on form pages |
| Required-field indicators | ✅ PASS | Asterisks present on all required labels |
| Submit state disabled + text change | ✅ PASS | `"Submitting..."` / `"Sending..."` while in-flight |

---

## 🛠 Fixed in this PR (PR #2, Apr 21, 2026)

### 1. `inputMode` attributes added
Explicit `inputMode` on phone (`tel`) and email (`email`) fields. Belt-and-braces for
mobile keyboards where `type="tel"` alone may fall through to the text keyboard on some
older Android builds. Also improves WCAG 2.1 Level AA compliance (SC 1.3.5 Identify Input
Purpose).

**Files touched:** `LeadForm.jsx`, `SimpleContactForm.jsx`

### 2. `autoComplete` attributes added
Previously missing entirely. Now wired:
- First name → `autoComplete="given-name"`
- Last name → `autoComplete="family-name"`
- Single name field (contact form) → `autoComplete="name"`
- Email → `autoComplete="email"`
- Phone → `autoComplete="tel"`

**Impact:** Mobile browsers (Safari iOS, Chrome Android) can now offer one-tap autofill
from saved contact info. Typical industry lift: 5–15% form completion rate on mobile.

**Files touched:** `LeadForm.jsx`, `SimpleContactForm.jsx`

### 3. Address input already uses `AddressAutocomplete`
Uses Google Places on focus (TBT-safe). `autoComplete` on address isn't added because
Places autocomplete supersedes browser autofill for this field; adding both creates
dueling suggestion UIs on mobile.

---

## ⏳ Follow-up work (not blocking PR #2)

### F1 — Inline error messages (MEDIUM priority, defer to P1.10 progressive form redesign)
Both forms currently surface validation errors via `sonner` toast notifications in the
top-right corner. On mobile, when the soft keyboard is open (400+px of screen), the toast
can scroll off-screen before the user sees it — especially for errors on the bottom fields
(address, description). The browser-native `required` HTML5 attribute is used, so the
browser DOES scroll-to-and-focus the first invalid field — that saves us here — but once
the form is submitted and the server responds with an error, the toast is the only
feedback and it can be missed.

**Recommended fix (in P1.10):** Show inline per-field error messages directly below the
input as part of the progressive form redesign. Toast remains for top-level
"system unavailable" errors.

### F2 — Submit button sticky behavior (LOW priority, defer to P1.10)
On long forms like `LeadForm` with 7 fields, the submit button sits below the viewport
when mobile users are on the middle fields. Consider a sticky bottom CTA on mobile
(separate from `StickyMobileCTA` which is call-focused).

### F3 — reCAPTCHA branding visibility (LOW priority)
Required by Google ToS: "This site is protected by reCAPTCHA and the Google
[Privacy Policy](https://policies.google.com/privacy) and
[Terms of Service](https://policies.google.com/terms) apply." Not found in either form.
Minor ToS risk, zero UX impact. Add to footer of both forms in P1.10.

### F4 — Numeric keyboard tweak (MICRO, optional)
`inputMode="tel"` on the phone field shows the standard phone keypad (digits + *, #). For
purely U.S.-formatted phone capture, `inputMode="numeric"` is slightly faster (no dial
symbols). Current choice (`tel`) is more forgiving for international-format pastes. Leave
as `tel` unless A/B data says otherwise.

---

## Summary

**PR #2 a11y/UX deltas:**
- 7 new `autoComplete` attributes
- 3 new `inputMode` attributes
- 6 color-contrast fixes (`text-gray-400` → `text-gray-600` on white backgrounds)
- 3 social-icon `aria-label`s
- 1 hamburger `aria-label` + `aria-expanded` + `aria-controls`

**Expected Lighthouse Accessibility score shift:** 87 → 95+ 🟢
**Expected mobile form completion rate:** +5–15% (via autofill)

**Non-blockers punted:**
- Inline error messages → P1.10 (progressive form redesign, Week 6)
- Sticky mobile submit CTA → P1.10
- reCAPTCHA branding text → P1.10
