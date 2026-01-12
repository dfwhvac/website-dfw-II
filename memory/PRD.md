# DFW HVAC Website - Product Requirements Document

## Original Problem Statement
Build a premium, conversion-focused website for DFW HVAC company using Next.js frontend and Sanity.io for content management. The project expanded to include comprehensive data analysis for strategic planning including service area analysis, demographic analysis, and brand strategy development.

## User Personas
- **Business Owner**: Needs strategic data to optimize service delivery and marketing
- **Potential Customers**: Looking for HVAC services in the DFW area
- **Marketing Team**: Requires data-driven insights for targeting campaigns

## Core Requirements
1. Dynamic website with Sanity CMS for all content
2. Lead capture with email notifications
3. SEO-optimized pages with structured data
4. Service area definition with drive-time analysis
5. Demographic data for targeting decisions

---

## Current Status
**Phase:** Development
**Caching Mode:** Development (No Cache) - optimized for content iteration

---

## Completed Work

### ✅ Service Area Analysis (January 2025)
- **4-Zone Model Successfully Completed**
  - HQ: 556 S. Coppell Rd, Coppell, TX 75019
  - Zone 1 (<11 min): 4 zip codes | 86,923 housing units | Avg income: $106,384
  - Zone 2 (11-20 min): 34 zip codes | 489,498 housing units | Avg income: $97,543
  - Zone 3 (21-30 min): 67 zip codes | 966,255 housing units | Avg income: $90,355
  - Zone 4 (31-45 min): 34 zip codes | 489,950 housing units | Avg income: $102,333
  - Zone 5 (>45 min): Outside service area (no data)
  - **Total:** 139 zip codes | 2M+ housing units | 59.1% single-family homes
  
- **Output Files:**
  - `/app/frontend/public/DFW_HVAC_Service_Area_4Zone.csv` - Full data with demographics
  - `/app/frontend/public/dfw_service_area_map_4zone.png` - Visual map

### ✅ Sanity CMS Migration
- All website content editable in Sanity Studio
- Homepage, service pages, company pages complete
- Navigation and footer configurable
- Brand colors in Sanity (simplified schema)
- Lead form text editable

### ✅ Brand Strategy
- Competitor analysis (12 DFW HVAC companies)
- Three-pillar brand framework
- Brand messaging and positioning documentation

### ✅ Google Reviews Import
- 130 customer reviews imported
- Data alignment issues fixed

### ✅ Dynamic Page System
- `/[slug]/page.jsx` for Sanity-driven pages

### ✅ SEO Implementation
- LocalBusiness schema markup
- Review schema markup
- FAQ schema markup
- Page-specific meta tags

### ✅ TTS Voice Previews
- 9 voice samples generated from OpenAI TTS
- Located at `/app/frontend/public/voice-previews/`

---

## Pending Tasks

### P0 - Critical
- [ ] **Lead Capture Form Backend** - Implement email notifications using Resend

### P1 - Important  
- [ ] **Phone System Audio Files** - Generate MP3s with final scripts (awaiting user input on voice selection and scripts)
- [ ] **Build Remaining Pages** - Content creation in Sanity for:
  - `/case-studies`
  - `/financing`
  - `/cities-served`
  - `/privacy-policy`
  - `/terms-of-service`
- [ ] **Dynamic sitemap.xml** - Generate from Sanity content

### P2 - Future
- [ ] **Production Caching Mode** - Webhook-based on-demand revalidation
- [ ] **Marketing/Analytics** - Facebook Pixel, GA4/GTM integration
- [ ] **Auto-generated Cities Served Page** - List all 139 zip codes grouped by zone for local SEO
- [ ] **Clean URLs** - Remove `/services/` prefix from routes
- [ ] **Code Cleanup** - Remove unused files, audit hardcoded content

---

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Shadcn/UI
- **CMS:** Sanity.io (self-hosted studio at `/studio`)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Hosting:** Vercel

### Key Files
```
/app/frontend/
├── app/
│   ├── [slug]/page.jsx      # Dynamic pages from Sanity
│   ├── studio/              # Self-hosted Sanity Studio
│   └── ...
├── lib/
│   └── sanity.js            # Sanity client (useCdn: false for dev)
├── public/
│   ├── DFW_HVAC_Service_Area_4Zone.csv    # Latest service area data
│   ├── dfw_service_area_map_4zone.png     # Latest service area map
│   └── voice-previews/                     # TTS samples
└── sanity/
    └── schemas/             # Content schemas

/app/
├── service_area_4zone_memory_efficient.py  # Service area analysis script
└── ...
```

### 3rd Party Integrations
| Service | Status | Notes |
|---------|--------|-------|
| Sanity.io | ✅ Active | CMS |
| OpenRouteService | ✅ Active | Drive-time isochrones |
| US Census Bureau | ✅ Active | Demographics/geodata |
| OpenAI TTS | ✅ Tested | Via Emergent LLM Key |
| Resend | ⏳ Pending | For lead form emails |
| Facebook Pixel | ⏳ Future | Marketing |
| GA4/GTM | ⏳ Future | Analytics |

---

## Data Files Reference

| File | Description | Last Updated |
|------|-------------|--------------|
| `DFW_HVAC_Service_Area_4Zone.csv` | 4-zone service area with demographics | Jan 2025 |
| `dfw_service_area_map_4zone.png` | Service area visualization | Jan 2025 |
| `DFW_HVAC_Brand_Framework_3Pillar.csv` | Brand positioning | Previous |
| `DFW_HVAC_Competitor_Analysis.csv` | Competitive landscape | Previous |
| `DFW_HVAC_Housing_Types.csv` | Housing demographics | Previous |

---

*Last Updated: January 12, 2025*
