export default {
  name: 'cityPage',
  title: 'City Pages',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'content', title: 'Page Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'cityName',
      title: 'City Name',
      type: 'string',
      description: 'e.g., "Coppell" or "Flower Mound"',
      group: 'basic',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL-friendly version of the city name (e.g., "flower-mound")',
      group: 'basic',
      options: {
        source: 'cityName',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'zipCodes',
      title: 'Zip Codes Served',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of zip codes served in this city',
      group: 'basic',
      validation: Rule => Rule.required().min(1),
    },
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Toggle to show/hide this city page on the website',
      group: 'basic',
      initialValue: true,
    },
    {
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Lower numbers appear first on the cities list (1 = highest priority)',
      group: 'basic',
      initialValue: 10,
    },
    // Content Section
    {
      name: 'headline',
      title: 'Page Headline',
      type: 'string',
      description: 'Main H1 headline. Default: "HVAC Services in [City Name], TX"',
      group: 'content',
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      description: 'Supporting text below the headline',
      group: 'content',
    },
    {
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      rows: 4,
      description: 'Opening paragraph about HVAC services in this city',
      group: 'content',
    },
    {
      name: 'cityDescription',
      title: 'City Description',
      type: 'text',
      rows: 6,
      description: 'Paragraph about the city itself (history, character, etc.) - helps with local SEO',
      group: 'content',
    },
    {
      name: 'servicesHighlight',
      title: 'Services Highlight',
      type: 'text',
      rows: 4,
      description: 'Paragraph highlighting services offered in this area',
      group: 'content',
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose Us Section',
      type: 'text',
      rows: 4,
      description: 'Why customers in this city should choose DFW HVAC',
      group: 'content',
    },
    {
      name: 'featuredServices',
      title: 'Featured Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Service Title', type: 'string' },
            { name: 'description', title: 'Brief Description', type: 'text', rows: 2 },
            { name: 'link', title: 'Link to Service Page', type: 'string' },
          ],
        },
      ],
      description: 'Services to highlight on this city page',
      group: 'content',
    },
    {
      name: 'localTestimonial',
      title: 'Local Testimonial',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Quote', type: 'text', rows: 3 },
        { name: 'author', title: 'Author Name', type: 'string' },
        { name: 'location', title: 'Location/Neighborhood', type: 'string' },
      ],
      description: 'Optional testimonial from a customer in this city',
      group: 'content',
    },
    // SEO Section
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title. Default: "HVAC Services in [City], TX | DFW HVAC"',
      group: 'seo',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description for search results (150-160 characters recommended)',
      group: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'cityName',
      zipCodes: 'zipCodes',
      isPublished: 'isPublished',
    },
    prepare({ title, zipCodes, isPublished }) {
      const zipCount = zipCodes ? zipCodes.length : 0
      const status = isPublished ? '✓' : '○'
      return {
        title: `${status} ${title}`,
        subtitle: `${zipCount} zip code${zipCount !== 1 ? 's' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Priority',
      name: 'priorityAsc',
      by: [{ field: 'priority', direction: 'asc' }],
    },
    {
      title: 'City Name A-Z',
      name: 'cityNameAsc',
      by: [{ field: 'cityName', direction: 'asc' }],
    },
  ],
}
