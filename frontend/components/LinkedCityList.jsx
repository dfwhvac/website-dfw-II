'use client'

import Link from 'next/link'

/**
 * Displays a list of cities as clickable links to their city pages
 * @param {Array} cities - Array of city objects with cityName and slug
 * @param {string} className - Additional CSS classes for the container
 */
export default function LinkedCityList({ cities = [], className = '' }) {
  if (!cities || cities.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/cities-served/${city.slug}`}
          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#00B8FF] hover:text-white transition-colors"
        >
          {city.cityName}
        </Link>
      ))}
    </div>
  )
}

/**
 * Simple text list of city links (for inline use)
 */
export function LinkedCityText({ cities = [], separator = ', ' }) {
  if (!cities || cities.length === 0) return null

  return (
    <span>
      {cities.map((city, index) => (
        <span key={city.slug}>
          <Link
            href={`/cities-served/${city.slug}`}
            className="text-[#00B8FF] hover:underline"
          >
            {city.cityName}
          </Link>
          {index < cities.length - 1 && separator}
        </span>
      ))}
    </span>
  )
}
