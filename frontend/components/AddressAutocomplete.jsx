'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Input } from './ui/input'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''

// DFW metroplex center (DFW Airport area) with ~60 mile radius
const DFW_LAT = 32.8998
const DFW_LNG = -97.0403
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
  const serviceRef = useRef(null)
  const [initialized, setInitialized] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const sessionTokenRef = useRef(null)
  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || initialized) return

    loadGoogleMaps().then(() => {
      if (serviceRef.current) return
      try {
        serviceRef.current = new window.google.maps.places.AutocompleteService()
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
        setInitialized(true)
      } catch (e) {
        console.warn('Places API init error:', e)
      }
    })
  }, [initialized])

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
    if (!serviceRef.current || !input || input.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const request = {
        input,
        types: ['address'],
        componentRestrictions: { country: 'us' },
        location: new window.google.maps.LatLng(DFW_LAT, DFW_LNG),
        radius: DFW_RADIUS,
        sessionToken: sessionTokenRef.current,
      }

      serviceRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      })
    }, 300)
  }, [])

  const handleSelect = useCallback((prediction) => {
    onChange(prediction.description)
    setSuggestions([])
    setShowSuggestions(false)
    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
  }, [onChange])

  const handleInputChange = useCallback((e) => {
    const val = e.target.value
    onChange(val)
    fetchSuggestions(val)
  }, [onChange, fetchSuggestions])

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
