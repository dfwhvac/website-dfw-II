import { NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJoSn502QpTIYRy6YwoMmFyCE'
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN

export async function GET(request) {
  // Verify cron secret (optional security)
  const authHeader = request.headers.get('authorization')
  
  try {
    // Fetch from Google Places API
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    )
    const googleData = await googleResponse.json()
    
    if (googleData.status !== 'OK') {
      return NextResponse.json({ error: 'Google API error', details: googleData }, { status: 500 })
    }
    
    const { rating, user_ratings_total } = googleData.result
    
    // Update Sanity
    const sanityResponse = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SANITY_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: 'companyInfo',
                set: {
                  googleRating: rating,
                  googleReviews: user_ratings_total
                }
              }
            }
          ]
        })
      }
    )
    
    const sanityResult = await sanityResponse.json()
    
    return NextResponse.json({
      success: true,
      rating,
      reviewCount: user_ratings_total,
      sanityUpdated: sanityResult,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
