import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

// Dedicated lead endpoint for the /replacement-estimator soft opt-in.
// Stripped-down version of /api/leads — no address, no reCAPTCHA,
// no problemDescription. The estimator's own inputs ARE the lead
// context, so they're saved alongside the contact fields.

export const dynamic = 'force-dynamic'

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'test_database'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'estimate@dfwhvac.com'

// Preview-env guard (same pattern as /api/leads — skip Resend on non-prod)
const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV === 'production'
const FORCE_PREVIEW_EMAIL = process.env.FORCE_LEAD_EMAIL_IN_PREVIEW === 'true'
const SHOULD_SEND_LEAD_EMAIL = IS_PRODUCTION_DEPLOY || FORCE_PREVIEW_EMAIL

let cachedClient = null
async function getMongoClient() {
  if (cachedClient) return cachedClient
  if (!MONGO_URL) throw new Error('MONGO_URL not configured')
  cachedClient = await new MongoClient(MONGO_URL).connect()
  return cachedClient
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, phone, email, estimate, inputs } = body || {}

    if (!firstName || !phone) {
      return NextResponse.json(
        { error: 'firstName and phone are required' },
        { status: 400 }
      )
    }
    if (!estimate || typeof estimate.low !== 'number' || typeof estimate.high !== 'number') {
      return NextResponse.json(
        { error: 'Valid estimate payload required' },
        { status: 400 }
      )
    }

    const leadId = uuidv4()
    const leadDoc = {
      _leadId: leadId,
      leadType: 'estimator_replacement',
      firstName: String(firstName).trim().slice(0, 100),
      phone: String(phone).trim().slice(0, 30),
      email: email ? String(email).trim().slice(0, 200) : null,
      estimateLow: estimate.low,
      estimateHigh: estimate.high,
      estimateTonnage: estimate.tonnage || null,
      wizardInputs: inputs || null,
      status: 'new',
      createdAt: new Date(),
    }

    // Persist to MongoDB — even on preview, so the pipeline is verifiable
    const client = await getMongoClient()
    await client.db(DB_NAME).collection('leads').insertOne({ ...leadDoc })

    // Email notification (production only; preview skips — same guard as /api/leads)
    if (!SHOULD_SEND_LEAD_EMAIL) {
      console.log(
        `[estimator/lead][${process.env.VERCEL_ENV || 'local'}] Skipping Resend. leadId=${leadId} name=${leadDoc.firstName} range=$${leadDoc.estimateLow}-${leadDoc.estimateHigh}`
      )
    } else if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #003153; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🧮 Replacement Estimator Lead</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <p style="font-size: 16px;">New homeowner completed the /replacement-estimator and opted in for a free on-site estimate.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #003153; margin-top: 0;">Contact</h3>
                <p><strong>Name:</strong> ${escapeHtml(leadDoc.firstName)}</p>
                <p><strong>Phone:</strong> <a href="tel:${escapeHtml(leadDoc.phone)}">${escapeHtml(leadDoc.phone)}</a></p>
                ${leadDoc.email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(leadDoc.email)}">${escapeHtml(leadDoc.email)}</a></p>` : ''}
              </div>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #003153; margin-top: 0;">Estimator Result</h3>
                <p style="font-size: 18px;"><strong>Range:</strong> $${leadDoc.estimateLow.toLocaleString()} – $${leadDoc.estimateHigh.toLocaleString()}</p>
                ${leadDoc.estimateTonnage ? `<p><strong>Tonnage:</strong> ${leadDoc.estimateTonnage} tons</p>` : ''}
                <h4 style="color: #003153;">Wizard answers:</h4>
                <pre style="background:#f4f4f4;padding:10px;border-radius:4px;font-size:12px;">${escapeHtml(JSON.stringify(leadDoc.wizardInputs, null, 2))}</pre>
              </div>
              <div style="text-align:center;margin-top:20px;">
                <p style="color:#666;font-size:12px;">Lead ID: ${leadId}</p>
              </div>
            </div>
          </div>
        `
        await resend.emails.send({
          from: 'DFW HVAC Leads <leads@dfwhvac.com>',
          to: [NOTIFICATION_EMAIL],
          replyTo: leadDoc.email || undefined,
          subject: `Replacement Estimator Lead — ${leadDoc.firstName} · $${leadDoc.estimateLow.toLocaleString()}–${leadDoc.estimateHigh.toLocaleString()}`,
          html,
        })
      } catch (emailErr) {
        console.error('[estimator/lead] Resend failed (lead still saved):', emailErr)
      }
    }

    return NextResponse.json({ success: true, leadId })
  } catch (err) {
    console.error('[estimator/lead] error:', err)
    return NextResponse.json(
      { error: 'Unable to save your request. Please call us directly.' },
      { status: 500 }
    )
  }
}
