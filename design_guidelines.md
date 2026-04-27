# DFW HVAC — Design System & Brand Guidelines

> **Source of truth.** Every page, component, and Sanity-driven element uses what's defined here. Created Apr 27, 2026 during the brand cohesion refactor (Phase 6 of 7).

---

## 1. Color Tokens

All colors live as CSS custom properties in `app/globals.css` and are mirrored in `tailwind.config.js`. Use the **semantic Tailwind class** in code — never reach for inline hex.

### Brand anchors

| Token | Hex | Tailwind | Use for | Don't use for |
|---|---|---|---|---|
| `--prussian-blue` | `#003153` | `bg-prussian-blue` `text-prussian-blue` | Brand authority, dark hero gradients (start), section headlines, dark form CTAs | Body text (too dark for paragraphs), urgency CTAs |
| `--electric-blue` | `#0077B6` | `bg-electric-blue` `text-electric-blue` | Interactive primary, links, hover states, hero gradients (end), trust icons | Phone CTAs (those use `vivid-red`) |
| `--vivid-red` | `#D30000` | `bg-vivid-red` `text-vivid-red` | Phone CTAs, "Call Now", urgency badges, after-hours emergency, sticky mobile bar | Anything calm or considered — financing, estimates, planning |

### Funnel / decision palette

| Token | Hex | Tailwind | Use for | Don't use for |
|---|---|---|---|---|
| `--growth-green` | `#84CC16` | `bg-growth-green` `text-growth-green` | Funnel-page hero accents, financing CTAs, estimator highlights, "considered purchase" buttons | Emergency/urgency contexts; main service pages |
| `--success-green` | `#16A34A` | `bg-success-green` `text-success-green` | Checkmarks, confirmations, indexed/validated states, "approved" UI feedback | Marketing CTAs (those use `growth-green`) |

### Semantic neutrals & accents

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `--neutral-text` | `#2D3748` | `text-neutral-text` | Default body text color (alternative to `text-gray-700`) |
| `--surface-soft` | `#F7FAFC` | `bg-surface-soft` | Alternating section backgrounds |
| `--alert-amber` | `#F59E0B` | `text-alert-amber` `fill-alert-amber` | Review stars (5/5 ratings), warning callouts, "case-by-case" decision states |

### Legacy aliases (do not use in new code)

`lime-green`, `gold-amber`, `charcoal`, `light-gray` are kept as backward-compat aliases pointing to the semantic tokens. **Always prefer the new semantic names.**

---

## 2. Color usage decision matrix

Use this table when picking a color for a new page or section:

| Visitor mindset | Page type | Anchor color |
|---|---|---|
| "My AC just died — I need help NOW" | Service request, sticky mobile, phone CTA | **Vivid Red** |
| "Tell me what you do, prove you're trustworthy" | Service pages, city pages, about, reviews, hero gradients | **Prussian Blue → Electric Blue** gradient |
| "I'm researching — I might buy in 3 months" | Replacement, financing, estimator, repair-or-replace | **Growth Green** accents on **Prussian → Electric** hero |
| "Confirm I did the right thing" | Form success, indexed badges, checkmarks | **Success Green** |
| "Show me your social proof" | Review cards, star ratings | **Alert Amber** stars |

---

## 3. Hero gradient — the canonical pattern

**Single canonical hero gradient site-wide:**

```jsx
<section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-20">
```

**Variants (all valid):**
- `bg-gradient-to-r` (horizontal) — used for narrow hero strips and CTA bands
- `bg-gradient-to-br` (top-left to bottom-right) — used for full-page heroes (preferred)

**Forbidden:**
- ❌ Inline `style={{ background: 'linear-gradient(...)' }}` — bypasses the token system
- ❌ Hex literals like `from-[#003153]` — same problem
- ❌ Three-stop or off-brand gradients — keeps cohesion tight

---

## 4. Button system

### Canonical variants (see `components/ui/button.jsx`)

| Variant | Visual | When to use | Example label |
|---|---|---|---|
| `urgency` | Red bg, white text | Phone CTAs, emergency CTAs, sticky mobile | "Call Now" / "Call (972) 777-COOL" |
| `primary` | Electric blue bg, white text, hover→prussian | Service/form CTAs, secondary CTAs on funnel pages | "Request Service" / "Get a Free Estimate" |
| `growth` | Growth-green bg, prussian-blue text, bold | Funnel-page hero CTAs, financing applies, estimator submits | "Pre-Qualify Now" / "Calculate My Cost" / "See My Range" |
| `outlineBlue` | Transparent bg, electric-blue border + text, hover invert | Tertiary actions, "learn more" style links | "Learn More About Financing" |

### Usage pattern

```jsx
import { Button } from '@/components/ui/button'

// As a button
<Button variant="urgency" size="lg" data-testid="phone-cta">
  Call Now
</Button>

// As a link (preserves all styling)
<Button variant="growth" size="xl" asChild>
  <Link href="/financing">Pre-Qualify Now</Link>
</Button>
```

### Sizes
- `default` (h-9, px-4) — inline CTAs, header buttons
- `sm` (h-8, px-3) — table actions, dense UI
- `lg` (h-10, px-8) — section CTAs
- `xl` (h-auto, px-8 py-4 text-lg) — hero CTAs

