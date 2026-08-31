export default {
  name: 'googleReviewLedger',
  title: 'Google Review Archive',
  type: 'document',
  description:
    'Append-only copy of every Google review ever seen by the nightly sync. Rows are never deleted when Google stops showing a review.',
  fields: [
    {
      name: 'googleReviewId',
      title: 'Google Review ID',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'resourceName',
      title: 'GBP resource name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'reviewerName',
      title: 'Reviewer name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'starRating',
      title: 'Stars',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'comment',
      title: 'Review text',
      type: 'text',
      readOnly: true,
    },
    {
      name: 'hasText',
      title: 'Has text',
      type: 'boolean',
      readOnly: true,
    },
    {
      name: 'dateDisplay',
      title: 'Review date (display)',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'createTime',
      title: 'Google createTime',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'updateTime',
      title: 'Google updateTime',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'reviewReply',
      title: 'Owner reply',
      type: 'text',
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Live on Google', value: 'live' },
          { title: 'Missing from Google', value: 'missing' },
        ],
      },
    },
    {
      name: 'firstSeenAt',
      title: 'First seen by our sync',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'lastSeenAt',
      title: 'Last seen live on Google',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'missingSince',
      title: 'Missing since',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'restoredAt',
      title: 'Last restored at',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'seededFrom',
      title: 'First captured from',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Google Business Profile API', value: 'gbp' },
          { title: 'Existing website testimonial', value: 'testimonial' },
        ],
      },
    },
  ],
  preview: {
    select: {
      title: 'reviewerName',
      status: 'status',
      rating: 'starRating',
      date: 'dateDisplay',
    },
    prepare({ title, status, rating, date }) {
      const flag = status === 'missing' ? 'MISSING' : 'live'
      return {
        title: title || 'Google review',
        subtitle: `${flag} · ${rating || '?'}★ · ${date || 'no date'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Missing first',
      name: 'missingFirst',
      by: [
        { field: 'status', direction: 'desc' },
        { field: 'missingSince', direction: 'desc' },
      ],
    },
    {
      title: 'Last seen',
      name: 'lastSeenDesc',
      by: [{ field: 'lastSeenAt', direction: 'desc' }],
    },
  ],
}
