'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Phone, Mail, MapPin, Wrench } from 'lucide-react'
import { submitLeadForm } from '../lib/mockData'
import { toast } from 'sonner'

const LeadForm = ({ 
  title = "Request Service", 
  description = "Fill out the form and we'll call you within 2 business hours",
  buttonText = "Submit Request",
  successMessage = "Thank you! We'll call you within 2 business hours to discuss your needs.",
  trustSignals = "✓ Fast response • ✓ Licensed techs • ✓ Upfront pricing",
  footerText = null,
  showEstimateLink = true
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceAddress: '',
    numSystems: '',
    problemDescription: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitLeadForm(formData)
      if (result.success) {
        toast.success(successMessage)
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceAddress: '',
          numSystems: '',
          problemDescription: ''
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
          <Wrench className="w-6 h-6 text-electric-blue" />
          {title}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                <span>First Name *</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Service Address */}
          <div className="space-y-2">
            <Label htmlFor="serviceAddress" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Service Address *
            </Label>
            <Input
              id="serviceAddress"
              type="text"
              value={formData.serviceAddress}
              onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
              placeholder="123 Main St, Dallas, TX 75201"
            />
          </div>

          {/* Number of Systems */}
          <div className="space-y-2">
            <Label htmlFor="numSystems" className="text-sm font-medium">
              Number of HVAC Systems *
            </Label>
            <Select onValueChange={(value) => handleInputChange('numSystems', value)}>
              <SelectTrigger className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue">
                <SelectValue placeholder="Select number of systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 System</SelectItem>
                <SelectItem value="2">2 Systems</SelectItem>
                <SelectItem value="3">3 Systems</SelectItem>
                <SelectItem value="4+">4+ Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <Label htmlFor="problemDescription" className="text-sm font-medium">
              Description of Problem or Service Needed *
            </Label>
            <Textarea
              id="problemDescription"
              value={formData.problemDescription}
              onChange={(e) => handleInputChange('problemDescription', e.target.value)}
              required
              rows={4}
              className="border-gray-300 focus:border-electric-blue focus:ring-electric-blue resize-none"
              placeholder="Please describe the issue you're experiencing or the service you need..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{background: 'linear-gradient(to right, #00B8FF, #003153)', '--hover-bg': 'linear-gradient(to right, #003153, #00B8FF)'}}
          >
            {isSubmitting ? "Submitting..." : buttonText}
          </Button>

          {/* Trust Signals */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>{trustSignals}</p>
            {footerText && <p className="text-xs">{footerText}</p>}
            {showEstimateLink && (
              <p className="text-xs pt-2 border-t border-gray-100">
                Need a system replacement? <Link href="/estimate" className="text-electric-blue hover:underline font-medium">Get a Free Estimate →</Link>
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default LeadForm