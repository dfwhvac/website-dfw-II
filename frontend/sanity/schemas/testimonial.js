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
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'text',
      title: 'Review Text',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'service',
      title: 'Service Type',
      type: 'string',
    },
    {
      name: 'timeAgo',
      title: 'Time Ago',
      type: 'string',
      description: 'e.g., "2 months ago"',
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'service',
    },
  },
}
