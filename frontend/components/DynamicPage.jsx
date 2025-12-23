'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, MapPin, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import LeadForm from './LeadForm'
import TestimonialCarousel from './TestimonialCarousel'

// Portable Text renderer for rich content
const PortableText = ({ value }) => {
  if (!value) return null
  
  return (
    <div className="prose prose-lg max-w-none">
      {value.map((block, index) => {
        if (block._type === 'block') {
          const Tag = block.style === 'h2' ? 'h2' : 
                      block.style === 'h3' ? 'h3' : 
                      block.style === 'blockquote' ? 'blockquote' : 'p'
          
          const className = block.style === 'h2' ? 'text-2xl font-bold mt-8 mb-4' :
                           block.style === 'h3' ? 'text-xl font-semibold mt-6 mb-3' :
                           block.style === 'blockquote' ? 'border-l-4 border-electric-blue pl-4 italic my-4' :
                           'mb-4'
          
          return (
            <Tag key={index} className={className}>
              {block.children?.map((child, childIndex) => {
                let content = child.text
                if (child.marks?.includes('strong')) {
                  content = <strong key={childIndex}>{content}</strong>
                }
                if (child.marks?.includes('em')) {
                  content = <em key={childIndex}>{content}</em>
                }
                return content
              })}
            </Tag>
          )
        }
        return null
      })}
    </div>
  )
}

const DynamicPage = ({ page, companyInfo, testimonials = [] }) => {
  const {
    title,
    pageType,
    heroTitle,
    heroSubtitle,
    heroDescription,
    heroCta,
    sections,
    teamMembers,
    serviceAreasList,
    financingOptions,
    caseStudies,
    showContactForm,
    showTestimonials,
    showCtaBanner,
  } = page

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {heroTitle || title}
            </h1>
            {heroSubtitle && (
              <p className="text-xl text-electric-blue font-semibold mb-4">
                {heroSubtitle}
              </p>
            )}
            {heroDescription && (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {heroDescription}
              </p>
            )}
            {heroCta?.text && heroCta?.href && (
              <Button size="lg" className="bg-electric-blue hover:bg-prussian-blue" asChild>
                <Link href={heroCta.href}>
                  {heroCta.text}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {sections && sections.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  {section.sectionTitle && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      {section.sectionTitle}
                    </h2>
                  )}
                  
                  {section.sectionContent && (
                    <PortableText value={section.sectionContent} />
                  )}
                  
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-3 mt-6">
                      {section.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-lime-green mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
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

      {/* Team Members (for About page) */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-20 h-20 bg-electric-blue rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {member.name?.charAt(0)}
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-electric-blue font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  {member.bio && (
                    <CardContent>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas (for Cities Served page) */}
      {serviceAreasList && serviceAreasList.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Areas We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {serviceAreasList.map((area, index) => (
                <div key={index} className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-electric-blue flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{area.city}</p>
                    {area.description && (
                      <p className="text-sm text-gray-500">{area.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Financing Options (for Financing page) */}
      {financingOptions && financingOptions.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Financing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {financingOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{option.title}</CardTitle>
                    {option.terms && (
                      <CardDescription className="text-electric-blue font-medium">
                        {option.terms}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {option.description && (
                    <CardContent>
                      <p className="text-gray-600">{option.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      {caseStudies && caseStudies.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Case Studies</h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              {caseStudies.map((study, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-prussian-blue to-electric-blue text-white">
                    <CardTitle>{study.title}</CardTitle>
                    {study.client && (
                      <CardDescription className="text-white/80">
                        {study.client}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {study.challenge && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                          <p className="text-gray-600 text-sm">{study.challenge}</p>
                        </div>
                      )}
                      {study.solution && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                          <p className="text-gray-600 text-sm">{study.solution}</p>
                        </div>
                      )}
                      {study.result && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Result</h4>
                          <p className="text-gray-600 text-sm">{study.result}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      {showContactForm && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
              <LeadForm />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="max-w-6xl mx-auto px-8">
              <TestimonialCarousel testimonials={testimonials} maxDisplay={12} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      {showCtaBanner !== false && (
        <section className="py-20" style={{ background: 'linear-gradient(to right, #003153, #00B8FF)' }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Contact DFW HVAC today for your free estimate. Professional HVAC service when you need it.
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
                className="border-2 border-white text-white hover:bg-white hover:text-prussian-blue font-semibold px-8 py-4 text-lg h-auto"
                asChild
              >
                <Link href="/contact">
                  Get Free Estimate
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default DynamicPage
