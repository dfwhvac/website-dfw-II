// Sanity schema definitions for DFW HVAC CMS

export const serviceSchema = {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      description: 'e.g., "Residential Air Conditioning"'
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Commercial', value: 'commercial' }
        ]
      }
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Snowflake (AC)', value: 'snowflake' },
          { title: 'Flame (Heating)', value: 'flame' },
          { title: 'Wrench (Maintenance)', value: 'wrench' },
          { title: 'Wind (Air Quality)', value: 'wind' },
          { title: 'Clock (Controllers)', value: 'clock' }
        ]
      }
    },
    {
      name: 'heroContent',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Hero Title', type: 'string' },
        { name: 'subtitle', title: 'Hero Subtitle', type: 'string' },
        { name: 'description', title: 'Hero Description', type: 'text' },
        {
          name: 'benefits',
          title: 'Key Benefits',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'List of key benefits (4 maximum recommended)'
        }
      ]
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'object',
      fields: [
        {
          name: 'whatWeDo',
          title: 'What We Do Section',
          type: 'object',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            {
              name: 'items',
              title: 'Service Items',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        },
        {
          name: 'ourProcess',
          title: 'Our Process Section',
          type: 'object',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            {
              name: 'steps',
              title: 'Process Steps',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  { name: 'step', title: 'Step Number', type: 'number' },
                  { name: 'title', title: 'Step Title', type: 'string' },
                  { name: 'description', title: 'Step Description', type: 'text' }
                ]
              }]
            }
          ]
        },
        {
          name: 'whyChooseUs',
          title: 'Why Choose Us Section',
          type: 'object',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            {
              name: 'reasons',
              title: 'Reasons',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        },
        {
          name: 'emergencyService',
          title: 'Emergency Service Section',
          type: 'object',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        }
      ]
    },
    {
      name: 'pricing',
      title: 'Pricing Information',
      type: 'object',
      fields: [
        {
          name: 'maintenance',
          title: 'Maintenance Pricing',
          type: 'object',
          fields: [
            { name: 'title', title: 'Package Title', type: 'string' },
            { name: 'startingPrice', title: 'Starting Price', type: 'string' },
            {
              name: 'includes',
              title: 'What\\'s Included',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        },
        {
          name: 'repair',
          title: 'Repair Pricing',
          type: 'object',
          fields: [
            { name: 'title', title: 'Package Title', type: 'string' },
            { name: 'startingPrice', title: 'Starting Price', type: 'string' },
            {
              name: 'includes',
              title: 'What\\'s Included',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        },
        {
          name: 'installation',
          title: 'Installation Pricing',
          type: 'object',
          fields: [
            { name: 'title', title: 'Package Title', type: 'string' },
            { name: 'startingPrice', title: 'Starting Price', type: 'string' },
            {
              name: 'includes',
              title: 'What\\'s Included',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        }
      ]
    },
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', title: 'Question', type: 'string' },
          { name: 'answer', title: 'Answer', type: 'text' }
        ]
      }]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Keywords', type: 'string' }
      ]
    }
  ]
}

export const testimonialSchema = {
  name: 'testimonial',
  title: 'Customer Testimonial',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Dallas, TX" or "DFW Area"'
    },
    {
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      validation: Rule => Rule.min(1).max(5)
    },
    {
      name: 'text',
      title: 'Testimonial Text',
      type: 'text'
    },
    {
      name: 'service',
      title: 'Service Type',
      type: 'string',
      description: 'What service was provided'
    },
    {
      name: 'timeAgo',
      title: 'Time Ago',
      type: 'string',
      description: 'e.g., "2 months ago"'
    },
    {
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      description: 'Show on homepage'
    }
  ]
}

export const companyInfoSchema = {
  name: 'companyInfo',
  title: 'Company Information',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string'
    },
    {
      name: 'phone',
      title: 'Phone Number (Display)',
      type: 'string',
      description: 'e.g., "(972) 777-COOL"'
    },
    {
      name: 'phoneNumeric',
      title: 'Phone Number (Numeric)',
      type: 'string',
      description: 'e.g., "(972) 777-2665"'
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string'
    },
    {
      name: 'address',
      title: 'Physical Address',
      type: 'text'
    },
    {
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Cities and areas served'
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'object',
      fields: [
        { name: 'monday', title: 'Monday', type: 'string' },
        { name: 'tuesday', title: 'Tuesday', type: 'string' },
        { name: 'wednesday', title: 'Wednesday', type: 'string' },
        { name: 'thursday', title: 'Thursday', type: 'string' },
        { name: 'friday', title: 'Friday', type: 'string' },
        { name: 'saturday', title: 'Saturday', type: 'string' },
        { name: 'sunday', title: 'Sunday', type: 'string' }
      ]
    },
    {
      name: 'googleRating',
      title: 'Google Rating',
      type: 'number',
      validation: Rule => Rule.min(1).max(5)
    },
    {
      name: 'googleReviews',
      title: 'Number of Google Reviews',
      type: 'number'
    },
    {
      name: 'established',
      title: 'Year Established',
      type: 'string'
    },
    {
      name: 'womenOwned',
      title: 'Women-Owned Business',
      type: 'boolean'
    }
  ]
}

export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text'
    },
    {
      name: 'keywords',
      title: 'Default Keywords',
      type: 'string'
    },
    {
      name: 'ogImage',
      title: 'Social Media Image',
      type: 'image',
      description: 'Default image for social sharing'
    }
  ]
}

// Export all schemas
export const schemas = [
  serviceSchema,
  testimonialSchema, 
  companyInfoSchema,
  siteSettingsSchema
]