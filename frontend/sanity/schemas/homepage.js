export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'services', title: 'Services Section' },
    { name: 'whyUs', title: 'Why Choose Us' },
    { name: 'testimonials', title: 'Testimonials Section' },
    { name: 'cta', title: 'Call to Action' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      validation: Rule => Rule.max(160),
    },

    // Hero Section
    {
      name: 'heroBadge',
      title: 'Hero Badge Text',
      type: 'string',
      group: 'hero',
      initialValue: 'Three Generations of Trust',
    },
    {
      name: 'heroTitle',
      title: 'Hero Title (Line 1)',
      type: 'string',
      group: 'hero',
      initialValue: "Dallas-Fort Worth's",
    },
    {
      name: 'heroTitleHighlight',
      title: 'Hero Title (Highlighted)',
      type: 'string',
      group: 'hero',
      initialValue: 'Trusted HVAC',
    },
    {
      name: 'heroTitleLine3',
      title: 'Hero Title (Line 3)',
      type: 'string',
      group: 'hero',
      initialValue: 'Experts',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
      initialValue: 'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship throughout Dallas-Fort Worth.',
    },
    {
      name: 'heroPrimaryButton',
      title: 'Primary Button',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string', initialValue: 'Call (972) 777-COOL' },
        { name: 'href', title: 'Link', type: 'string', initialValue: 'tel:+19727772665' },
      ],
    },
    {
      name: 'heroSecondaryButton',
      title: 'Secondary Button',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string', initialValue: 'Get Free Estimate' },
        { name: 'href', title: 'Link', type: 'string', initialValue: '/contact' },
      ],
    },

    // Services Section
    {
      name: 'servicesTitle',
      title: 'Services Section Title',
      type: 'string',
      group: 'services',
      initialValue: 'Complete HVAC Solutions',
    },
    {
      name: 'servicesDescription',
      title: 'Services Section Description',
      type: 'text',
      group: 'services',
      initialValue: 'From repairs to new system installations, we provide comprehensive residential and commercial HVAC services throughout the Dallas-Fort Worth area.',
    },

    // Why Choose Us
    {
      name: 'whyUsTitle',
      title: 'Section Title',
      type: 'string',
      group: 'whyUs',
      initialValue: 'Why Dallas-Fort Worth Trusts DFW HVAC',
    },
    {
      name: 'whyUsSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      group: 'whyUs',
      initialValue: 'Expert service with integrity and care',
    },
    {
      name: 'whyUsItems',
      title: 'Trust Items',
      type: 'array',
      group: 'whyUs',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'string' },
          { name: 'icon', title: 'Icon', type: 'string', options: {
            list: [
              { title: 'Years Badge', value: 'years' },
              { title: 'Shield', value: 'shield' },
              { title: 'Clock', value: 'clock' },
              { title: 'Trending Up', value: 'trending' },
            ]
          }},
        ],
        preview: {
          select: { title: 'title' },
        },
      }],
    },

    // Testimonials Section
    {
      name: 'testimonialsTitle',
      title: 'Section Title',
      type: 'string',
      group: 'testimonials',
      initialValue: 'What Our Customers Say',
    },
    {
      name: 'testimonialsSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      group: 'testimonials',
      initialValue: 'Real reviews from verified Google customers',
    },
    {
      name: 'maxTestimonials',
      title: 'Max Testimonials to Show',
      type: 'number',
      group: 'testimonials',
      initialValue: 12,
    },

    // CTA Section
    {
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'cta',
      initialValue: 'Ready to Get Started?',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      group: 'cta',
      initialValue: 'Contact DFW HVAC today for expert service with integrity and care.',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Main landing page content',
      }
    },
  },
}
