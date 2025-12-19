export default {
  name: 'companyPage',
  title: 'Company Page',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
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
      title: 'Slug',
      type: 'slug',
      group: 'basic',
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
          { title: 'Careers', value: 'careers' },
          { title: 'Service Areas', value: 'service-areas' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'basic',
      description: 'SEO description for search results',
    },

    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
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
          { name: 'sectionContent', title: 'Section Content', type: 'text' },
          { name: 'bulletPoints', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] },
        ],
      }],
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'bio', title: 'Bio', type: 'text' },
        ],
      }],
    },
    {
      name: 'showContactForm',
      title: 'Show Contact Form',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
    {
      name: 'showTestimonials',
      title: 'Show Testimonials',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
    },
  },
}
