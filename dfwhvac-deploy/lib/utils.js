import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Phone number formatting
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// URL slug generation
export function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// Generate excerpt from content
export function generateExcerpt(content, maxLength = 160) {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return truncateText(plainText, maxLength)
}