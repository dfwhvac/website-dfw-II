import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'test_database'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'support@dfwhvac.com'
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || ''
const RECAPTCHA_THRESHOLD = 0.4

// Preview-env guard (Apr 24, 2026). Vercel sets VERCEL_ENV to 'production' |
// 'preview' | 'development'. On non-production (preview branches, local dev) we
// short-circuit the Resend send so test submissions from sandbox branches never
// hit the real service@ / estimate@ / contact@ inboxes. Lead is still written to
// MongoDB so the full form pipeline can be verified. To force a real send from
// a preview branch, set FORCE_LEAD_EMAIL_IN_PREVIEW=true in Vercel env.
const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV === 'production'
const FORCE_PREVIEW_EMAIL = process.env.FORCE_LEAD_EMAIL_IN_PREVIEW === 'true'
const SHOULD_SEND_LEAD_EMAIL = IS_PRODUCTION_DEPLOY || FORCE_PREVIEW_EMAIL

// In-memory rate limiter: max 5 submissions per IP per 15 minutes
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const rateLimitMap = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 })
    return false
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) return true
  return false
}

// Email routing configuration
const LEAD_EMAIL_CONFIG = {
  service: {
    to: 'service@dfwhvac.com',
    subjectTemplate: (name, phone) => `Service Lead: ${name} - ${phone}`,
    emoji: '\uD83D\uDD27',
  },
  estimate: {
    to: 'estimate@dfwhvac.com',
    subjectTemplate: (name, phone) => `Estimate Lead: ${name} - ${phone}`,
    emoji: '\uD83D\uDCB0',
  },
  contact: {
    to: 'contact@dfwhvac.com',
    subjectTemplate: (name, _phone, email) => `Contact Form: ${name} - ${email}`,
    emoji: '\uD83D\uDCEC',
  },
}

// Cached MongoDB client for connection reuse across requests
let cachedClient = null

async function getMongoClient() {
  if (cachedClient) return cachedClient
  if (!MONGO_URL) throw new Error('MONGO_URL not configured')
  cachedClient = await new MongoClient(MONGO_URL).connect()
  return cachedClient
}

// Verify reCAPTCHA token with Google
async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET_KEY) {
    // Secret key not configured — skip verification entirely
    return { success: true, score: 1.0, skipped: true }
  }
  if (!token) {
    // No token provided (bot skipping, ad blocker, or very old browser) — flag as blocked
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
    // Graceful fallback: allow submission if Google is unreachable
    return { success: true, score: 1.0, skipped: true }
  }
}

