export default {
  name: 'trustSignals',
  title: 'Trust Signals',
  type: 'document',
  description: 'Reusable trust badges and signals displayed across the site',
  fields: [
    {
      name: 'title',
      title: 'Configuration Name',
      type: 'string',
      initialValue: 'Site Trust Signals',
      readOnly: true,
    },

    // Primary Trust Badges (shown in hero sections, above fold)
    {
      name: 'primaryBadges',
      title: 'Primary Trust Badges',
      type: 'array',
      description: 'Main trust signals shown prominently (hero sections, above fold)',
      of: [{
        type: 'object',
        fields: [
          { name: 'text', title: 'Badge Text', type: 'string' },
          { 
            name: 'icon', 
            title: 'Icon', 
            type: 'string',
            options: {
              list: [
                { title: 'Shield', value: 'shield' },
                { title: 'Award', value: 'award' },
                { title: 'Star', value: 'star' },
                { title: 'Clock', value: 'clock' },
                { title: 'Check Circle', value: 'check-circle' },
                { title: 'Users', value: 'users' },
                { title: 'Phone', value: 'phone' },
                { title: 'Calendar', value: 'calendar' },
              ],
            },
          },
          { name: 'order', title: 'Display Order', type: 'number' },
        ],
        preview: {
          select: {
            title: 'text',
            subtitle: 'icon',
          },
        },
      }],
    },

    // Why Choose Us Items
    {
      name: 'whyChooseUsItems',
      title: 'Why Choose Us Items',
      type: 'array',
      description: 'Items shown in "Why Choose Us" sections across the site',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'string' },
          { 
            name: 'icon', 
            title: 'Icon', 
            type: 'string',
            options: {
              list: [
                { title: 'Years Badge', value: 'years' },
                { title: 'Shield', value: 'shield' },
                { title: 'Clock', value: 'clock' },
                { title: 'Trending Up', value: 'trending' },
                { title: 'Award', value: 'award' },
                { title: 'Star', value: 'star' },
                { title: 'Check Circle', value: 'check-circle' },
                { title: 'Users', value: 'users' },
              ],
            },
          },
          { name: 'order', title: 'Display Order', type: 'number' },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'description',
          },
        },
      }],
    },

    // Service Page Trust Signals
    {
      name: 'servicePageReasons',
      title: 'Service Page - Why Choose Us Reasons',
      type: 'array',
      description: 'Bullet points shown on service pages',
      of: [{ type: 'string' }],
    },

    // Emergency Service Content
    {
      name: 'emergencyServiceTitle',
      title: 'Emergency Service Title',
      type: 'string',
      initialValue: 'Fast Response Service',
    },
    {
      name: 'emergencyServiceDescription',
      title: 'Emergency Service Description',
      type: 'text',
      initialValue: 'When your HVAC system breaks down, you need fast, reliable service you can count on.',
    },
    {
      name: 'emergencyServiceFeatures',
      title: 'Emergency Service Features',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // CTA Section Content
    {
      name: 'ctaTitle',
      title: 'Default CTA Title',
      type: 'string',
      initialValue: 'Ready to Get Started?',
    },
    {
      name: 'ctaDescription',
      title: 'Default CTA Description',
      type: 'text',
      initialValue: 'Contact us today for expert HVAC service with integrity and care.',
    },

    // Footer Trust Text
    {
      name: 'footerTrustText',
      title: 'Footer Trust Text',
      type: 'string',
      description: 'Short trust statement for footer',
      initialValue: 'Licensed • Insured • Satisfaction Guaranteed',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
