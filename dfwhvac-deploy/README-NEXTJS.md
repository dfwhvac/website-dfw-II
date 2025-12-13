# DFW HVAC Next.js Website

A high-performance, SEO-optimized website for DFW HVAC built with Next.js and Sanity CMS.

## Phase 1 Features ✅

- **Next.js 14** with App Router and Server-Side Rendering
- **Sanity CMS** integration for easy content management
- **Template A**: ServiceTemplate for all HVAC service pages
- **SEO Optimized** with dynamic meta tags and schema markup
- **Performance Optimized** with image optimization and lazy loading
- **Brand Colors** - Official DFW HVAC color palette
- **Real Reviews** - Integration with Google Business Profile data
- **Responsive Design** - Mobile-first approach
- **Lead Generation** - Conversion-optimized forms

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Sanity account (free tier available)

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp .env.local.template .env.local
# Edit .env.local with your Sanity project details
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Sanity CMS Setup

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Install Sanity CLI: `npm install -g @sanity/cli`
3. Add your project ID to `.env.local`
4. Access your CMS at `http://localhost:3000/admin`

## Project Structure

```
/app/                 # Next.js App Router pages
/components/          # React components
  /ui/               # Shadcn/ui components
  Header.jsx         # Site header with navigation
  Footer.jsx         # Site footer
  HomePage.jsx       # Homepage component
  ServiceTemplate.jsx # Service page template (Template A)
  LeadForm.jsx       # Lead capture form
/lib/                # Utility libraries
  metadata.js        # SEO metadata helpers
  services.js        # Service data and queries
  sanity.js          # Sanity client and queries
  mockData.js        # Mock data for development
/sanity/             # Sanity CMS configuration
  schema.js          # Content schemas
```

## Content Management

### Sanity CMS Schema

- **Services** - Individual HVAC service pages
- **Testimonials** - Customer reviews and ratings  
- **Company Info** - Business details, hours, contact info
- **Site Settings** - Global site configuration

### Editing Content

1. Access the CMS at `/admin`
2. Edit services, testimonials, and company information
3. Changes are automatically reflected on the live site
4. No code deployment needed for content updates

## SEO Features

- **Dynamic Meta Tags** - Unique titles and descriptions per page
- **Schema Markup** - Rich snippets for local business
- **Open Graph** - Social media sharing optimization
- **XML Sitemap** - Automatic sitemap generation
- **Server-Side Rendering** - Fast initial page loads

## Performance Features

- **Image Optimization** - WebP format with lazy loading
- **Code Splitting** - Automatic code splitting by Next.js
- **Static Generation** - Pre-rendered pages for speed
- **CDN Ready** - Optimized for Vercel deployment

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables for Production

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Template Usage

### ServiceTemplate (Template A)

The `ServiceTemplate` component can be reused for all HVAC service pages:

- Residential Air Conditioning
- Residential Heating
- Commercial HVAC
- Preventative Maintenance
- Indoor Air Quality

Content is managed through Sanity CMS with consistent layout and conversion optimization.

## Phase 1 Complete ✅

**What's Included:**
- Homepage with lead generation
- Service page template (Template A)
- Sanity CMS integration
- SEO optimization
- Performance optimization
- Brand color implementation
- Google reviews integration

**What's Next (Phase 2):**
- Additional page templates
- Backend API integration
- Enhanced animations
- Advanced SEO features

## Support

For technical support or questions about this Next.js implementation, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://sanity.io/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)