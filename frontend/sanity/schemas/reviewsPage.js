export default {
  name: 'reviewsPage',
  title: 'Reviews Page',
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
      initialValue: 'Customer Reviews',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'content',
      initialValue: 'See What Our Customers Say About Us',
    },
    {
      name: 'googleBadgeTitle',
      title: 'Google Badge Title',
      type: 'string',
      group: 'content',
      initialValue: 'Based on Google Reviews',
    },
    {
      name: 'showAllText',
      title: '"Showing X of Y" Text Format',
      type: 'string',
      group: 'content',
      description: 'Text shown below reviews (use {shown} and {total} as placeholders)',
      initialValue: 'Showing {shown} of {total} reviews with text',
    },
    {
      name: 'loadMoreText',
      title: 'Load More Button Text',
      type: 'string',
      group: 'content',
      initialValue: 'Load More Reviews',
    },

    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Page title for search engines (50-60 chars)',
      initialValue: 'Customer Reviews | DFW HVAC | 5-Star Rated HVAC Service',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      description: 'Description for search results (150-160 chars)',
      initialValue: 'Read 5-star reviews from real DFW HVAC customers. Three generations of trusted HVAC service in Dallas-Fort Worth. See why customers trust us.',
      validation: Rule => Rule.max(200),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Reviews Page',
        subtitle: 'Page content and SEO settings',
      }
    },
  },
}
