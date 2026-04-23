import { NextResponse } from 'next/server'

/**
 * 410 Gone middleware — tells Google + AI crawlers that these URLs
 * are permanently removed (stronger signal than 404).
 *
 * Patterns covered:
 *   - /_files/ugd/*           Wix CDN PDF/document phantoms
 *   - /post/*  /blog/*        Never-real Wix blog URLs (may revisit as a real /blog later)
 *   - /signup /login /my-account   Wix members-area pages (not applicable to current site)
 *   - /equipment              Non-applicable old Wix page
 *   - /copy-of-*              Wix auto-generated duplicate pages
 *                             (Note: /copy-of-ac-furnace-repair is handled by an explicit
 *                             301 in next.config.js which runs BEFORE this middleware.)
 *
 * Last updated: Apr 23, 2026 — legacy URL audit
 * See /app/memory/audits/2026-04-23_Legacy_URL_Redirect_Map.md
 */

const GONE_EXACT = new Set([
  '/equipment',
  '/signup',
  '/login',
  '/my-account',
  '/copy-of-energy-conservation',
])

const GONE_PREFIX = [
  '/_files/ugd/',
  '/post/',
  '/blog/',
  '/copy-of-',
]

function is410(pathname) {
  if (GONE_EXACT.has(pathname)) return true
  for (const prefix of GONE_PREFIX) {
    if (pathname.startsWith(prefix)) return true
  }
  return false
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  if (is410(pathname)) {
    return new NextResponse(
      `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Gone | DFW HVAC</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:4rem auto;padding:2rem;color:#003153;line-height:1.6">
<h1 style="font-size:1.5rem;margin-bottom:.5rem">This page has been permanently removed.</h1>
<p style="color:#475569">The page you were looking for is no longer part of our site. You may be looking for one of the following:</p>
<ul style="margin-top:1rem">
  <li><a href="/" style="color:#0077B6">Home</a></li>
  <li><a href="/services" style="color:#0077B6">Our Services</a></li>
  <li><a href="/request-service" style="color:#0077B6">Request Service</a></li>
  <li><a href="/contact" style="color:#0077B6">Contact Us</a></li>
</ul>
<p style="margin-top:2rem;color:#475569">Need help now? Call <a href="tel:+19727772665" style="color:#D30000;font-weight:600">(972) 777-2665</a></p>
</body></html>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  // Run middleware on all non-static, non-API requests.
  // The is410() function decides which paths to return 410 for; everything else calls next().
  // NOTE: /_files/ugd/* needs to pass through (PDFs); we explicitly re-include it via a
  // second matcher entry so the exclusion list doesn't swallow it.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|json|xml|woff|woff2|ttf|otf|map)).*)',
    '/_files/:path*',
  ],
}
