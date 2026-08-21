'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import { buildServiceAddressFromPlace } from '@/lib/service-address'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

// DFW metroplex center with ~60 mile radius
const DFW_LAT = 32.8998
const DFW_LNG = -97.0403
const DFW_RADIUS = 96560

const PLACE_FIELDS = ['place_id', 'formatted_address', 'address_components', 'geometry', 'name']

let loadPromise = null

function loadGoogleMaps() {
  if (loadPromise) return loadPromise
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve()
  }
  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
  return loadPromise
}

/**
 * @param {(value: string, meta?: { source: 'places' | 'typed', placeId?: string }) => void} onChange
 */
const AddressAutocomplete = ({ value, onChange, id, className, placeholder, required }) => {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const handleFocus = () => {
    setFocused(true)
    if (!GOOGLE_MAPS_API_KEY || ready) return
    loadGoogleMaps().then(() => setReady(true))
  }

  const handleBlur = () => {
    if (!value) setFocused(false)
  }

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return

    const gm = window.google.maps
    const autocomplete = new gm.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: PLACE_FIELDS,
    })

    const dfwCenter = new gm.LatLng(DFW_LAT, DFW_LNG)
    const circle = new gm.Circle({ center: dfwCenter, radius: DFW_RADIUS })
    autocomplete.setBounds(circle.getBounds())

    const emitPlacesAddress = (place) => {
      const formatted = buildServiceAddressFromPlace(place)
      if (!formatted) return false
      onChangeRef.current(formatted, {
        source: 'places',
        placeId: place.place_id || undefined,
      })
      return true
    }

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      // Enter / dismiss without a real prediction — Google docs: no geometry.
      // Do not overwrite React state; parent keeps typed text and unresolved flag.
      if (!place?.place_id && !place?.geometry?.location) {
        return
      }

      if (emitPlacesAddress(place)) return

      // Selected prediction but Details payload incomplete — fetch fields explicitly.
      if (place.place_id) {
        const svc = new gm.places.PlacesService(document.createElement('div'))
        svc.getDetails(
          { placeId: place.place_id, fields: PLACE_FIELDS },
          (detail, status) => {
            if (status === gm.places.PlacesServiceStatus.OK && detail) {
              emitPlacesAddress(detail)
            }
          }
        )
      }
    })

    autocompleteRef.current = autocomplete
  }, [ready])

  const showAttribution = focused || ready || Boolean(value)

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value, { source: 'typed' })}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
        data-testid="address-autocomplete-input"
      />
      {showAttribution && GOOGLE_MAPS_API_KEY && (
        <p
          className="mt-1 text-[11px] text-gray-500 flex items-center gap-1 transition-opacity duration-200"
          data-testid="google-attribution"
        >
          <span>Powered by</span>
          <span aria-label="Google">
            <span className="text-[#4285F4] font-medium">G</span>
            <span className="text-[#EA4335] font-medium">o</span>
            <span className="text-[#FBBC05] font-medium">o</span>
            <span className="text-[#4285F4] font-medium">g</span>
            <span className="text-[#34A853] font-medium">l</span>
            <span className="text-[#EA4335] font-medium">e</span>
          </span>
        </p>
      )}
    </div>
  )
}

export default AddressAutocomplete
