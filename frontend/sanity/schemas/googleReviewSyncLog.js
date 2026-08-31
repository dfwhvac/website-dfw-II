export default {
  name: 'googleReviewSyncLog',
  title: 'Google Review Sync Log',
  type: 'document',
  description: 'One row per calendar day: Places count vs GBP list vs archive diff.',
  fields: [
    {
      name: 'snapshotAt',
      title: 'Snapshot time',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'placesCount',
      title: 'Google Places public count',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'previousPlacesCount',
      title: 'Previous Places count',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'placesDelta',
      title: 'Places count change',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'gbpListCount',
      title: 'GBP reviews.list length',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'liveLedgerCount',
      title: 'Archive rows still live',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'missingLedgerCount',
      title: 'Archive rows missing',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'newlyMissingCount',
      title: 'Newly missing this run',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'restoredCount',
      title: 'Restored this run',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'newlyMissingIds',
      title: 'Newly missing review IDs',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    },
    {
      name: 'alertSent',
      title: 'Disappearance alert sent',
      type: 'boolean',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      snapshotAt: 'snapshotAt',
      placesCount: 'placesCount',
      placesDelta: 'placesDelta',
      newlyMissingCount: 'newlyMissingCount',
    },
    prepare({ snapshotAt, placesCount, placesDelta, newlyMissingCount }) {
      const day = snapshotAt ? String(snapshotAt).slice(0, 10) : 'unknown'
      const delta =
        typeof placesDelta === 'number'
          ? `${placesDelta >= 0 ? '+' : ''}${placesDelta}`
          : '?'
      return {
        title: `${day} · Places ${placesCount ?? '?'} (${delta})`,
        subtitle: `${newlyMissingCount || 0} newly missing`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest',
      name: 'snapshotDesc',
      by: [{ field: 'snapshotAt', direction: 'desc' }],
    },
  ],
}
