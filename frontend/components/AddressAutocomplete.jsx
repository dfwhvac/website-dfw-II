'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

// DFW metroplex center (DFW Airport area) with ~60 mile radius
const DFW_CENTER = { lat: 32.8998, lng: -97.0403 }
const DFW_RADIUS = 96560 // ~60 miles in meters

let googleMapsLoaded = false
let googleMapsLoading = false
const loadCallbacks = []

function loadGoogleMaps() {
  if (googleMapsLoaded) return Promise.resolve()
  if (googleMapsLoading) {
    return new Promise(resolve => loadCallbacks.push(resolve))
  }
  googleMapsLoading = true
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => {
      googleMapsLoaded = true
      googleMapsLoading = false
      resolve()
      loadCallbacks.forEach(cb => cb())
      loadCallbacks.length = 0
    }
    document.head.appendChild(script)
  })
}

const AddressAutocomplete = ({ value, onChange, id, className, placeholder, required }) => {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || initialized) return

    loadGoogleMaps().then(() => {
      if (!inputRef.current || autocompleteRef.current) return

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      })

      // Bias toward DFW area (not restrict)
      autocomplete.setBounds(
        new window.google.maps.Circle({
          center: DFW_CENTER,
          radius: DFW_RADIUS,
        }).getBounds()
      )

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place?.formatted_address) {
          onChange(place.formatted_address)
        }
      })

      autocompleteRef.current = autocomplete
      setInitialized(true)
    })
  }, [initialized, onChange])

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
    />
  )
}

export default AddressAutocomplete
