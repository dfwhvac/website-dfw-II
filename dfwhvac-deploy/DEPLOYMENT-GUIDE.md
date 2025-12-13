# DFW HVAC Next.js Deployment Guide

## 🚀 Quick Vercel Deployment

### Method 1: Drag & Drop Upload (Easiest)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub, Google, or email

2. **Create New Project:**
   - Click "Add New..." → "Project"
   - Click "Browse All Templates"
   - Select "Import Third-Party Git Repository" or "Deploy"

3. **Upload This Folder:**
   - Drag and drop this entire folder
   - Or zip this folder and upload
   - Vercel auto-detects Next.js

4. **Configure:**
   - Project Name: `dfwhvac-website` (or your choice)
   - Framework Preset: Next.js (auto-selected)
   - Build Command: `yarn build`
   - Click "Deploy"

### Method 2: GitHub Integration (Best for updates)

1. **Create GitHub Repository:**
   - Go to [github.com](https://github.com)
   - Create new repository: `dfwhvac-website`
   - Upload all files from this folder

2. **Connect to Vercel:**
   - In Vercel: "Import Git Repository"
   - Select your GitHub repo
   - Click "Deploy"

## ⚙️ Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=demo-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

*(Replace with your actual Sanity project ID when ready)*

## 🧪 Testing Checklist

After deployment, test these features:

### Desktop:
- [ ] Homepage loads with DFW HVAC branding
- [ ] Navigation menu works
- [ ] Lead form submits (shows success toast)
- [ ] "Book Service" page displays
- [ ] All brand colors display correctly
- [ ] Google reviews section shows

### Mobile:
- [ ] Mobile navigation hamburger menu works
- [ ] Forms are touch-friendly
- [ ] Text is readable
- [ ] Buttons are properly sized

### Performance:
- [ ] Page loads in <2 seconds
- [ ] Images display properly
- [ ] No console errors

## 📱 Expected Live URL

Your site will be live at:
`https://your-project-name.vercel.app`

## 🔧 Current Features (Phase 1)

✅ **Homepage** - Hero section, services overview, testimonials
✅ **Template A** - Professional service page template 
✅ **Lead Forms** - Capture customer information
✅ **Book Service** - Service request page
✅ **SEO Ready** - Meta tags and schema markup
✅ **Brand Colors** - Official DFW HVAC palette
✅ **Google Reviews** - Real customer testimonials
✅ **Mobile Responsive** - Works on all devices
✅ **Sanity CMS Ready** - Easy content management

## ⚡ Next Steps

1. **Deploy** using steps above
2. **Test** all functionality 
3. **Report** any issues to development team
4. **Decide** on Phase 2 continuation

## 📞 Support

If you encounter deployment issues:
1. Check Vercel build logs for errors
2. Ensure Node.js version is 18+
3. Verify all files uploaded correctly

**Phase 1 Complete** - Ready for deployment and testing! 🎉