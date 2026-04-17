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

  onChangeRef.current = onChange

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return
    loadGoogleMaps().then(() => setReady(true))
  }, [])

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

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={className}
      placeholder={placeholder}
      autoComplete="off"
      data-testid="address-autocomplete-input"
    />
  )
}

export default AddressAutocomplete
