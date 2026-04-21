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
      title: 'Phone Number — Vanity (display only)',
      type: 'string',
      description: 'Branded/vanity format shown as text to users. e.g., (972) 777-COOL. Never used in tel: links — letters are not dialable on mobile.',
    },
    {
      name: 'phoneDisplay',
      title: 'Phone Number — Dialable (tel: links & schema)',
      type: 'string',
      description: 'Numeric format used in tel: hrefs and LocalBusiness schema. e.g., (972) 777-2665 or +19727772665. MUST be digits only — letters break click-to-call.',
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
      description: 'Year DFW HVAC was founded (2020)',
    },
    {
      name: 'legacyDescription',
      title: 'Legacy Description',
      type: 'text',
      description: 'Brief description of the three-generation legacy',
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
