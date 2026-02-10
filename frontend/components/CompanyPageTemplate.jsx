'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import LeadForm from './LeadForm'
import LinkedCityList from './LinkedCityList'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star,
  Shield,
  Award,
  Users,
  CheckCircle,
  Heart
} from 'lucide-react'

const CompanyPageTemplate = ({ 
  page, 
  companyInfo = {}, 
  testimonials = [],
  cityPages = []
}) => {
  const phone = companyInfo?.phone || '(972) 777-COOL'
  const email = companyInfo?.email || 'info@dfwhvac.com'
  const address = companyInfo?.address || '556 S Coppell Rd Ste 103, Coppell, TX 75019'
  const googleReviews = companyInfo?.googleReviews || 129
  const businessHours = companyInfo?.businessHours || {}
  // Use cityPages if available, otherwise fall back to serviceAreas from companyInfo
  const serviceAreas = cityPages.length > 0 ? cityPages : (companyInfo?.serviceAreas || [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {page.heroTitle || page.title}
            </h1>
            {page.heroSubtitle && (
              <p className="text-xl lg:text-2xl text-blue-200 mb-6">
                {page.heroSubtitle}
              </p>
            )}
            {page.heroDescription && (
              <p className="text-lg text-blue-100 mb-8">
                {page.heroDescription}
              </p>
            )}
            
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
                <span>5.0 Rating • {googleReviews} Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content (for About page type) */}
      {page.pageType === 'about' && (
        <>
          {/* Our Story Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                    <p className="text-gray-600 mb-4">
                      DFW HVAC was founded in 2020 as the natural evolution of a three-generation family 
                      commitment to trustworthy, high-quality HVAC service in the Dallas–Fort Worth Metroplex.
                    </p>
                    <p className="text-gray-600 mb-4">
                      This commitment began in 1972 when Garland Nevil started A-1 Air Conditioning & Heating. 
                      It continued through his son, Ronny Grubb, who spent over 50 years building Alpine 
                      Heating & Air Conditioning on honest assessments, fair pricing, and meticulous workmanship.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Today, we combine our family's hard-earned technical expertise with modern systems, 
                      training, and processes—delivering expert service with integrity and care.
                    </p>
                    <div className="flex items-center gap-2 text-electric-blue font-semibold">
                      <Heart className="w-5 h-5" />
                      <span>Three-Generation Family Legacy</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-8">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-4xl font-bold text-electric-blue">50+</div>
                        <div className="text-gray-600">Years of Family Legacy</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-electric-blue">{googleReviews}+</div>
                        <div className="text-gray-600">5-Star Reviews</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-electric-blue">3</div>
                        <div className="text-gray-600">Generations Strong</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-electric-blue">Same-Day</div>
                        <div className="text-gray-600">Service Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto bg-electric-blue rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle>Trust</CardTitle>
                    <p className="text-electric-blue text-sm font-medium">Honest, Transparent, Ethical</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      We provide honest assessments and fair pricing. No hidden fees, no unnecessary repairs—just straightforward service.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto bg-electric-blue rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle>Excellence</CardTitle>
                    <p className="text-electric-blue text-sm font-medium">Skilled, Professional, Safe</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Our technicians are fully licensed, trained, and committed to delivering top-quality workmanship.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <div className="mx-auto bg-electric-blue rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle>Care</CardTitle>
                    <p className="text-electric-blue text-sm font-medium">Attentive, Consultative, Convenient</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      We treat every customer like family, ensuring a seamless and satisfying experience from start to finish.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Contact Content (for Contact page type) */}
      {page.pageType === 'contact' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-electric-blue rounded-full p-3">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">{phone}</p>
                      <p className="text-sm text-gray-500">Same-day service M-Sat</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-electric-blue rounded-full p-3">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{email}</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-electric-blue rounded-full p-3">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-electric-blue rounded-full p-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <div className="text-gray-600 text-sm">
                        <p>Monday - Friday: {businessHours.monday || '7AM-7PM'}</p>
                        <p>Saturday: {businessHours.saturday || '8AM-1PM'}</p>
                        <p>Sunday: {businessHours.sunday || 'Closed'}</p>
                        <p className="text-vivid-red font-medium mt-1">Same-Day Service Available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                {serviceAreas.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      <Link href="/cities-served" className="hover:text-[#00B8FF]">
                        Service Areas
                      </Link>
                    </h3>
                    {cityPages.length > 0 ? (
                      <LinkedCityList cities={cityPages} />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {serviceAreas.map((area, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div>
                <LeadForm 
                  title="Send Us a Message"
                  description="Fill out the form below and we'll get back to you within 24 hours"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Content (for Reviews page type) */}
      {page.pageType === 'reviews' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Rating Summary */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-900">5.0 out of 5</p>
                <p className="text-gray-600">Based on {googleReviews} Google Reviews</p>
              </div>

              {/* Testimonials Grid */}
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={testimonial._id || index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 text-lg">"{testimonial.text}"</p>
                      <div className="flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-electric-blue font-medium">{testimonial.service}</p>
                          {testimonial.timeAgo && (
                            <p className="text-xs text-gray-400">{testimonial.timeAgo}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Google Review CTA */}
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Love our service? Leave us a review!</p>
                <Button 
                  className="bg-electric-blue hover:bg-prussian-blue"
                  asChild
                >
                  <a 
                    href="https://g.page/r/CcumMADJhchIEB0/review" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Write a Google Review
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Content Sections */}
      {page.sections && page.sections.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {page.sections.map((section, index) => (
                <div key={index}>
                  {section.sectionTitle && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.sectionTitle}</h2>
                  )}
                  {section.sectionContent && (
                    <p className="text-gray-600 mb-4">{section.sectionContent}</p>
                  )}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-2">
                      {section.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-electric-blue flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Show Testimonials if enabled */}
      {page.showTestimonials && testimonials.length > 0 && page.pageType !== 'reviews' && (
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
                    <p className="text-gray-600 mb-4 text-sm">"{testimonial.text}"</p>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Show Contact Form if enabled */}
      {page.showContactForm && page.pageType !== 'contact' && (
        <section className="py-16 bg-prussian-blue">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <LeadForm 
                title="Ready to Get Started?"
                description="Contact us today for a free estimate"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-vivid-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the DFW HVAC Difference?</h2>
          <p className="text-xl mb-8 text-red-100">
            Call us today for fast, reliable HVAC service
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
              <Link href="/book-service">
                Schedule Online
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CompanyPageTemplate
