import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import Link from 'next/link'
import { Phone, MapPin, CheckCircle, ArrowRight, Briefcase, Calendar, Award } from 'lucide-react'
import ServiceFirstCTA from '@/components/ServiceFirstCTA'
import RealWorkWidget from '@/components/RealWorkWidget'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Recent HVAC Projects in Dallas-Fort Worth | DFW HVAC',
  description: 'View 500+ completed HVAC installations across DFW. AC repairs, heating systems, and air quality solutions in Dallas, Fort Worth, Arlington & 50+ cities. See our work.',
}

export default async function RecentProjectsPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white" data-testid="recent-projects-page">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Recent Projects</span>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="projects-heading">
              See Our Work Across DFW
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Hundreds of satisfied customers across 50+ cities. Explore our completed HVAC installations, repairs, and maintenance projects.
            </p>
            
            {/* CTA Buttons - Phone-first strategy */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+19727772665"
                className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                data-testid="hero-call-btn"
              >
                <Phone className="w-5 h-5" />
                Call {companyInfo.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003153] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                data-testid="hero-request-btn"
              >
                Request Service
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Subtle estimate link */}
            <p className="text-blue-200 text-sm mt-4">
              Considering a new system? <Link href="/estimate" className="text-white underline hover:text-blue-100">Get a Free Replacement Estimate →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#00B8FF]" />
              <div>
                <div className="text-2xl font-bold text-[#003153]">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-[#32CD32]" />
              <div>
                <div className="text-2xl font-bold text-[#003153]">50+</div>
                <div className="text-sm text-gray-600">Cities Served</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#F77F00]" />
              <div>
                <div className="text-2xl font-bold text-[#003153]">Family Owned</div>
                <div className="text-sm text-gray-600">Three Generations</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-[#FF0000]" />
              <div>
                <div className="text-2xl font-bold text-[#003153]">3 Generations</div>
                <div className="text-sm text-gray-600">of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RealWork Widget Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Widget Placeholder */}
            <div 
              id="realwork-widget-container" 
              className="min-h-[600px] bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300"
              data-testid="realwork-widget-placeholder"
            >
              {/* 
                REALWORK WIDGET PLACEHOLDER
                
                Replace this entire div with the RealWork embed code.
                Example embed formats:
                
                Option 1 - Script embed:
                <script src="https://widgets.realwork.com/embed.js" data-account="YOUR_ID"></script>
                <div id="realwork-widget"></div>
                
                Option 2 - Iframe embed:
                <iframe src="https://app.realwork.com/widget/YOUR_ID" width="100%" height="600" frameborder="0"></iframe>
              */}
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Project Map Widget
                </h3>
                <p className="text-gray-500 max-w-md">
                  RealWork widget will be embedded here showing interactive map of completed projects across DFW.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Links Section - SEO Internal Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#003153] mb-6">
              Areas We Serve
            </h2>
            <p className="text-gray-600 mb-8">
              We provide HVAC services throughout the Dallas-Fort Worth metroplex. Click on a city to learn more about our services in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Dallas', slug: 'dallas' },
                { name: 'Fort Worth', slug: 'fort-worth' },
                { name: 'Arlington', slug: 'arlington' },
                { name: 'Plano', slug: 'plano' },
                { name: 'Irving', slug: 'irving' },
                { name: 'Frisco', slug: 'frisco' },
                { name: 'McKinney', slug: 'mckinney' },
                { name: 'Carrollton', slug: 'carrollton' },
                { name: 'Denton', slug: 'denton' },
                { name: 'Richardson', slug: 'richardson' },
                { name: 'Lewisville', slug: 'lewisville' },
                { name: 'Flower Mound', slug: 'flower-mound' },
              ].map((city) => (
                <Link
                  key={city.slug}
                  href={`/cities-served/${city.slug}`}
                  className="bg-white border border-gray-200 text-[#003153] px-4 py-2 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors text-sm font-medium"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/cities-served"
                className="text-[#00B8FF] font-semibold hover:underline"
              >
                View All Cities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion CTA Section */}
      <ServiceFirstCTA 
        title="Ready to Be Our Next Success Story?"
        description="Join hundreds of satisfied DFW homeowners. Call now for fast, reliable HVAC service with integrity and care."
        variant="blue"
      />

      {/* Additional Trust Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#003153] mb-6 text-center">
              Why Choose DFW HVAC?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Three-Generation Legacy', desc: 'Family-owned with a commitment to quality workmanship' },
                { title: 'Licensed & Insured', desc: 'Fully licensed technicians you can trust in your home' },
                { title: 'Transparent Pricing', desc: 'No hidden fees or surprises—honest assessments every time' },
                { title: 'Comprehensive Warranties', desc: 'We stand behind our work with industry-leading warranties' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-[#32CD32] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003153] mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
