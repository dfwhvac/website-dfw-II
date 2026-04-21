import Link from 'next/link'
import { Phone, Home, MapPin, Wrench, Star, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Page Not Found | DFW HVAC',
  description: "Sorry, we couldn't find that page. Call DFW HVAC at (972) 777-2665 for same-day HVAC service in Dallas-Fort Worth.",
  robots: { index: false, follow: true },
}

/**
 * Branded 404 page — replaces Next.js default "This page could not be found".
 *
 * Design philosophy: a broken link is still a live visitor. Surface the
 * phone number prominently (the #1 conversion path), then give them paths
 * back to the site's most-visited sections so the 404 becomes a navigation
 * aid, not a dead end.
 *
 * Added Apr 21, 2026 (PR #3, R2.1) — closes audit finding from P1.2.
 * Header/Footer intentionally omitted here so the 404 renders with minimal
 * dependencies (no Sanity fetch). Consistent branding via DFW colors.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full text-center" data-testid="not-found-page">
          {/* Subtle 404 marker */}
          <div className="text-[#00B8FF] font-semibold tracking-widest text-sm mb-4">
            404 · PAGE NOT FOUND
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#003153] mb-4">
            We couldn&apos;t find that page
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
            The page may have moved or the link was typed incorrectly. But your HVAC needs are still our top priority — here are fast ways to get help.
          </p>

          {/* Primary conversion: phone call */}
          <div className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white rounded-2xl p-8 md:p-10 mb-10 shadow-xl">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F77F00] text-[#F77F00]" />
              ))}
              <span className="text-blue-100 text-sm ml-2">5.0 · 145 Google Reviews</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Call now for same-day service
            </h2>
            <p className="text-blue-100 mb-6">
              Keeping it Cool — For Three Generations.
            </p>
            <a
              href="tel:+19727772665"
              className="inline-flex items-center justify-center gap-3 bg-[#FF0000] hover:bg-red-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-lg transition-colors"
              data-testid="not-found-call-cta"
            >
              <Phone className="w-6 h-6" />
              (972) 777-2665
            </a>
          </div>

          {/* Secondary navigation — popular destinations */}
          <h3 className="text-[#003153] font-semibold text-lg mb-4">
            Or pick up where you left off
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#003153] px-4 py-4 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors font-medium"
              data-testid="not-found-home-link"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/services"
              className="group flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#003153] px-4 py-4 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors font-medium"
              data-testid="not-found-services-link"
            >
              <Wrench className="w-5 h-5" />
              Services
            </Link>
            <Link
              href="/cities-served"
              className="group flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#003153] px-4 py-4 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors font-medium"
              data-testid="not-found-cities-link"
            >
              <MapPin className="w-5 h-5" />
              Cities Served
            </Link>
            <Link
              href="/reviews"
              className="group flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-[#003153] px-4 py-4 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors font-medium"
              data-testid="not-found-reviews-link"
            >
              <Star className="w-5 h-5" />
              Reviews
            </Link>
          </div>

          {/* Tertiary: explicit request-service path */}
          <Link
            href="/request-service"
            className="inline-flex items-center gap-2 text-[#00B8FF] hover:text-[#003153] font-semibold transition-colors"
            data-testid="not-found-request-service-link"
          >
            Request service online
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-100">
        DFW HVAC · Coppell, TX · Mon–Fri 7AM–6PM
      </footer>
    </div>
  )
}
