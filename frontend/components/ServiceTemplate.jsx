'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import LeadForm from './LeadForm'
import { 
  Phone, 
  CheckCircle, 
  Star,
  Snowflake,
  Flame,
  Wrench,
  Wind,
  Clock,
  Shield,
  Award,
  ArrowRight,
  Building
} from 'lucide-react'

const ServiceTemplate = ({ service, companyInfo = {}, testimonials = [] }) => {
  const phone = companyInfo?.phone || '(972) 777-COOL'
  const googleReviews = companyInfo?.googleReviews || 129
  
  const getIconComponent = (iconName) => {
    const icons = {
      snowflake: Snowflake,
      flame: Flame, 
      wrench: Wrench,
      wind: Wind,
      clock: Clock,
      building: Building
    }
    return icons[iconName] || Wrench
  }

  const IconComponent = getIconComponent(service.icon)

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Service Hero Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {service.heroContent.title}
                  </h1>
                  <p className="text-xl text-electric-blue font-semibold mt-2">
                    {service.heroContent.subtitle}
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {service.heroContent.description}
              </p>

              {/* Key Benefits */}
              <div className="space-y-3">
                {service.heroContent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-lime-green mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg" 
                  className="bg-vivid-red hover:bg-vivid-red text-white font-semibold px-8 py-4 text-lg h-auto"
                  asChild
                >
                  <a href="tel:+19727772665">
                    <Phone className="w-5 h-5 mr-2" />
                    Call {phone}
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white font-semibold px-8 py-4 text-lg h-auto"
                  asChild
                >
                  <Link href="/estimate">
                    Get Free Estimate
                  </Link>
                </Button>
              </div>
            </div>

            {/* Service Image/Illustration Placeholder */}
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-electric-blue to-prussian-blue rounded-2xl p-8 text-white text-center">
                <IconComponent className="w-24 h-24 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Professional Service</h3>
                <p className="text-lg opacity-90">Licensed & Insured Technicians</p>
                <div className="mt-6 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                  <span className="ml-2 font-semibold">5.0 Rating • {googleReviews}+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* What We Do & Our Process */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-electric-blue" />
                    {service.sections.whatWeDo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.sections.whatWeDo.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 text-electric-blue mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Clock className="w-6 h-6 text-electric-blue" />
                    {service.sections.ourProcess.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.sections.ourProcess.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 bg-electric-blue text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose Us & Emergency Service */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Award className="w-6 h-6 text-electric-blue" />
                    {service.sections.whyChooseUs.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.sections.whyChooseUs.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-lime-green mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-r from-vivid-red to-red-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3 text-white">
                    <Phone className="w-6 h-6" />
                    {service.sections.emergencyService.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">{service.sections.emergencyService.description}</p>
                  <ul className="space-y-2">
                    {service.sections.emergencyService.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-4 h-4 text-lime-green" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    size="lg" 
                    className="mt-6 bg-white text-vivid-red hover:bg-gray-100 font-semibold"
                    asChild
                  >
                    <a href="tel:+19727772665">
                      Call {phone} Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Pricing</h2>
            <p className="text-lg text-gray-600">Transparent, upfront pricing with no hidden fees</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(service.pricing).map(([key, pricing]) => (
              <Card key={key} className="shadow-lg border-0 text-center hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{pricing.title}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-electric-blue">
                    {pricing.startingPrice}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {pricing.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-lime-green flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" onClick={() => { if (typeof window !== 'undefined' && window.HCPWidget) window.HCPWidget.openModal() }}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      {testimonials.length > 0 && (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Testimonials</h2>
            <p className="text-lg text-gray-600">Real reviews from satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <Card key={testimonial._id || testimonial.id || index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <div className="text-sm text-electric-blue font-medium">{testimonial.service}</div>
                    {testimonial.timeAgo && (
                      <div className="text-xs text-gray-500 mt-1">{testimonial.timeAgo}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Common questions about our {service.title.toLowerCase()} services</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {service.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border-0 shadow-md">
                  <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{background: 'linear-gradient(to right, #003153, #00B8FF)'}}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Professional {service.title}?
          </h2>
          <p className="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Contact DFW HVAC today for expert service with integrity and care.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-vivid-red hover:bg-vivid-red text-white font-semibold px-8 py-4 text-lg h-auto"
              asChild
            >
              <a href="tel:+19727772665">
                <Phone className="w-5 h-5 mr-2" />
                Call {phone}
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-prussian-blue font-semibold px-8 py-4 text-lg h-auto"
              asChild
            >
              <Link href="/estimate">
                Get Free Estimate
              </Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8 pt-8 border-t border-blue-400">
            <div className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5" />
              <span>Three-Generation Legacy</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 fill-current text-yellow-400" />
              <span>5.0 Google Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <LeadForm 
              title={`Schedule Your ${service.title} Service`}
              description="Fill out the form below and we'll contact you within 24 hours to schedule your appointment"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceTemplate