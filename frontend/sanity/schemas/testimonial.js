export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
      initialValue: 5,
    },
    {
      name: 'text',
      title: 'Review Text',
      type: 'text',
      description: 'Leave empty for ratings without text',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'string',
      description: 'Services mentioned in the review',
    },
    {
      name: 'date',
      title: 'Review Date',
      type: 'string',
      description: 'e.g., "12/18/25"',
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Yelp', value: 'yelp' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'Website', value: 'website' },
        ],
      },
      initialValue: 'google',
    },
    {
      name: 'isVisible',
      title: 'Visible on Website',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this review',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
      rating: 'rating',
    },
    prepare({ title, subtitle, rating }) {
      return {
        title: title,
        subtitle: `${rating}★ - ${subtitle || 'No date'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
}
