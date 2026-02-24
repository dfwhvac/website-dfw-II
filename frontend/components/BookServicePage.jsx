'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import LeadForm from './LeadForm'
import { 
  Phone, 
  Clock, 
  Shield, 
  Wrench,
  Snowflake,
  Flame,
  Settings,
  AlertCircle,
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const BookServicePage = () => {
  const serviceTypes = [
    {
      icon: AlertCircle,
      title: "Priority Service",
      description: "Fast repairs for heating and cooling systems",
      color: "red",
      urgent: true
    },
    {
      icon: Snowflake,
      title: "Air Conditioning",
      description: "AC repair, maintenance, and installation services",
      color: "cyan",
      urgent: false
    },
    {
      icon: Flame,
      title: "Heating Systems",
      description: "Furnace repair, heat pump service, and installation",
      color: "orange",
      urgent: false
    },
    {
      icon: Settings,
      title: "Maintenance",
      description: "Preventive maintenance and system tune-ups",
      color: "green",
      urgent: false
    }
  ]

  // Major cities for the condensed list (matching Cities Served page)
  const majorCities = [
    "Dallas", "Fort Worth", "Arlington", "Plano", "Irving", "Frisco",
    "Carrollton", "Richardson", "Lewisville", "Grapevine", "Southlake", "Coppell"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Get Your Free HVAC Estimate
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            Request a free estimate from Dallas-Fort Worth's most trusted 
            heating and cooling experts. Honest assessments, transparent pricing.
          </p>
          <div className="flex items-center justify-center gap-2 text-[#00B8FF]">
            <Phone className="w-5 h-5" />
            <span className="text-lg">Need immediate service?</span>
            <a href="tel:+19727772665" className="text-white font-bold hover:underline">
              Call (972) 777-COOL
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Estimate Request Form */}
          <div>
            <LeadForm 
              title="Request Your Free Estimate"
              description="Fill out the form below and we'll contact you within 24 hours to schedule your free estimate."
              leadType="estimate"
              successMessage="Thank you! We'll contact you within 24 hours to schedule your free estimate."
              showEstimateLink={false}
            />
          </div>

          {/* Service Information */}
          <div className="space-y-6">
            
            {/* Service Types */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-[#003153]">Our Services</CardTitle>
                <CardDescription>
                  Professional HVAC services for all your heating and cooling needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceTypes.map((service, index) => {
                  const IconComponent = service.icon
                  const colorClasses = {
                    red: "bg-red-100 text-[#FF0000]",
                    cyan: "bg-cyan-100 text-[#00B8FF]", 
                    orange: "bg-orange-100 text-orange-600",
                    green: "bg-green-100 text-green-600"
                  }

                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[service.color]}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-[#003153]">{service.title}</h3>
                          {service.urgent && (
                            <span className="bg-red-100 text-[#FF0000] text-xs px-2 py-1 rounded-full font-medium">
                              FAST
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Service Guarantees */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-[#003153]">Why Choose DFW HVAC?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Three Generations</strong> of trusted family service
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#00B8FF] flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Fast Response</strong> — Contact within 24 hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#003153] flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Licensed & Insured</strong> — Fully certified technicians
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Honest Assessments</strong> — Transparent, upfront pricing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-[#003153] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00B8FF]" />
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We proudly serve the Dallas-Fort Worth metroplex, including:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-4">
                  {majorCities.map((city, index) => (
                    <div key={index} className="text-gray-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#00B8FF] flex-shrink-0" />
                      {city}
                    </div>
                  ))}
                </div>
                <Link 
                  href="/cities-served"
                  className="inline-flex items-center gap-2 text-[#00B8FF] hover:text-[#003153] font-medium transition-colors"
                >
                  View all cities we serve
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default BookServicePage
