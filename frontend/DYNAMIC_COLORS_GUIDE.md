# Dynamic Colors - Implementation Guide

## Current Setup (Development Mode)

Brand colors are now **dynamically loaded** from Sanity CMS. When you change color values in Sanity Studio under "Brand Colors", the changes will reflect on the website.

### How It Works

1. **Sanity Studio** → Edit colors in "Brand Colors" document
2. **ColorProvider** → Fetches colors and injects CSS variables
3. **Tailwind/CSS** → Uses CSS variables instead of hardcoded hex values

### Where to Edit Colors

1. Go to Sanity Studio (`/studio`)
2. Click on **"Brand Colors"** in the sidebar
3. Edit any color's **Hex Code** field
4. Click **Publish**
5. Refresh your site (changes appear within 60 seconds due to caching)

### Available Colors

| Color Name | Default Value | Usage |
|------------|---------------|-------|
| Prussian Blue | #003153 | Headers, dark backgrounds |
| Electric Blue | #00B8FF | Links, buttons, accents |
| Vivid Red | #FF0606 | CTAs, phone numbers |
| Lime Green | #00FF00 | Success states, highlights |
| Gold/Amber | #F77F00 | Trust badges, promotions |
| Charcoal | #2D3748 | Body text, secondary headings |
| Light Gray | #F7FAFC | Section backgrounds, cards |
| White | #FFFFFF | Base background |

---

## Converting to Static (Production Mode)

When your color choices are **finalized**, follow these steps to convert to static Tailwind colors for optimal performance:

### Step 1: Document Your Final Colors

From Sanity Studio, note down all your final hex values.

### Step 2: Update tailwind.config.js

Replace CSS variables with hex values:

```javascript
// FROM (Dynamic):
'prussian-blue': 'var(--prussian-blue)',
'electric-blue': 'var(--electric-blue)',
// ...

// TO (Static):
'prussian-blue': '#003153',  // Your final value
'electric-blue': '#00B8FF',  // Your final value
// ...
```

### Step 3: Update globals.css

Replace variable references with hex values in the CSS classes:

```css
/* FROM (Dynamic): */
.bg-prussian-blue { background-color: var(--prussian-blue); }

/* TO (Static): */
.bg-prussian-blue { background-color: #003153; }
```

### Step 4: Remove ColorProvider

In `app/layout.js`:
- Remove the `ColorProvider` import and wrapper
- Remove the `getBrandColors` import and call

### Step 5: Rebuild and Deploy

```bash
yarn build
```

---

## Files Modified for Dynamic Colors

| File | Purpose |
|------|---------|
| `lib/sanity.js` | Added `getBrandColors()` fetch function |
| `components/ColorProvider.jsx` | Injects CSS variables at runtime |
| `app/layout.js` | Wraps app with ColorProvider |
| `app/globals.css` | CSS classes use CSS variables |
| `tailwind.config.js` | Tailwind colors reference CSS variables |

---

## Notes

- Changes may take up to 60 seconds to appear due to Next.js caching
- If a color isn't set in Sanity, the default fallback value is used
- The conversion to static takes approximately 30 minutes
