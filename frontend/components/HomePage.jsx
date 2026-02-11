'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import LeadForm from './LeadForm'
import TestimonialCarousel from './TestimonialCarousel'
import { 
  Phone, 
  Shield, 
  Clock, 
  Star, 
  Snowflake, 
  Flame, 
  Wind, 
  Wrench, 
  Building,
  CheckCircle,
  TrendingUp,
  Award,
  Handshake
} from 'lucide-react'
import { companyInfo as defaultCompanyInfo, services as defaultServices, testimonials as defaultTestimonials } from '../lib/mockData'

const HomePage = ({ 
  companyInfo = defaultCompanyInfo, 
  services = defaultServices, 
  testimonials = defaultTestimonials,
  homepage = null,
  siteSettings = null 
}) => {
  // Use Sanity content with fallbacks
  const hero = {
    badge: homepage?.heroBadge || 'Three Generations of Trust',
    title: homepage?.heroTitle || "Dallas-Fort Worth's",
    highlight: homepage?.heroTitleHighlight || 'Trusted HVAC',
    line3: homepage?.heroTitleLine3 || 'Experts',
    description: homepage?.heroDescription || 'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship throughout Dallas-Fort Worth.',
    primaryButton: homepage?.heroPrimaryButton || { text: 'Call (972) 777-COOL', href: 'tel:+19727772665' },
    secondaryButton: homepage?.heroSecondaryButton || { text: 'Get Free Estimate', href: '/estimate' },
  }
  
  // Lead form settings from siteSettings
  const leadForm = {
    title: siteSettings?.leadFormTitle || 'Get Your Free Estimate',
    description: siteSettings?.leadFormDescription || "Fill out the form below and we'll contact you within 24 hours",
    buttonText: siteSettings?.leadFormButtonText || 'Get My Free Estimate',
    successMessage: siteSettings?.leadFormSuccessMessage || "Thank you! We'll contact you within 24 hours.",
    trustSignals: siteSettings?.leadFormTrustSignals || '✓ Free estimates • ✓ Licensed & insured • ✓ Fast response time',
    footerText: siteSettings?.leadFormFooterText || "We'll contact you within 24 hours to schedule your appointment",
  }
  
  const servicesSection = {
    title: homepage?.servicesTitle || 'Complete HVAC Solutions',
    description: homepage?.servicesDescription || 'From repairs to new system installations, we provide comprehensive residential and commercial HVAC services throughout the Dallas-Fort Worth area.',
  }
  
  const whyUs = {
    title: homepage?.whyUsTitle || 'Why Dallas-Fort Worth Trusts DFW HVAC',
    subtitle: homepage?.whyUsSubtitle || 'Expert service with integrity and care',
    items: homepage?.whyUsItems || [
      { title: 'Three-Generation Legacy', description: 'A family commitment to HVAC excellence since 1972', icon: 'years' },
      { title: 'Licensed & Insured', description: 'Fully licensed technicians you can trust', icon: 'shield' },
      { title: 'Fast Response', description: 'Quick, reliable service when you need it', icon: 'clock' },
      { title: 'Guaranteed Work', description: 'Quality workmanship backed by comprehensive warranties', icon: 'trending' },
    ],
  }
  
  const testimonialsSection = {
    title: homepage?.testimonialsTitle || 'What Our Customers Say',
    subtitle: homepage?.testimonialsSubtitle || 'Real reviews from verified Google customers',
    maxDisplay: homepage?.maxTestimonials || 12,
  }
  
  const cta = {
    title: homepage?.ctaTitle || 'Ready to Get Started?',
    description: homepage?.ctaDescription || 'Contact DFW HVAC today for expert service with integrity and care.',
  }

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-prussian-blue px-4 py-2 rounded-full text-sm font-medium border border-prussian-blue">
                  <Award className="w-4 h-4" />
                  {hero.badge}
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {hero.title}
                  <span className="text-electric-blue block">{hero.highlight}</span>
                  {hero.line3}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {hero.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-vivid-red hover:bg-vivid-red text-white font-semibold px-8 py-4 text-lg h-auto"
                  asChild
                >
                  <a href={hero.primaryButton.href}>
                    <Phone className="w-5 h-5 mr-2" />
                    {hero.primaryButton.text}
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white font-semibold px-8 py-4 text-lg h-auto"
                  asChild
                >
                  <Link href={hero.secondaryButton.href}>
                    {hero.secondaryButton.text}
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{companyInfo.googleRating} Stars · {companyInfo.googleReviews} Reviews</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-prussian-blue mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Licensed & Insured</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-lime-green mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Fast Service</p>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="lg:pl-8">
              <LeadForm 
                title={leadForm.title}
                description={leadForm.description}
                buttonText={leadForm.buttonText}
                successMessage={leadForm.successMessage}
                trustSignals={leadForm.trustSignals}
                footerText={leadForm.footerText}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {servicesSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {servicesSection.description}
            </p>
          </div>

          {/* Residential Services */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Residential Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.residential.slice(0, 3).map((service) => {
                const IconComponent = {
                  snowflake: Snowflake,
                  flame: Flame,
                  wrench: Wrench,
                  wind: Wind,
                  gauge: Clock
                }[service.icon] || Wrench

                return (
                  <Card key={service.id || service._id || service.title} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors border border-electric-blue">
                        <IconComponent className="w-8 h-8 text-electric-blue" />
                      </div>
                      <CardTitle className="text-xl">{service.name || service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="mb-4 text-gray-600">
                        {service.description}
                      </CardDescription>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-lime-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/services/residential/${service.slug?.current || service.slug || (service.name || service.title || '').toLowerCase().replace(/\s+/g, '-')}`}>
                          Learn More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Commercial Services */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Commercial Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.commercial.slice(0, 3).map((service) => {
                const IconComponent = {
                  building: Building,
                  factory: Building,
                  'clipboard-check': CheckCircle,
                  'air-vent': Wind,
                  computer: Clock
                }[service.icon] || Building

                return (
                  <Card key={service.id || service._id || service.title} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors border border-prussian-blue">
                        <IconComponent className="w-8 h-8 text-prussian-blue" />
                      </div>
                      <CardTitle className="text-xl">{service.name || service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="mb-4 text-gray-600">
                        {service.description}
                      </CardDescription>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-lime-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/services/commercial/${service.slug?.current || service.slug || (service.name || service.title || '').toLowerCase().replace(/\s+/g, '-')}`}>
                          Learn More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-electric-blue hover:bg-electric-blue text-white" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {whyUs.title}
            </h2>
            <p className="text-xl text-gray-600">
              {whyUs.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.items.map((item, index) => {
              const iconColors = ['bg-prussian-blue', 'bg-lime-green', 'bg-vivid-red', 'bg-electric-blue']
              const IconComponent = {
                years: () => <span className="text-2xl font-bold">50+</span>,
                shield: Shield,
                clock: Clock,
                trending: TrendingUp,
                handshake: Handshake,
              }[item.icon] || Shield
              
              return (
                <div key={item._key || index} className="text-center">
                  <div className={`w-16 h-16 ${iconColors[index % 4]} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {item.icon === 'years' ? <span className="text-2xl font-bold">50+</span> : <IconComponent className="w-8 h-8" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {testimonialsSection.title}
            </h2>
            <p className="text-xl text-gray-600">
              {testimonialsSection.subtitle}
            </p>
            
            {/* Google Reviews Badge */}
            <div className="flex items-center justify-center gap-4 mt-8 p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                <div className="text-3xl font-bold text-gray-900">{companyInfo.googleRating}</div>
                <div className="text-sm text-gray-600">Google Rating</div>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <div className="text-3xl font-bold text-electric-blue">{companyInfo.googleReviews}</div>
                <div className="text-sm text-gray-600">Customer Reviews</div>
              </div>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-6xl mx-auto px-8">
            <TestimonialCarousel testimonials={testimonials} maxDisplay={testimonialsSection.maxDisplay} />
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/reviews">Read All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{background: 'linear-gradient(to right, #003153, #00B8FF)'}}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {cta.title}
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            {cta.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-vivid-red hover:bg-vivid-red text-white font-semibold px-8 py-4 text-lg h-auto"
              asChild
            >
              <a href="tel:+19727772665">
                <Phone className="w-5 h-5 mr-2" />
                Call (972) 777-COOL
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white font-semibold px-8 py-4 text-lg h-auto"
              style={{"--hover-text-color": "#003153"}}
              asChild
            >
              <Link href="/contact">
                Get Free Estimate
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage