// Mock data for DFW HVAC website

export const companyInfo = {
  name: "DFW HVAC",
  tagline: "Family Owned Since 1974",
  phone: "(972) 777-COOL",
  phoneDisplay: "(972) 777-2665",
  realPhone: "(817) 242-6688",
  email: "info@dfwhvac.com",
  address: "556 S Coppell Rd Ste 103, Coppell, TX 75019",
  serviceAddress: "Dallas-Fort Worth & Surrounding Areas",
  established: "1974",
  description: "Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas since 1974.",
  googleRating: 5.0,
  googleReviews: 118,
  womenOwned: true,
  businessHours: {
    monday: "7AM-7PM",
    tuesday: "7AM-7PM", 
    wednesday: "7AM-7PM",
    thursday: "7AM-7PM",
    friday: "7AM-7PM",
    saturday: "8AM-1PM",
    sunday: "Closed"
  },
  serviceAreas: [
    "Dallas", "Fort Worth", "Arlington", "Plano", "Irving", "Garland", 
    "Grand Prairie", "Mesquite", "Carrollton", "Richardson", "Lewisville", "Coppell"
  ]
}

export const services = {
  residential: [
    {
      id: 1,
      name: "Air Conditioning",
      description: "Complete AC installation, repair, and replacement services",
      features: ["Fast Response Time", "Energy Efficient Systems", "Licensed Technicians", "Warranty Included"],
      icon: "snowflake"
    },
    {
      id: 2,
      name: "Heating",
      description: "Furnace repair, heat pump service, and heating system installation",
      features: ["Furnace Repair", "Heat Pump Service", "System Installation", "Maintenance Plans"],
      icon: "flame"
    },
    {
      id: 3,
      name: "Preventative Maintenance",
      description: "Regular maintenance to keep your HVAC system running efficiently",
      features: ["Bi-Annual Service", "Filter Changes", "System Tune-ups", "Priority Scheduling"],
      icon: "wrench"
    },
    {
      id: 4,
      name: "Indoor Air Quality",
      description: "Improve your home's air quality with our specialized solutions",
      features: ["Air Purifiers", "Humidity Control", "Duct Cleaning", "UV Light Systems"],
      icon: "wind"
    }
  ],
  commercial: [
    {
      id: 1,
      name: "Commercial Air Conditioning",
      description: "Large-scale AC systems for commercial properties",
      features: ["Rooftop Units", "Chiller Systems", "Professional Service", "Preventive Maintenance"],
      icon: "building"
    },
    {
      id: 2,
      name: "Commercial Heating",
      description: "Commercial heating solutions and boiler services",
      features: ["Boiler Service", "Heat Pumps", "Radiant Heating", "Energy Audits"],
      icon: "factory"
    },
    {
      id: 3,
      name: "Commercial Maintenance",
      description: "Comprehensive maintenance programs for businesses",
      features: ["Scheduled Service", "Fast Response", "Equipment Monitoring", "Cost Control"],
      icon: "clipboard-check"
    }
  ]
}

export const testimonials = [
  {
    id: 1,
    name: "Jesse D.",
    location: "DFW Area",
    rating: 5,
    text: "I had an excellent experience with DFW HVAC! I just bought a home and needed my HVAC system checked out. They came out the very next day, clearly explained the issue, and provided me with multiple options for resolving it.",
    service: "System Inspection",
    timeAgo: "7 months ago"
  },
  {
    id: 2,
    name: "Daniel Ryan",
    location: "DFW Area", 
    rating: 5,
    text: "Jonathan and DFW HVAC were great! We had our AC go out in the middle of the night and reached out to them first thing in the morning. They were responsive and able to get us on their schedule that afternoon. Jonathan was able to diagnose and fix the issue quickly.",
    service: "AC Repair",
    timeAgo: "2 months ago"
  },
  {
    id: 3,
    name: "Beth Schneider",
    location: "DFW Area",
    rating: 5,
    text: "Great experience! They were prompt to respond to initial call and arrange time to come out to assess the issue I was having. They did a great job and very fair price for all the work that was needed. I have complete confidence in the quality of their work.",
    service: "HVAC Service",
    timeAgo: "2 months ago"
  },
  {
    id: 4,
    name: "Google Reviews",
    location: "Verified Customers",
    rating: 5,
    text: "Service tech got there on time and solved the issue quickly. The service was excellent and the price fair. I'm so grateful to have a dependable company to work with.",
    service: "Multiple Services",
    timeAgo: "Recent reviews"
  }
]

// Mock form submission
export const submitLeadForm = async (formData) => {
  console.log("Mock lead form submission:", formData)
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true, message: "Thank you! We'll contact you within 24 hours." }
}