export default {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'content', title: 'Page Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      initialValue: 'Contact Us | DFW HVAC',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      validation: Rule => Rule.max(160),
      initialValue: 'Contact DFW HVAC for expert heating and cooling services in Dallas-Fort Worth. Same-day service available Monday-Saturday. Call (972) 777-COOL.',
    },

    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      initialValue: 'Contact Us',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
      initialValue: "We're Here to Help",
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
      initialValue: 'Have a question or need service? Our team is ready to provide expert HVAC service with integrity and care.',
    },

    // Contact Section
    {
      name: 'contactSectionTitle',
      title: 'Contact Section Title',
      type: 'string',
      group: 'content',
      initialValue: 'Get In Touch',
    },
    {
      name: 'phoneDescription',
      title: 'Phone Description',
      type: 'string',
      group: 'content',
      initialValue: 'Same-day service M-Sat',
    },
    {
      name: 'emailDescription',
      title: 'Email Description',
      type: 'string',
      group: 'content',
      initialValue: 'We respond within 24 hours',
    },
    {
      name: 'emergencyText',
      title: 'Emergency Service Text',
      type: 'string',
      group: 'content',
      initialValue: 'Same-Day Service Available',
    },

    // Form Section
    {
      name: 'formTitle',
      title: 'Form Title',
      type: 'string',
      group: 'content',
      initialValue: 'Send Us a Message',
    },
    {
      name: 'formDescription',
      title: 'Form Description',
      type: 'string',
      group: 'content',
      initialValue: "Fill out the form below and we'll get back to you within 24 hours",
    },

    // CTA Section
    {
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'content',
      initialValue: 'Ready to Experience the DFW HVAC Difference?',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'string',
      group: 'content',
      initialValue: 'Call us today for fast, reliable HVAC service',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Contact form and information',
      }
    },
  },
}
