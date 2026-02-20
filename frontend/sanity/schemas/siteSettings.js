export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'branding', title: 'Branding' },
    { name: 'header', title: 'Header' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'leadForm', title: 'Lead Form' },
    { name: 'seo', title: 'SEO Defaults' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Settings Name',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
    },

    // Branding
    {
      name: 'logoTagline',
      title: 'Logo Tagline',
      type: 'string',
      group: 'branding',
      description: 'Text shown under company name in header/footer (e.g., "Three Generations of Trusted Service")',
      initialValue: 'Three Generations of Trusted Service',
    },
    {
      name: 'legacyStatement',
      title: 'Legacy Statement',
      type: 'string',
      group: 'branding',
      description: 'Flexible legacy messaging (e.g., "A three-generation family commitment")',
      initialValue: 'A three-generation family commitment to trustworthy HVAC service',
    },
    {
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
      group: 'branding',
      description: 'Company mission statement used across the site',
      initialValue: 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.',
    },
    {
      name: 'companyFoundedYear',
      title: 'Company Founded Year',
      type: 'string',
      group: 'branding',
      description: 'Year DFW HVAC was founded (optional)',
      initialValue: '',
    },
    {
      name: 'legacyStartYear',
      title: 'Legacy Start Year',
      type: 'string',
      group: 'branding',
      description: 'Year the family HVAC legacy began (1972)',
      initialValue: '1972',
    },

    // SEO Defaults
    {
      name: 'siteNameSuffix',
      title: 'Site Name Suffix',
      type: 'string',
      group: 'seo',
      description: 'Appended to page titles (e.g., " | DFW HVAC")',
      initialValue: ' | DFW HVAC',
    },
    {
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      group: 'seo',
      description: 'Used when a page has no specific description (150-160 chars)',
      initialValue: 'DFW HVAC delivers expert HVAC service with integrity and care. Three generations of trusted heating & cooling service in Dallas-Fort Worth. Call (972) 777-COOL.',
      validation: Rule => Rule.max(200),
    },
    {
      name: 'defaultOgImage',
      title: 'Default Social Share Image',
      type: 'image',
      group: 'seo',
      description: 'Image shown when pages are shared on Facebook, Twitter, etc. (1200x630px recommended)',
    },
    {
      name: 'googleSiteVerification',
      title: 'Google Site Verification',
      type: 'string',
      group: 'seo',
      description: 'Google Search Console verification code (just the code, not the full meta tag)',
    },

    // Header Settings
    {
      name: 'headerTagline',
      title: 'Header Tagline',
      type: 'string',
      group: 'header',
      description: 'Text shown at top of header (e.g., "Three Generations of Trusted HVAC Service")',
      initialValue: 'Three Generations of Trusted HVAC Service in DFW',
    },
    {
      name: 'headerCtaText',
      title: 'Header CTA Button Text',
      type: 'string',
      group: 'header',
      description: 'Text for the call-to-action button',
      initialValue: 'Call Now',
    },
    {
      name: 'showHeaderTagline',
      title: 'Show Header Tagline',
      type: 'boolean',
      group: 'header',
      initialValue: true,
    },

    // Navigation
    {
      name: 'mainNavigation',
      title: 'Main Navigation',
      type: 'array',
      group: 'navigation',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Menu Label', type: 'string' },
          { name: 'href', title: 'Link URL', type: 'string', description: 'e.g., /about or https://external.com' },
          { name: 'isDropdown', title: 'Has Dropdown?', type: 'boolean', initialValue: false },
          { 
            name: 'dropdownItems', 
            title: 'Dropdown Items', 
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'href', title: 'Link URL', type: 'string' },
              ],
              preview: {
                select: { title: 'label', subtitle: 'href' }
              }
            }]
          },
          { name: 'order', title: 'Display Order', type: 'number' },
          { name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true },
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'href',
          }
        }
      }],
    },
    {
      name: 'ctaButtons',
      title: 'Header CTA Buttons',
      type: 'array',
      group: 'navigation',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Button Label', type: 'string' },
          { name: 'href', title: 'Link URL', type: 'string' },
          { name: 'variant', title: 'Style', type: 'string', options: {
            list: [
              { title: 'Primary (Filled)', value: 'primary' },
              { title: 'Outline', value: 'outline' },
            ]
          }},
          { name: 'order', title: 'Display Order', type: 'number' },
        ],
        preview: {
          select: { title: 'label', subtitle: 'href' }
        }
      }],
    },

    // Lead Form Settings
    {
      name: 'leadFormTitle',
      title: 'Form Title',
      type: 'string',
      group: 'leadForm',
      initialValue: 'Get Your Free Estimate',
    },
    {
      name: 'leadFormDescription',
      title: 'Form Description',
      type: 'string',
      group: 'leadForm',
      initialValue: "Fill out the form below and we'll contact you within 24 hours",
    },
    {
      name: 'leadFormButtonText',
      title: 'Submit Button Text',
      type: 'string',
      group: 'leadForm',
      initialValue: 'Get My Free Estimate',
    },
    {
      name: 'leadFormSuccessMessage',
      title: 'Success Message',
      type: 'string',
      group: 'leadForm',
      initialValue: "Thank you! We'll contact you within 24 hours.",
    },
    {
      name: 'leadFormTrustSignals',
      title: 'Trust Signals',
      type: 'string',
      group: 'leadForm',
      description: 'Text shown below the button (e.g., "✓ Free estimates • ✓ Licensed & insured")',
      initialValue: '✓ Free estimates • ✓ Licensed & insured • ✓ Fast response time',
    },
    {
      name: 'leadFormFooterText',
      title: 'Footer Text',
      type: 'string',
      group: 'leadForm',
      initialValue: "We'll contact you within 24 hours to schedule your appointment",
    },

    // Footer Settings
    {
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      group: 'footer',
      description: 'Short description under company name in footer',
      initialValue: 'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship in Dallas-Fort Worth.',
    },
    {
      name: 'footerSections',
      title: 'Footer Link Sections',
      type: 'array',
      group: 'footer',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Section Title', type: 'string' },
          { name: 'links', title: 'Links', type: 'array', of: [{
            type: 'object',
            fields: [
              { name: 'label', title: 'Link Label', type: 'string' },
              { name: 'href', title: 'Link URL', type: 'string' },
            ],
            preview: {
              select: { title: 'label', subtitle: 'href' }
            }
          }]},
          { name: 'order', title: 'Display Order', type: 'number' },
        ],
        preview: {
          select: { title: 'title' }
        }
      }],
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      group: 'footer',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', title: 'Platform', type: 'string', options: {
            list: [
              { title: 'Facebook', value: 'facebook' },
              { title: 'Instagram', value: 'instagram' },
              { title: 'Twitter/X', value: 'twitter' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'YouTube', value: 'youtube' },
              { title: 'Google Business', value: 'google' },
              { title: 'Yelp', value: 'yelp' },
            ]
          }},
          { name: 'url', title: 'Profile URL', type: 'url' },
        ],
        preview: {
          select: { title: 'platform', subtitle: 'url' }
        }
      }],
    },
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      group: 'footer',
      description: 'Use {year} for automatic year',
      initialValue: '© {year} DFW HVAC. All rights reserved.',
    },
    {
      name: 'showServiceAreas',
      title: 'Show Service Areas in Footer',
      type: 'boolean',
      group: 'footer',
      initialValue: true,
    },
    {
      name: 'showBusinessHours',
      title: 'Show Business Hours in Footer',
      type: 'boolean',
      group: 'footer',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
