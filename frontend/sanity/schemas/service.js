export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'hero', title: 'Hero Section' },
    { name: 'content', title: 'Page Content' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'faqs', title: 'FAQs' },
  ],
  fields: [
    // Basic Info
    {
      name: 'title',
      title: 'Service Title',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Commercial', value: 'commercial' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'basic',
      validation: Rule => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      group: 'basic',
      description: 'Icon identifier (e.g., snowflake, flame, wrench, wind, building)',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'basic',
    },

    // Hero Section
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
      description: 'e.g., "Expert AC Solutions for DFW Homes"',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
      description: 'Longer description for the hero section',
    },
    {
      name: 'heroBenefits',
      title: 'Hero Benefits',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
      description: 'Key benefits shown in hero (3-5 items)',
    },

    // Content Sections
    {
      name: 'whatWeDoItems',
      title: 'What We Do - Items',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'List of services/tasks we perform',
    },
    {
      name: 'processSteps',
      title: 'Our Process - Steps',
      type: 'array',
      group: 'content',
      of: [{
        type: 'object',
        fields: [
          { name: 'step', title: 'Step Number', type: 'number' },
          { name: 'title', title: 'Step Title', type: 'string' },
          { name: 'description', title: 'Step Description', type: 'string' },
        ],
      }],
    },
    {
      name: 'whyChooseUsReasons',
      title: 'Why Choose Us - Reasons',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    },
    {
      name: 'emergencyTitle',
      title: 'Fast Response Section Title',
      type: 'string',
      group: 'content',
      description: 'e.g., "Same-Day Service Available"',
    },
    {
      name: 'emergencyDescription',
      title: 'Fast Response Section Description',
      type: 'text',
      group: 'content',
    },
    {
      name: 'emergencyFeatures',
      title: 'Emergency Service Features',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    },

    // Pricing
    {
      name: 'pricingTiers',
      title: 'Pricing Tiers',
      type: 'array',
      group: 'pricing',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Tier Title', type: 'string' },
          { name: 'startingPrice', title: 'Starting Price', type: 'string', description: 'e.g., "From $89"' },
          { name: 'includes', title: 'Includes', type: 'array', of: [{ type: 'string' }] },
        ],
      }],
    },

    // FAQs
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faqs',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', title: 'Question', type: 'string' },
          { name: 'answer', title: 'Answer', type: 'text' },
        ],
      }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
}
