'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

const REVIEWS_PER_PAGE = 10

const ReviewsGrid = ({ testimonials = [], googleReviews = 130 }) => {
  const [displayCount, setDisplayCount] = useState(REVIEWS_PER_PAGE)
  
  // Filter out reviews with blank text
  const filteredTestimonials = testimonials.filter(t => t.text && t.text.trim() !== '')
  const displayedTestimonials = filteredTestimonials.slice(0, displayCount)
  const hasMore = displayCount < filteredTestimonials.length
  
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + REVIEWS_PER_PAGE, filteredTestimonials.length))
  }

  return (
    <div className="py-16">
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
            {filteredTestimonials.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {displayedTestimonials.length} of {filteredTestimonials.length} reviews with text
              </p>
            )}
          </div>

          {/* Testimonials List */}
          <div className="space-y-6">
            {displayedTestimonials.map((testimonial, index) => (
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
                    </div>
                    <div className="text-right">
                      {testimonial.services && (
                        <p className="text-sm text-electric-blue font-medium">{testimonial.services}</p>
                      )}
                      {testimonial.date && (
                        <p className="text-xs text-gray-400">{testimonial.date}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={loadMore}
              >
                Load More Reviews ({filteredTestimonials.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewsGrid
