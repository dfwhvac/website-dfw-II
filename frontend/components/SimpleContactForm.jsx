'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Phone, Mail, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { loadRecaptchaOnce } from './RecaptchaScript'

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
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10)
      let formatted = ''
      if (digits.length > 0) formatted = '(' + digits.slice(0, 3)
      if (digits.length >= 3) formatted += ') '
      if (digits.length > 3) formatted += digits.slice(3, 6)
      if (digits.length >= 6) formatted += '-'
      if (digits.length > 6) formatted += digits.slice(6, 10)
      setFormData(prev => ({ ...prev, phone: formatted }))
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get reCAPTCHA token
      let recaptchaToken = ''
      try {
        if (window.grecaptcha) {
          recaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: 'submit_contact' }
          )
        }
      } catch (recaptchaError) {
        console.warn('reCAPTCHA unavailable, proceeding without token')
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName || '',
          email: formData.email,
          phone: formData.phone,
          serviceAddress: '',
          numSystems: '',
          problemDescription: formData.message,
          leadType: 'contact',
          recaptchaToken,
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // GA4 conversion event — track form submission as lead
        // Added Apr 21, 2026 (PR #2, P1.7) for 70+ day baseline before Google Ads launch
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'form_submit_lead', {
              form_name: 'contact_form',
              lead_type: 'contact',
              page_path: window.location.pathname,
            })
          }
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('form_submit_lead tracking failed:', err)
          }
        }

        toast.success("Thank you! We'll get back to you within 24 hours.")
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        toast.error(result.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
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
        <form onSubmit={handleSubmit} onFocus={loadRecaptchaOnce} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactFirstName" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="contactFirstName"
                type="text"
                autoComplete="name"
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
                inputMode="tel"
                autoComplete="tel"
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
              inputMode="email"
              autoComplete="email"
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
            className="w-full h-12 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-electric-blue to-prussian-blue"
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
