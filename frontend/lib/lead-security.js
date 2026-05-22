const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || ''
export const RECAPTCHA_THRESHOLD = 0.7

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const rateLimitMap = new Map()

export function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET_KEY) {
    return { success: true, score: 1.0, skipped: true }
  }
  if (!token) {
    return { success: false, score: 0, skipped: false }
  }
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    })
    const data = await response.json()
    return { success: data.success, score: data.score || 0, skipped: false }
  } catch (error) {
    console.error('reCAPTCHA verification failed (network error):', error)
    return { success: true, score: 1.0, skipped: true }
  }
}

export function isRecaptchaBlocked(recaptcha) {
  return !recaptcha.skipped && (!recaptcha.success || recaptcha.score < RECAPTCHA_THRESHOLD)
}
