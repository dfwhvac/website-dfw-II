# Site Settings - Sanity Studio Guide

## What's Implemented

The Header and Footer components now support dynamic content from Sanity CMS. Until you create the "Site Settings" document in Sanity, the components will use smart default values.

## How to Add Site Settings in Sanity Studio

1. **Go to Sanity Studio**: Navigate to your site's `/studio` route (e.g., `https://your-domain.com/studio`)

2. **Create Site Settings Document**:
   - In the left sidebar, click on **"Site Settings"**
   - Click **"Create new document"** (or the + button)

3. **Configure Header Settings**:
   - **Header Tagline**: "Serving Dallas-Fort Worth Since 1974"
   - **Header CTA Button Text**: "Call Now"
   - **Show Header Tagline**: ✓ (checked)

4. **Configure Navigation**:
   Add each menu item with these fields:
   
   | Label | Link URL | Has Dropdown? |
   |-------|----------|---------------|
   | Home | / | No |
   | Residential Services | /services/residential | Yes (add dropdown items below) |
   | Commercial Services | /services/commercial | Yes (add dropdown items below) |
   | About | /about | No |
   | Reviews | /reviews | No |
   | Contact | /contact | No |

   **Residential Services Dropdown Items**:
   - Air Conditioning → /services/residential/air-conditioning
   - Heating → /services/residential/heating
   - Preventative Maintenance → /services/residential/preventative-maintenance
   - Indoor Air Quality → /services/residential/indoor-air-quality

   **Commercial Services Dropdown Items**:
   - Commercial AC → /services/commercial/air-conditioning
   - Commercial Heating → /services/commercial/heating
   - Commercial Maintenance → /services/commercial/maintenance
   - Commercial Air Quality → /services/commercial/indoor-air-quality

5. **Configure CTA Buttons**:
   | Button Label | Link URL | Style |
   |--------------|----------|-------|
   | Get Estimate | /contact | Outline |
   | Book Service | /book-service | Primary (Filled) |

6. **Configure Footer Settings**:
   - **Footer Tagline**: "Trusted HVAC contractor serving Dallas-Fort Worth and surrounding areas for over 50 years. Quality service, reliable solutions."
   - **Copyright Text**: "© {year} DFW HVAC. All rights reserved." (The {year} will be replaced with current year automatically)
   - **Show Service Areas**: ✓ (checked)
   - **Show Business Hours**: ✓ (checked)

7. **Add Footer Link Sections**:
   
   **Section 1 - "Our Services"**:
   - Air Conditioning → /services/residential/air-conditioning
   - Heating Systems → /services/residential/heating
   - Preventative Maintenance → /services/residential/preventative-maintenance
   - Indoor Air Quality → /services/residential/indoor-air-quality
   - Commercial HVAC → /services/commercial/air-conditioning

   **Section 2 - "Quick Links"**:
   - About Us → /about
   - Customer Reviews → /reviews
   - Case Studies → /case-studies
   - Financing Options → /financing
   - Cities Served → /cities-served
   - FAQ → /faq

8. **Add Social Media Links**:
   | Platform | URL |
   |----------|-----|
   | Facebook | https://facebook.com/dfwhvac |
   | Instagram | https://instagram.com/dfwhvac |
   | Twitter/X | https://twitter.com/dfwhvac |

9. **Publish**: Click the **"Publish"** button to save your changes

## What Can Be Edited

### Header
- ✅ Tagline text (top bar)
- ✅ "Call Now" button text
- ✅ Show/hide the tagline bar
- ✅ Navigation menu items (add, remove, reorder)
- ✅ Dropdown items for each menu
- ✅ CTA buttons (text, links, styles)

### Footer
- ✅ Company tagline/description
- ✅ Footer link sections (fully customizable)
- ✅ Social media links
- ✅ Copyright text
- ✅ Show/hide service areas
- ✅ Show/hide business hours

## Notes

- Changes will appear after the next page load (within 60 seconds due to caching)
- The phone number and business hours come from the **Company Info** document, not Site Settings
- If Site Settings is empty or not created, the site uses sensible defaults
