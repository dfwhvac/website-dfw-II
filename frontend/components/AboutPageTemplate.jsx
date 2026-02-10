'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import LeadForm from './LeadForm'
import LinkedCityList from './LinkedCityList'
import { PortableText } from '@portabletext/react'
import { 
  Phone, 
  Star,
  Shield,
  Award,
  Heart,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react'

// Icon mapping for brand pillars
const iconMap = {
  'shield': Shield,
  'award': Award,
  'heart': Heart,
  'users': Users,
  'star': Star,
  'check-circle': CheckCircle,
}

// Default brand pillars based on brand framework
const defaultBrandPillars = [
  {
    title: 'Trust',
    tagline: 'Honest, Transparent, Ethical',
    description: 'We provide honest assessments and fair pricing. No hidden fees, no unnecessary repairs—just straightforward service you can count on.',
    icon: 'shield',
    proofPoints: [
      'Transparent, flat-rate pricing with no hidden fees',
      'Honest assessment of your system\'s needs',
      'Clear documentation of all work performed',
      'Customer-first recommendations, not upsells',
    ],
  },
  {
    title: 'Excellence',
    tagline: 'Skilled, Professional, Safe',
    description: 'Our technicians are fully licensed, trained, and committed to delivering top-quality work with expert problem-solving.',
    icon: 'award',
    proofPoints: [
      'Licensed and insured technicians',
      'Ongoing training on latest HVAC technology',
      'Quality parts and meticulous workmanship',
      'Optimal system design for your specific needs',
    ],
  },
  {
    title: 'Care',
    tagline: 'Attentive, Consultative, Convenient',
    description: 'We treat every customer like family, ensuring a seamless and satisfying experience from first call to completed service.',
    icon: 'heart',
    proofPoints: [
      'Easy online booking and flexible scheduling',
      'Proactive communication throughout service',
      'Respectful of your home and time',
      'Comprehensive warranties on all work',
    ],
  },
]

// Default statistics - will be overridden by dynamic data
const defaultStatistics = [
  { value: '50+', label: 'Years of Family Legacy', suffix: '' },
  { value: '5.0', label: 'Google Rating', suffix: 'Stars' },
  { value: '130+', label: 'Customer Reviews', suffix: '' },
  { value: 'Same-Day', label: 'Service Available', suffix: '' },
]

// Function to get dynamic statistics with live Google data
const getDynamicStatistics = (companyInfo, cmsStatistics) => {
  const googleRating = companyInfo?.googleRating || 5.0
  const googleReviews = companyInfo?.googleReviews || 130
  
  // If CMS has custom statistics, use them but override Google data
  if (cmsStatistics && cmsStatistics.length > 0) {
    return cmsStatistics.map(stat => {
      if (stat.label === 'Google Rating') {
        return { ...stat, value: googleRating.toString() }
      }
      if (stat.label === 'Customer Reviews') {
        return { ...stat, value: `${googleReviews}+` }
      }
      return stat
    })
  }
  
  // Return defaults with live data
  return [
    { value: '50+', label: 'Years of Family Legacy', suffix: '' },
    { value: googleRating.toString(), label: 'Google Rating', suffix: 'Stars' },
    { value: `${googleReviews}+`, label: 'Customer Reviews', suffix: '' },
    { value: '24/7', label: 'Emergency Service', suffix: '' },
  ]
}

// Default story content
const defaultStoryContent = `DFW HVAC was founded in 2020 as the natural evolution of a three-generation family commitment to trustworthy, high-quality HVAC service in the Dallas–Fort Worth Metroplex.

This commitment began in 1972 when Garland Nevil started A-1 Air Conditioning & Heating. It continued through his son, Ronny Grubb, who spent over 50 years building Alpine Heating & Air Conditioning on honest assessments, fair pricing, and meticulous workmanship.

The founder grew up learning the trade at his father's side before pursuing a corporate career. He was ultimately drawn back by a desire to make a direct, meaningful impact in his community.

In 2019, the founder left the corporate world to return to the field full-time, combining his family's hard-earned technical expertise with modern systems, training, and processes designed to support technicians and protect customers.

DFW HVAC was created to empower skilled professionals to deliver expert service with integrity and care—putting people, safety, and long-term satisfaction over short-term profit.`

const AboutPageTemplate = ({ 
  aboutPage = null,
  companyInfo = {}, 
  testimonials = [],
  cityPages = [],
  siteSettings = null,
}) => {
  const phone = companyInfo?.phone || '(972) 777-COOL'
  const googleReviews = companyInfo?.googleReviews || 130

  // Use CMS data with fallbacks
  const heroTitle = aboutPage?.heroTitle || 'About DFW HVAC'
  const heroSubtitle = aboutPage?.heroSubtitle || 'Three Generations of Trusted HVAC Service'
  const heroDescription = aboutPage?.heroDescription || 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.'
  
  const storyTitle = aboutPage?.storyTitle || 'Our Story'
  const storyHighlight = aboutPage?.storyHighlight || 'Three-Generation Family Legacy'
  const storyContent = aboutPage?.storyContent // Rich text from Sanity
  
  const valuesTitle = aboutPage?.valuesTitle || 'Our Values'
  const valuesSubtitle = aboutPage?.valuesSubtitle || 'The pillars that guide everything we do'
  const brandPillars = aboutPage?.brandPillars?.length > 0 ? aboutPage.brandPillars : defaultBrandPillars
  
  const statistics = getDynamicStatistics(companyInfo, aboutPage?.statistics)
  
  const legacyTimeline = aboutPage?.legacyTimeline || []
  
  const showTestimonials = aboutPage?.showTestimonials !== false
  const showContactForm = aboutPage?.showContactForm !== false

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {heroTitle}
            </h1>
            <p className="text-xl lg:text-2xl text-blue-200 mb-6">
              {heroSubtitle}
            </p>
            <p className="text-lg text-blue-100 mb-8">
              {heroDescription}
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Three-Generation Legacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                <span>5.0 Rating • {googleReviews}+ Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{storyTitle}</h2>
                
                {storyContent ? (
                  <div className="text-gray-600 space-y-4">
                    <PortableText 
                      value={storyContent} 
                      components={{
                        block: {
                          normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                          h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-600">
                    {defaultStoryContent.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-electric-blue font-semibold mt-6">
                  <Heart className="w-5 h-5" />
                  <span>{storyHighlight}</span>
                </div>
              </div>
              
              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  {statistics.map((stat, index) => (
                    <div key={index}>
                      <div className="text-4xl font-bold text-electric-blue">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {stat.label}
                        {stat.suffix && <span className="block text-xs">{stat.suffix}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Timeline Section */}
      {legacyTimeline.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Legacy</h2>
              <p className="text-lg text-gray-600 text-center mb-12">Three generations of HVAC excellence</p>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-electric-blue transform md:-translate-x-1/2" />
                
                {/* Timeline items */}
                <div className="space-y-12">
                  {legacyTimeline.map((item, index) => (
                    <div 
                      key={item._key || index} 
                      className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-electric-blue rounded-full border-4 border-white shadow transform -translate-x-1/2 z-10" />
                      
                      {/* Content card */}
                      <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                          <span className="inline-block bg-electric-blue text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                            {item.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          {item.person && (
                            <p className="text-electric-blue font-medium text-sm mb-2">{item.person}</p>
                          )}
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      
                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block md:w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brand Pillars / Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{valuesTitle}</h2>
            <p className="text-lg text-gray-600">{valuesSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {brandPillars.map((pillar, index) => {
              const IconComponent = iconMap[pillar.icon] || Shield
              
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="mx-auto bg-electric-blue rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{pillar.title}</CardTitle>
                    {pillar.tagline && (
                      <p className="text-electric-blue font-medium text-sm">{pillar.tagline}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {pillar.description}
                    </p>
                    {pillar.proofPoints && pillar.proofPoints.length > 0 && (
                      <ul className="text-left space-y-2 text-sm">
                        {pillar.proofPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-lime-green flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      {cityPages.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <Link href="/cities-served" className="hover:text-electric-blue transition-colors">
                  Proudly Serving the DFW Metroplex
                </Link>
              </h2>
              <p className="text-gray-600 mb-8">
                We provide expert HVAC service with integrity and care to homeowners and businesses throughout the Dallas-Fort Worth area.
              </p>
              <LinkedCityList cities={cityPages} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Card key={testimonial._id || index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">&ldquo;{testimonial.text}&rdquo;</p>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/reviews">Read All Reviews</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      {showContactForm && (
        <section className="py-16 bg-prussian-blue">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <LeadForm 
                title="Ready to Get Started?"
                description="Contact us today for expert HVAC service with integrity and care"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-vivid-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the DFW HVAC Difference</h2>
          <p className="text-xl mb-8 text-red-100">
            Expert service with integrity and care—that&apos;s our commitment to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-vivid-red hover:bg-gray-100 font-semibold"
              asChild
            >
              <a href="tel:+19727772665">
                <Phone className="w-5 h-5 mr-2" />
                Call {phone}
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-vivid-red font-semibold"
              asChild
            >
              <Link href="/contact">
                Schedule Service
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPageTemplate
