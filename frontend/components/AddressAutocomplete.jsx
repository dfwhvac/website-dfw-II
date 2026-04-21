'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

// DFW metroplex center with ~60 mile radius
const DFW_LAT = 32.8998
const DFW_LNG = -97.0403
const DFW_RADIUS = 96560

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

const AddressAutocomplete = ({ value, onChange, id, className, placeholder, required }) => {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const [ready, setReady] = useState(false)
  const [focused, setFocused] = useState(false)

  onChangeRef.current = onChange

  // Lazy-load Google Maps only when the user actually interacts with the
  // address field. Saves ~800–1,200ms TBT on form pages for users who never
  // engage with the address input (e.g., bounced visitors, mobile tire-kickers).
  const handleFocus = () => {
    setFocused(true)
    if (!GOOGLE_MAPS_API_KEY || ready) return
    loadGoogleMaps().then(() => setReady(true))
  }

  const handleBlur = () => {
    // Keep attribution visible if the field has a value (user has interacted).
    // Otherwise hide to keep the UI clean.
    if (!value) setFocused(false)
  }

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return

    const gm = window.google.maps
    const autocomplete = new gm.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    })

    // Bias toward DFW
    const dfwCenter = new gm.LatLng(DFW_LAT, DFW_LNG)
    const circle = new gm.Circle({ center: dfwCenter, radius: DFW_RADIUS })
    autocomplete.setBounds(circle.getBounds())

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place?.formatted_address) {
        onChangeRef.current(place.formatted_address)
      }
    })

    autocompleteRef.current = autocomplete
  }, [ready])

  // Show attribution once the user engages with the field (focus) or after
  // autocomplete has loaded. Google's Places API terms require "Powered by
  // Google" attribution when displaying autocomplete results. When the widget's
  // suggestions dropdown is active, Google renders its own branding there, but
  // we surface this inline so attribution is visible throughout the interaction.
  const showAttribution = focused || ready || Boolean(value)

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
