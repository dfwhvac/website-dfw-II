// Single source of truth for DFW HVAC operating hours.
// Sanity `companyInfo.businessHours` overrides these on the live site when present.
// Monday–Thursday 8:00 AM–6:00 PM, Friday 8:00 AM–5:00 PM, weekends closed.

export const BUSINESS_HOURS = {
  monday: '8AM-6PM',
  tuesday: '8AM-6PM',
  wednesday: '8AM-6PM',
  thursday: '8AM-6PM',
  friday: '8AM-5PM',
  saturday: 'Closed',
  sunday: 'Closed',
}

/** Parenthetical / FAQ style. */
export const HOURS_RANGE =
  'Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM'

/** Sentence style used in the hours FAQ. */
export const HOURS_RANGE_LONG =
  'Monday through Thursday, 8:00 AM to 6:00 PM, and Friday, 8:00 AM to 5:00 PM'

/** One-line footer / 404 style. */
export const HOURS_COMPACT = 'Mon–Thu 8AM–6PM, Fri 8AM–5PM'

/** Contact meta description (under 160 characters). */
export const HOURS_CONTACT_META =
  'Contact DFW HVAC for heating and cooling service across Dallas-Fort Worth. Open Mon–Thu 8 AM–6 PM, Fri 8 AM–5 PM. Same-day service available.'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_SHORT = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

const SCHEMA_DAY = {
  monday: 'Mo',
  tuesday: 'Tu',
  wednesday: 'We',
  thursday: 'Th',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'Su',
}

/**
 * Group consecutive days that share the same hours.
 * Returns [{ label: 'Mon–Thu', value: '8AM-6PM', text: 'Mon–Thu: 8AM-6PM' }, ...]
 */
export function formatBusinessHourLines(hours = BUSINESS_HOURS) {
  const source = hours || BUSINESS_HOURS
  const groups = []

  for (const day of DAY_ORDER) {
    const value = source[day] || 'Closed'
    const last = groups[groups.length - 1]
    if (last && last.value.toLowerCase() === String(value).toLowerCase()) {
      last.days.push(day)
    } else {
      groups.push({ value, days: [day] })
    }
  }

  return groups.map(({ value, days }) => {
    const start = DAY_SHORT[days[0]]
    const end = DAY_SHORT[days[days.length - 1]]
    const label = days.length === 1 ? start : `${start}–${end}`
    return { label, value, text: `${label}: ${value}` }
  })
}

/** "8AM" / "6 PM" / "08:00" → schema.org Time "08:00" / "18:00". */
export function toSchemaTime(token) {
  const raw = String(token || '').trim()
  if (/^\d{2}:\d{2}$/.test(raw)) return raw

  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!match) return raw

  let hour = parseInt(match[1], 10)
  const minute = match[2] || '00'
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && hour < 12) hour += 12
  if (ampm === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}

const LEGACY_WEEKDAY = /^7\s*AM\s*-\s*6\s*PM$/i

/**
 * Sanity still stores the previous Mon–Fri 7AM–6PM schedule until that
 * document is patched. Treat that exact weekday set as stale and use the
 * current hours. Any other Studio edit wins.
 */
export function resolveBusinessHours(hours) {
  if (!hours || typeof hours !== 'object' || !hours.monday) return BUSINESS_HOURS
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  const legacy = weekdays.every((day) => LEGACY_WEEKDAY.test(String(hours[day] || '').trim()))
  if (!legacy) return hours
  return {
    ...BUSINESS_HOURS,
    saturday: hours.saturday || 'Closed',
    sunday: hours.sunday || 'Closed',
  }
}

/**
 * Rewrite published copy that still states the previous schedule.
 * Longer phrases are replaced first. Current copy is left unchanged.
 */
export function rewriteLegacyHoursCopy(text) {
  if (typeof text !== 'string' || !text) return text
  const replacements = [
    [
      'Our office is open Monday through Friday, 7:00 AM to 6:00 PM, and service appointments are scheduled between 9:00 AM and 6:00 PM.',
      `Our regular business hours are ${HOURS_RANGE_LONG}.`,
    ],
    [
      'Our office is open Monday through Friday from 7 AM. Service appointments are scheduled between 9 AM and 6 PM.',
      'Our office is open Monday through Thursday from 8 AM to 6 PM, and Friday from 8 AM to 5 PM.',
    ],
    [
      'Monday-Friday between 9 AM and 6 PM (our office is open from 7 AM if you need to call ahead)',
      HOURS_RANGE,
    ],
    ['Monday-Friday between 9 AM and 6 PM', HOURS_RANGE],
    ['Monday through Friday, 7:00 AM to 6:00 PM', HOURS_RANGE_LONG],
    ['Monday-Friday, 7 AM - 6 PM', HOURS_RANGE],
    ['Monday–Friday, 7 AM – 6 PM', 'Mon–Thu 8 AM–6 PM, Fri 8 AM–5 PM'],
    ['Same-day service M-Sat', 'Same-day service Mon–Fri'],
  ]
  let next = text
  for (const [from, to] of replacements) {
    if (next.includes(from)) next = next.split(from).join(to)
  }
  return next
}

/**
 * schema.org openingHours text values, open days only.
 * Example: ['Mo-Th 08:00-18:00', 'Fr 08:00-17:00']
 */
export function schemaOpeningHours(hours = BUSINESS_HOURS) {
  const source = hours || BUSINESS_HOURS
  const groups = []

  for (const day of DAY_ORDER) {
    const value = source[day]
    if (!value || String(value).toLowerCase() === 'closed') continue

    const match = String(value).match(
      /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i
    )
    if (!match) continue

    const opens = toSchemaTime(match[1])
    const closes = toSchemaTime(match[2])
    const key = `${opens}-${closes}`
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.days.push(day)
    else groups.push({ key, opens, closes, days: [day] })
  }

  return groups.map(({ opens, closes, days }) => {
    const start = SCHEMA_DAY[days[0]]
    const end = SCHEMA_DAY[days[days.length - 1]]
    const label = days.length === 1 ? start : `${start}-${end}`
    return `${label} ${opens}-${closes}`
  })
}