// Escape HTML to prevent XSS in email templates
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildEmailHtml({ lead, leadId, fullName, actionText, highlightColor, emailConfig }) {
  const safeName = escapeHtml(fullName)
  const safePhone = escapeHtml(lead.phone)
  const safeEmail = escapeHtml(lead.email)
  const safeAddress = escapeHtml(lead.serviceAddress)
  const safeSystems = escapeHtml(lead.numSystems)
  const safeDescription = escapeHtml(lead.problemDescription)

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #003153; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${emailConfig.emoji} New ${escapeHtml(lead.leadType.charAt(0).toUpperCase() + lead.leadType.slice(1))} Lead</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: ${highlightColor}; margin-top: 0;">Action Required</h2>
        <p style="font-size: 16px;">${actionText}</p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #003153; margin-top: 0;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${safePhone}" style="color: #FF0000; font-weight: bold; font-size: 18px;">${safePhone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${safeEmail}">${safeEmail}</a>
              </td>
            </tr>
            ${safeAddress ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Address:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeAddress}</td></tr>` : ''}
            ${safeSystems ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>HVAC Systems:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeSystems}</td></tr>` : ''}
          </table>
        </div>
        ${safeDescription ? `
        <div style="background-color: white; padding: 20px; border-radius: 8px;">
          <h3 style="color: #003153; margin-top: 0;">Message / Details</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 0;">${safeDescription}</p>
        </div>` : ''}
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>Lead ID:</strong> ${leadId}<br>
            <strong>Type:</strong> ${escapeHtml(lead.leadType.charAt(0).toUpperCase() + lead.leadType.slice(1))}<br>
            <small>Submitted: ${new Date().toUTCString()}</small>
          </p>
        </div>
      </div>
      <div style="background-color: #003153; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">DFW HVAC Lead Notification System</p>
      </div>
    </div>`
}

export async function POST(request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again later or call us directly.' },
        { status: 429 }
      )
    }

    const lead = await request.json()

    // Validate required fields
    if (!lead.firstName || !lead.lastName || !lead.email || !lead.phone) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(lead.recaptchaToken)
    const isBlocked = !recaptcha.skipped && (!recaptcha.success || recaptcha.score < RECAPTCHA_THRESHOLD)

    const leadId = uuidv4()
    const fullName = `${lead.firstName} ${lead.lastName}`
    const leadType = lead.leadType || 'service'

    // Save to MongoDB (always save, flag blocked submissions)
    const client = await getMongoClient()
    const db = client.db(DB_NAME)
    await db.collection('leads').insertOne({
      id: leadId,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      serviceAddress: lead.serviceAddress || '',
      numSystems: lead.numSystems || '',
      problemDescription: lead.problemDescription || '',
      leadType,
      createdAt: new Date().toISOString(),
      status: isBlocked ? 'blocked' : 'new',
      recaptchaScore: recaptcha.score,
      recaptchaSkipped: recaptcha.skipped,
    })

    // Send email notification
    const emailConfig = LEAD_EMAIL_CONFIG[leadType] || LEAD_EMAIL_CONFIG.service
    if (!SHOULD_SEND_LEAD_EMAIL) {
      // Preview / non-production environment — skip real email delivery.
      // Lead is already persisted in MongoDB above; log what would have been sent
      // so sandbox QA can confirm routing logic is correct.
      console.log(
        `[leads][${process.env.VERCEL_ENV || 'local'}] Skipping Resend send. Would route leadId=${leadId} type=${leadType} to=${emailConfig.to} name="${fullName}"`
      )
    } else if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)

        if (isBlocked) {
          // Send blocked notification email
          await resend.emails.send({
            from: 'DFW HVAC Leads <leads@dfwhvac.com>',
            to: [emailConfig.to],
            subject: `[BLOCKED] Possible Spam Lead — ${fullName} (score: ${recaptcha.score})`,
            html: buildEmailHtml({
              lead: { ...lead, leadType },
              leadId,
              fullName,
              actionText: `This submission was flagged as possible spam by reCAPTCHA (score: ${recaptcha.score}, threshold: ${RECAPTCHA_THRESHOLD}). Review the details below — if this is a real customer, follow up manually.`,
              highlightColor: '#FF6600',
              emailConfig,
            }),
          })
        } else {
          // Send normal lead notification email
          const actionText = leadType === 'estimate'
            ? 'A potential customer is interested in a system replacement quote.'
            : leadType === 'contact'
              ? 'Someone has submitted a general inquiry through the contact form.'
              : 'A potential customer has submitted a service request. Call them back promptly!'
          const highlightColor = leadType === 'estimate' ? '#F77F00' : leadType === 'contact' ? '#00B8FF' : '#FF0000'

          const subject = `${emailConfig.emoji} ${emailConfig.subjectTemplate(fullName, lead.phone, lead.email)}`

          await resend.emails.send({
            from: 'DFW HVAC Leads <leads@dfwhvac.com>',
            to: [emailConfig.to],
            subject,
            html: buildEmailHtml({ lead: { ...lead, leadType }, leadId, fullName, actionText, highlightColor, emailConfig }),
          })
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

    // Always return success to the user (don't reveal bot detection)
    return NextResponse.json({
      success: true,
      message: "Thank you! We'll call you within 2 business hours.",
      lead_id: leadId,
    })
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    )
  }
}
