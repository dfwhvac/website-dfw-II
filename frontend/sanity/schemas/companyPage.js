export default {
  name: 'companyPage',
  title: 'Company Page',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero Section' },
    { name: 'content', title: 'Page Content' },
  ],
  fields: [
    // Basic Info
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'basic',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'basic',
      description: 'The URL path for this page (e.g., "case-studies" becomes /case-studies)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
          { title: 'Reviews', value: 'reviews' },
          { title: 'Case Studies', value: 'case-studies' },
          { title: 'Financing', value: 'financing' },
          { title: 'Cities Served', value: 'cities-served' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Privacy Policy', value: 'privacy-policy' },
          { title: 'Terms of Service', value: 'terms-of-service' },
          { title: 'General', value: 'general' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
      description: 'Unpublish to hide this page from the website',
    },

    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Title shown in browser tab and search results (defaults to Page Title if empty)',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      description: 'Description for search results (150-160 characters recommended)',
      validation: Rule => Rule.max(200),
    },

    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'Main heading displayed in the hero section',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
    },
    {
      name: 'heroCta',
      title: 'Hero Call-to-Action',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string' },
        { name: 'href', title: 'Button Link', type: 'string' },
      ],
    },

    // Content Sections
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { name: 'sectionTitle', title: 'Section Title', type: 'string' },
          { 
            name: 'sectionContent', 
            title: 'Section Content', 
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'Quote', value: 'blockquote' },
                ],
                marks: {
                  decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' },
                  ],
                  annotations: [
                    {
                      name: 'link',
                      type: 'object',
                      title: 'Link',
                      fields: [
                        { name: 'href', type: 'url', title: 'URL' },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          { name: 'bulletPoints', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] },
        ],
        preview: {
          select: {
            title: 'sectionTitle',
          },
        },
      }],
    },

    // Special Content
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'content',
      description: 'For About page',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'bio', title: 'Bio', type: 'text' },
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'role',
          },
        },
      }],
    },
    {
      name: 'serviceAreasList',
      title: 'Service Areas List',
      type: 'array',
      group: 'content',
      description: 'For Cities Served page',
      of: [{
        type: 'object',
        fields: [
          { name: 'city', title: 'City Name', type: 'string' },
          { name: 'description', title: 'Description', type: 'string' },
        ],
      }],
    },
    {
      name: 'financingOptions',
      title: 'Financing Options',
      type: 'array',
      group: 'content',
      description: 'For Financing page',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Option Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'terms', title: 'Terms', type: 'string' },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'terms',
          },
        },
      }],
    },
    {
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      group: 'content',
      description: 'For Case Studies page',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Project Title', type: 'string' },
          { name: 'client', title: 'Client Type', type: 'string' },
          { name: 'challenge', title: 'Challenge', type: 'text' },
          { name: 'solution', title: 'Solution', type: 'text' },
          { name: 'result', title: 'Result', type: 'text' },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'client',
          },
        },
      }],
    },

    // Display Options
    {
      name: 'showContactForm',
      title: 'Show Contact Form',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
    {
      name: 'showTestimonials',
      title: 'Show Testimonials Section',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
    {
      name: 'showCtaBanner',
      title: 'Show CTA Banner',
      type: 'boolean',
      group: 'content',
      initialValue: true,
      description: 'Show the "Ready to Get Started?" banner at the bottom',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
      published: 'isPublished',
    },
    prepare({ title, subtitle, published }) {
      return {
        title: `${published === false ? '🔴 ' : ''}${title}`,
        subtitle: subtitle,
      }
    },
  },
}
