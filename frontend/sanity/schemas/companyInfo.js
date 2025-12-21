export default {
  name: 'companyInfo',
  title: 'Company Information',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number (Display)',
      type: 'string',
      description: 'e.g., (972) 777-COOL',
    },
    {
      name: 'phoneDisplay',
      title: 'Phone Number (Actual)',
      type: 'string',
      description: 'e.g., (972) 777-2665',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Company Description',
      type: 'text',
    },
    {
      name: 'googleRating',
      title: 'Google Rating',
      type: 'number',
      validation: Rule => Rule.min(0).max(5),
    },
    {
      name: 'googleReviews',
      title: 'Google Review Count',
      type: 'number',
    },
    {
      name: 'established',
      title: 'Year Established',
      type: 'string',
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
        { name: 'sunday', title: 'Sunday', type: 'string' },
      ],
    },
    {
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
}
