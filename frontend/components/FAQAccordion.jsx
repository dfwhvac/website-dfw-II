'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQAccordion = ({ faqs = [], categories = [] }) => {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  // Category display names and order
  const categoryConfig = {
    'residential-services': { name: 'Services', section: 'residential', order: 1 },
    'residential-pricing': { name: 'Pricing & Estimates', section: 'residential', order: 2 },
    'residential-scheduling': { name: 'Scheduling & Availability', section: 'residential', order: 3 },
    'residential-equipment': { name: 'Equipment & Systems', section: 'residential', order: 4 },
    'residential-maintenance': { name: 'Maintenance & Care', section: 'residential', order: 5 },
    'commercial': { name: 'Commercial HVAC', section: 'commercial', order: 6 },
  }

  // Separate residential and commercial
  const residentialCategories = Object.keys(groupedFaqs)
    .filter(cat => categoryConfig[cat]?.section === 'residential')
    .sort((a, b) => categoryConfig[a].order - categoryConfig[b].order)

  const commercialCategories = Object.keys(groupedFaqs)
    .filter(cat => categoryConfig[cat]?.section === 'commercial')
    .sort((a, b) => categoryConfig[a].order - categoryConfig[b].order)

  const renderCategory = (categoryKey) => {
    const config = categoryConfig[categoryKey] || { name: categoryKey }
    const items = groupedFaqs[categoryKey] || []

    if (items.length === 0) return null

    return (
      <div key={categoryKey} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {config.name}
        </h3>
        <div className="space-y-2">
          {items.map((faq, index) => {
            const itemId = faq._id || `${categoryKey}-${index}`
            const isOpen = openItems[itemId]

            return (
              <div 
                key={itemId}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(itemId)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Residential Section */}
      {residentialCategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-prussian-blue mb-6">
            Residential HVAC
          </h2>
          {residentialCategories.map(renderCategory)}
        </div>
      )}

      {/* Commercial Section */}
      {commercialCategories.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-prussian-blue mb-6">
            Commercial HVAC
          </h2>
          {commercialCategories.map(renderCategory)}
        </div>
      )}
    </div>
  )
}

export default FAQAccordion
