'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

const TestimonialCarousel = ({ testimonials = [], maxDisplay = 12 }) => {
  const displayTestimonials = testimonials.slice(0, maxDisplay)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      }
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (displayTestimonials.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {displayTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial._id || testimonial.id || index} 
              className="flex-none w-full md:w-1/2 lg:w-1/3 pl-4"
            >
              <Card className="h-full shadow-lg border-0 bg-white">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-600 mb-4 italic flex-grow line-clamp-4">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Customer Info */}
                  <div className="border-t pt-4 mt-auto">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    {testimonial.location && (
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    )}
                    {testimonial.service && (
                      <div className="text-sm text-electric-blue font-medium">{testimonial.service}</div>
                    )}
                    {testimonial.timeAgo && (
                      <div className="text-xs text-gray-400 mt-1">{testimonial.timeAgo}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:bg-gray-50 hidden md:flex"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:bg-gray-50 hidden md:flex"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {displayTestimonials.slice(0, Math.ceil(displayTestimonials.length / 3)).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(selectedIndex / 3) === index ? 'bg-electric-blue' : 'bg-gray-300'
            }`}
            onClick={() => emblaApi?.scrollTo(index * 3)}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCarousel
