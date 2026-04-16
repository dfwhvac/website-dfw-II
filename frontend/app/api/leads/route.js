import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'test_database'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'support@dfwhvac.com'

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

function buildEmailHtml({ lead, leadId, fullName, actionText, highlightColor, emailConfig }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #003153; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${emailConfig.emoji} New ${lead.leadType.charAt(0).toUpperCase() + lead.leadType.slice(1)} Lead</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: ${highlightColor}; margin-top: 0;">Action Required</h2>
        <p style="font-size: 16px;">${actionText}</p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #003153; margin-top: 0;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${lead.phone}" style="color: #FF0000; font-weight: bold; font-size: 18px;">${lead.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${lead.email}">${lead.email}</a>
              </td>
            </tr>
            ${lead.serviceAddress ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service Address:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.serviceAddress}</td></tr>` : ''}
            ${lead.numSystems ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>HVAC Systems:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.numSystems}</td></tr>` : ''}
          </table>
        </div>
        ${lead.problemDescription ? `
        <div style="background-color: white; padding: 20px; border-radius: 8px;">
          <h3 style="color: #003153; margin-top: 0;">Message / Details</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 0;">${lead.problemDescription}</p>
        </div>` : ''}
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>Lead ID:</strong> ${leadId}<br>
            <strong>Type:</strong> ${lead.leadType.charAt(0).toUpperCase() + lead.leadType.slice(1)}<br>
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
    const lead = await request.json()

    // Validate required fields
    if (!lead.firstName || !lead.lastName || !lead.email || !lead.phone) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    const leadId = uuidv4()
    const fullName = `${lead.firstName} ${lead.lastName}`
    const leadType = lead.leadType || 'service'

    // Save to MongoDB
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
      status: 'new',
    })

    // Send email notification
    const emailConfig = LEAD_EMAIL_CONFIG[leadType] || LEAD_EMAIL_CONFIG.service
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
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
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

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
