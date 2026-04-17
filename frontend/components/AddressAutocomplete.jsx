'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sessionToken, setSessionToken] = useState(null)
  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  const stableOnChange = useCallback(onChange, [onChange])

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || initialized) return

    loadGoogleMaps().then(() => {
      if (autocompleteRef.current) return

      try {
        // Try new PlaceAutocompleteElement API first
        if (window.google?.maps?.places?.AutocompleteService) {
          autocompleteRef.current = new window.google.maps.places.AutocompleteService()
          setSessionToken(new window.google.maps.places.AutocompleteSessionToken())
          setInitialized(true)
        }
      } catch (e) {
        console.warn('Places API initialization error:', e)
      }
    })
  }, [initialized])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchSuggestions = useCallback((input) => {
    if (!autocompleteRef.current || !input || input.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      autocompleteRef.current.getPlacePredictions(
        {
          input,
          types: ['address'],
          componentRestrictions: { country: 'us' },
          locationBias: {
            center: DFW_CENTER,
            radius: DFW_RADIUS,
          },
          sessionToken,
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        }
      )
    }, 300)
  }, [sessionToken])

  const handleSelect = useCallback((prediction) => {
    stableOnChange(prediction.description)
    setSuggestions([])
    setShowSuggestions(false)
    // Create new session token for next search
    setSessionToken(new window.google.maps.places.AutocompleteSessionToken())
  }, [stableOnChange])

  const handleInputChange = useCallback((e) => {
    const val = e.target.value
    stableOnChange(val)
    fetchSuggestions(val)
  }, [stableOnChange, fetchSuggestions])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
        required={required}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
        data-testid="address-autocomplete-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          data-testid="address-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            maxHeight: '200px',
            overflowY: 'auto',
            margin: '4px 0 0 0',
            padding: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                borderBottom: '1px solid #f1f5f9',
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#f1f5f9' }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'white' }}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AddressAutocomplete