### Forbidden
- ❌ Raw `<a className="bg-...">` button substitutes — bypasses the variant system
- ❌ Inline-defined button styles — use the canonical variants

---

## 5. Typography

**Single font family:** Inter, loaded via `next/font/google` in `app/layout.js`. No competing fonts.

### Heading scale (responsive)

| Element | Class | Use for |
|---|---|---|
| Hero H1 | `text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight` | Top-of-page headlines |
| Section H2 | `text-3xl lg:text-4xl font-bold` | Major page sections |
| Card / sub H3 | `text-2xl font-bold` | Card titles, sub-section headers |
| Body | `text-base` (mobile: `text-sm`) | Paragraphs |
| Small / accent | `text-sm` or `text-xs` | Captions, fine print, badges |

### Voice & tone

The site speaks with a consistent voice across all surfaces. The recurring threads:

- **"Three generations of trust"** — appears in header tagline, about page, footer
- **Family-business framing** — never "we" the corporate, always "we" the family
- **No hard sell** — phrases like "no pushy sales tactics", "no obligation", "just the math"
- **Phone-first conversion** — every page has a clear path to (972) 777-COOL
- **Plain English on technical content** — "the math doesn't recover" (not "ROI thresholds")

When writing new copy: read three nearby paragraphs first to match the rhythm.

---

## 6. Iconography

**Single library:** Lucide React (`lucide-react` in `package.json`).

**Forbidden:**
- ❌ Emoji as icons (🤖 🧠 💡 etc.)
- ❌ Mixed icon libraries (Heroicons, Material Icons, custom SVGs)
- ❌ Icons without `aria-hidden="true"` when paired with visible text
- ❌ Icons without `aria-label` when standalone (icon-only buttons)

**Footer accent rule** (Phase 4 cleanup, Apr 27, 2026):
- **Action icons** (phone): `text-vivid-red`
- **Information icons** (mail, location, hours): `text-electric-blue`
- **Maximum 2 icon colors in the footer.** No yellow, no green, no orange.

---

## 7. Accessibility floor

Site must meet **WCAG AA minimum** (4.5:1 contrast for body text, 3:1 for large text).

### Verified contrast ratios

| Combination | Ratio | Pass |
|---|:-:|:-:|
| `text-electric-blue` on white | 4.77:1 | ✅ AA |
| `text-vivid-red` on white | 5.22:1 | ✅ AA |
| `text-growth-green` on prussian-blue (hero accent) | 5.5:1 | ✅ AA |
| `text-prussian-blue` on white | 12.6:1 | ✅ AAA |
| White on prussian-blue (hero text) | 12.6:1 | ✅ AAA |
| `text-success-green` on white | 4.6:1 | ✅ AA |
| `text-alert-amber` on white | 3.0:1 | ⚠️ Large text only |

### Required for every interactive element

- `data-testid` — kebab-case, semantic (e.g., `financing-apply-cta`)
- `aria-label` — when no visible text accompanies the action
- `aria-hidden="true"` — on decorative icons (next to text)
- Visible focus state — Tailwind `focus-visible:ring-1 focus-visible:ring-ring` (built into Button)
- Min tap target — 44×44px (use `min-h-[44px]` in code)

---

## 8. Spacing & layout

**Tailwind spacing scale only.** No magic-number padding/margins.

### Section vertical rhythm

| Section type | Class |
|---|---|
| Hero | `py-20 lg:py-28` |
| Major content section | `py-16 lg:py-20` |
| Minor content section / sub-section | `py-10 lg:py-12` |
| CTA strip | `py-12 lg:py-16` |

### Container

Always wrap content in: `container mx-auto px-4`

For narrower text-heavy content: add `max-w-3xl mx-auto` inside the container.

---

## 9. Form patterns

All forms follow a single canonical pattern:

```jsx
<input
  type="..."
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
  data-testid="..."
/>
```

**Submit buttons:** use the `primary` Button variant (electric-blue → prussian-blue gradient via `bg-gradient-to-r from-electric-blue to-prussian-blue`).

**Required field marker:** add a visible `*` and `aria-required="true"`.

---

## 10. What this refactor consolidated (Apr 27, 2026)

**Eliminated:**
- 50+ inline-hex literals (`[#003153]`, `[#0077B6]`, `[#00213a]`, `[#00496e]`)
- 18+ instances of Tailwind's `lime-XXX` palette (replaced by `growth-green` / `success-green`)
- 5 inline `style={{ background: 'linear-gradient(...) }}` declarations
- 4-color footer icon scheme (now 2: red action + blue info)
- Star-rating yellow-400 (→ alert-amber for brand warmth)

**Added:**
- 5 new semantic tokens (`growth-green`, `success-green`, `neutral-text`, `surface-soft`, `alert-amber`)
- 3 canonical Button variants (`urgency`, `primary`, `growth`)
- This documentation file

**Result:**
Every color in the site now flows from a single CSS-variable source of truth. Sanity-driven brand updates propagate to every page automatically. The funnel pages keep their distinctive "growth green" feel while cohesively belonging to the larger system.

---

## 11. When to update this file

- Adding a new color → add it as a token, document use case here
- Adding a Button variant → register it in `components/ui/button.jsx` AND document here
- Changing typography scale → update Section 5
- Any new hero pattern → update Section 3, with a worked example

**Last updated:** Apr 27, 2026 (Brand Cohesion Refactor, Phases 1–7)
