export default {
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Page Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Page Content
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'content',
      initialValue: 'Frequently Asked Questions',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'content',
      initialValue: 'Find answers to common questions about our HVAC services, pricing, scheduling, and more.',
    },
    {
      name: 'ctaTitle',
      title: 'CTA Section Title',
      type: 'string',
      group: 'content',
      initialValue: 'Still Have Questions?',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Section Description',
      type: 'text',
      group: 'content',
      initialValue: 'Our friendly team is here to help. Give us a call or schedule a free consultation.',
    },

    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Page title for search engines (50-60 chars)',
      initialValue: 'FAQ | DFW HVAC | Frequently Asked Questions',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      description: 'Description for search results (150-160 chars)',
      initialValue: 'Find answers to common questions about HVAC services, pricing, scheduling, equipment, and maintenance from DFW HVAC - serving Dallas-Fort Worth.',
      validation: Rule => Rule.max(200),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'FAQ Page',
        subtitle: 'Page content and SEO settings',
      }
    },
  },
}
