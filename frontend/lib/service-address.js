/**
 * Service-address helpers shared by AddressAutocomplete, LeadForm, and /api/leads.
 * Keeps lead emails from receiving street-only strings when Places never fully resolved.
 */

/** US-style "…, City, ST 12345" (optional +4 ZIP). Tolerates periods in city names. */
export function looksLikeFullUsAddress(address) {
  const s = String(address || '').trim()
  if (!s) return false
  return /,\s*[A-Za-z0-9 .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/i.test(s)
}

function componentMap(addressComponents = []) {
  const map = {}
  for (const c of addressComponents) {
    for (const t of c.types || []) {
      if (!map[t]) map[t] = c
    }
  }
  return map
}

/**
 * Build "street, city, ST zip" from Google address_components.
 * Returns '' if components are too incomplete to be useful.
 */
export function formatAddressFromComponents(addressComponents) {
  const m = componentMap(addressComponents)
  const streetNum = m.street_number?.short_name || m.street_number?.long_name || ''
  const route = m.route?.short_name || m.route?.long_name || ''
  const street = [streetNum, route].filter(Boolean).join(' ').trim()
  const city =
    m.locality?.long_name ||
    m.sublocality_level_1?.long_name ||
    m.sublocality?.long_name ||
    m.neighborhood?.long_name ||
    m.postal_town?.long_name ||
    ''
  const state = m.administrative_area_level_1?.short_name || ''
  const zip = m.postal_code?.short_name || ''
  const zipSuffix = m.postal_code_suffix?.short_name || ''
  const zipFull = zipSuffix ? `${zip}-${zipSuffix}` : zip

  if (street && city && state && zip) {
    return `${street}, ${city}, ${state} ${zipFull}`
  }
  if (city && state && zip) {
    const left = street || m.name?.long_name || ''
    return left ? `${left}, ${city}, ${state} ${zipFull}` : `${city}, ${state} ${zipFull}`
  }
  return ''
}

/** Prefer formatted_address; fall back to components; strip trailing ", USA". */
export function buildServiceAddressFromPlace(place) {
  if (!place) return ''
  const fromComponents = formatAddressFromComponents(place.address_components || [])
  if (fromComponents && looksLikeFullUsAddress(fromComponents)) {
    return fromComponents
  }
  const formatted = String(place.formatted_address || '')
    .replace(/,\s*USA\s*$/i, '')
    .replace(/,\s*United States\s*$/i, '')
    .trim()
  if (formatted) return formatted
  return fromComponents
}

export const ADDRESS_INCOMPLETE_MESSAGE =
  'Please select an address from the list so we get your city, state, and ZIP.'
