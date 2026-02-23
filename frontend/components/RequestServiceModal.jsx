'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
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
import { Phone, Wrench, CheckCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// Context for managing modal state across the app
const ModalContext = createContext(null)

export function RequestServiceModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [leadType, setLeadType] = useState('service')

  const openModal = (type = 'service') => {
    setLeadType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, leadType }}>
      {children}
      <RequestServiceModal />
    </ModalContext.Provider>
  )
}

export function useRequestServiceModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useRequestServiceModal must be used within RequestServiceModalProvider')
  }
  return context
}

// Standalone trigger button component
export function RequestServiceButton({ 
  children = 'Request Service', 
  className = '',
  variant = 'default',
  size = 'default',
  leadType = 'service',
  ...props 
}) {
  const { openModal } = useRequestServiceModal()
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openModal(leadType)}
      data-testid="request-service-btn"
      {...props}
    >
      {children}
    </Button>
  )
}

// The actual modal component
function RequestServiceModal() {
  const { isOpen, closeModal, leadType } = useRequestServiceModal()
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

  const resetForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || ''
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadType: leadType
        })
      })

      if (response.ok) {
        toast.success("Thank you! We'll call you within 2 business hours.", {
          duration: 5000,
        })
        resetForm()
        closeModal()
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Something went wrong. Please call us directly.', {
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    switch (leadType) {
      case 'estimate':
        return 'Get a Free Estimate'
      case 'contact':
        return 'Contact Us'
      default:
        return 'Request Service'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003153] to-[#00B8FF] text-white p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
              <Wrench className="w-6 h-6" />
              {getTitle()}
            </DialogTitle>
          </DialogHeader>
          <p className="text-blue-100 mt-2 text-sm">
            Fill out the form and we'll call you within 2 business hours
          </p>
          
          {/* Quick call option */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-blue-200">Need faster service?</span>
            <a 
              href="tel:+19727772665" 
              className="inline-flex items-center gap-1 text-white font-semibold hover:underline"
            >
              <Phone className="w-4 h-4" />
              Call (972) 777-COOL
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modal-firstName">First Name *</Label>
              <Input 
                id="modal-firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                data-testid="modal-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-lastName">Last Name *</Label>
              <Input 
                id="modal-lastName"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                data-testid="modal-last-name"
              />
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modal-email">Email *</Label>
              <Input 
                id="modal-email"
                type="email"
                placeholder="john@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                data-testid="modal-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-phone">Phone *</Label>
              <Input 
                id="modal-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                data-testid="modal-phone"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="modal-address">Service Address *</Label>
            <Input 
              id="modal-address"
              placeholder="123 Main St, Dallas, TX 75201"
              value={formData.serviceAddress}
              onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
              required
              data-testid="modal-address"
            />
          </div>

          {/* Number of Systems */}
          <div className="space-y-2">
            <Label htmlFor="modal-systems">Number of HVAC Systems</Label>
            <Select 
              value={formData.numSystems} 
              onValueChange={(value) => handleInputChange('numSystems', value)}
            >
              <SelectTrigger id="modal-systems" data-testid="modal-systems">
                <SelectValue placeholder="Select number of systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 System</SelectItem>
                <SelectItem value="2">2 Systems</SelectItem>
                <SelectItem value="3">3 Systems</SelectItem>
                <SelectItem value="4+">4+ Systems</SelectItem>
                <SelectItem value="not-sure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <Label htmlFor="modal-problem">How can we help? (Optional)</Label>
            <Textarea 
              id="modal-problem"
              placeholder="Describe your HVAC issue or what service you need..."
              value={formData.problemDescription}
              onChange={(e) => handleInputChange('problemDescription', e.target.value)}
              rows={3}
              data-testid="modal-problem"
            />
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Fast response
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Licensed techs
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Upfront pricing
            </span>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-[#FF0000] hover:bg-red-700 text-white font-semibold py-3 h-auto text-lg"
            disabled={isSubmitting}
            data-testid="modal-submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>

          {/* Estimate link */}
          {leadType === 'service' && (
            <p className="text-center text-sm text-gray-500">
              Need a new system? {' '}
              <Link 
                href="/estimate" 
                className="text-[#00B8FF] hover:underline font-medium"
                onClick={closeModal}
              >
                Get a Free Estimate →
              </Link>
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RequestServiceModal
