'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Phone, Mail, MessageSquare } from 'lucide-react'
import { submitLeadForm } from '../lib/mockData'
import { toast } from 'sonner'

const SimpleContactForm = ({ 
  title = "Send Us a Message", 
  description = "Fill out the form below and we'll get back to you within 24 hours",
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
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
        toast.success("Thank you! We'll get back to you within 24 hours.")
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0" data-testid="simple-contact-form">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-electric-blue" />
          {title}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactFirstName" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="contactFirstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="Your name"
                data-testid="contact-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Phone *
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
                placeholder="(555) 123-4567"
                data-testid="contact-phone-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-electric-blue focus:ring-electric-blue"
              placeholder="your@email.com"
              data-testid="contact-email-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactMessage" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="contactMessage"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
              rows={5}
              className="border-gray-300 focus:border-electric-blue focus:ring-electric-blue resize-none"
              placeholder="How can we help you?"
              data-testid="contact-message-input"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{background: 'linear-gradient(to right, #00B8FF, #003153)'}}
            data-testid="contact-submit-button"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            We'll get back to you within 24 hours
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default SimpleContactForm
