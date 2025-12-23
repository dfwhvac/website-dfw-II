# Sanity Content Import Guide

## Quick Import (One Command)

### Step 1: Open Terminal
Navigate to your project folder (where `sanity.config.js` is located)

### Step 2: Login to Sanity (if needed)
```bash
npx sanity login
```

### Step 3: Run Import
```bash
npx sanity dataset import sanity-import.ndjson production
```

When prompted, type `Y` to confirm.

---

## What Gets Imported

| Content Type | Count | Description |
|--------------|-------|-------------|
| Site Settings | 1 | Header, footer links, social links |
| Company Info | 1 | Name, phone, address, hours |
| Brand Colors | 1 | Website color scheme |
| Testimonials | 130 | All Google reviews |
| **Total** | **133** | |

---

## After Import: Managing Your Site

### To Edit Footer Links
1. Go to `/studio`
2. Click "Site Settings"
3. Click "Footer" tab
4. Edit "Footer Link Sections"
5. Click "Publish"

### To Add a New Page (e.g., Case Studies)
1. Go to `/studio`
2. Click "Company Page" 
3. Click "+" to create new
4. Fill in:
   - Title: "Case Studies"
   - URL Slug: "case-studies" (click Generate)
   - Page Type: "Case Studies"
   - Add hero content and sections
5. Click "Publish"
6. Go to Site Settings → Footer → Add link to footer

### To Edit Reviews
1. Go to `/studio`
2. Click "Testimonial"
3. Find and edit any review
4. Toggle "Visible on Website" to show/hide
5. Click "Publish"

---

## Content Refresh

The site uses **ISR (Incremental Static Regeneration)** with a 1-hour revalidation. This means:

- Changes appear within 1 hour automatically
- Or trigger a rebuild in Vercel for immediate updates

---

## File Location
Import file: `/app/frontend/sanity-import.ndjson`
