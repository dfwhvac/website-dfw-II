# DFW HVAC - Vercel Deployment Guide

## Phase 1 - Test Deployment Package

This package contains a Next.js 14 website for DFW HVAC, ready for deployment to Vercel.

---

## Quick Start (5 minutes)

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click "New repository" 
3. Name it `dfwhvac-website` (or any name you prefer)
4. Keep it **Private** (recommended)
5. Click "Create repository"

### Step 2: Upload Files to GitHub

**Option A - Using GitHub Web Interface:**
1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from this package
3. Click "Commit changes"

**Option B - Using Git Command Line:**
```bash
cd dfwhvac-deploy
git init
git add .
git commit -m "Initial commit - DFW HVAC Phase 1"
git remote add origin https://github.com/YOUR_USERNAME/dfwhvac-website.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in (use your GitHub account)
2. Click "Add New" → "Project"
3. Import your `dfwhvac-website` repository
4. Vercel will auto-detect Next.js - just click "Deploy"
5. Wait ~2 minutes for deployment to complete

### Step 4: View Your Live Site

Once deployed, Vercel will give you a URL like:
`https://dfwhvac-website.vercel.app`

Click it to see your live test site!

---

## What's Included in Phase 1

✅ **Homepage** - Hero section, services overview, testimonials, lead form  
✅ **Header** - Navigation with dropdowns for services  
✅ **Footer** - Contact info, links, business hours  
✅ **Lead Capture Form** - Ready to collect customer inquiries  
✅ **Book Service Page** - Service booking page  
✅ **Mobile Responsive** - Works on all devices  

---

## Environment Variables (Optional for Phase 1)

For Phase 1 testing, the site works with mock data. No environment variables are required.

When ready to connect to Sanity CMS (Phase 2), add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `SANITY_API_TOKEN` | Write token for form submissions |

---

## Troubleshooting

### Build Fails on Vercel
- Check that you uploaded all files including `package.json` and `yarn.lock`
- Ensure the root directory is set correctly in Vercel settings

### Site Shows Unstyled Content
- Clear browser cache and refresh
- Check browser console for errors

### Forms Not Working
- In Phase 1, forms show success messages but don't save data
- Backend integration will be added in Phase 2

---

## Next Steps (After Phase 1 Approval)

1. **Sanity CMS Setup** - Create content management system
2. **Service Pages** - Build out individual service pages using templates
3. **Company Pages** - About, Reviews, Contact pages
4. **Backend Integration** - Connect lead form to email/CRM
5. **Analytics** - Add Google Analytics and Facebook Pixel

---

## Support

If you encounter any issues during deployment, please let me know and I'll help troubleshoot!

---

**Package Created:** December 13, 2025  
**Next.js Version:** 14.2.35  
**Framework:** React 18 + Tailwind CSS + Shadcn/UI
