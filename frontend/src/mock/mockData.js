// Mock data for DFW HVAC website

export const companyInfo = {
  name: "DFW HVAC",
  tagline: "Family Owned Since 1974",
  phone: "(855) TEX-HVAC",
  phoneDisplay: "(855) 839-4822",
  email: "info@dfwhvac.com",
  address: "Dallas-Fort Worth & Surrounding Areas",
  established: "1974",
  description: "Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas since 1974.",
  serviceAreas: [
    "Dallas", "Fort Worth", "Arlington", "Plano", "Irving", "Garland", 
    "Grand Prairie", "Mesquite", "Carrollton", "Richardson", "Lewisville"
  ]
};

export const services = {
  residential: [
    {
      id: 1,
      name: "Air Conditioning",
      description: "Complete AC installation, repair, and replacement services",
      features: ["24/7 Emergency Service", "Energy Efficient Systems", "Licensed Technicians", "Warranty Included"],
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
    },
    {
      id: 5,
      name: "System Controllers",
      description: "Smart thermostats and HVAC control systems",
      features: ["Smart Thermostats", "Zone Control", "WiFi Enabled", "Energy Savings"],
      icon: "gauge"
    }
  ],
  commercial: [
    {
      id: 1,
      name: "Commercial Air Conditioning",
      description: "Large-scale AC systems for commercial properties",
      features: ["Rooftop Units", "Chiller Systems", "24/7 Service", "Preventive Maintenance"],
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
      features: ["Scheduled Service", "Emergency Response", "Equipment Monitoring", "Cost Control"],
      icon: "clipboard-check"
    },
    {
      id: 4,
      name: "Commercial Indoor Air Quality",
      description: "Air quality solutions for commercial spaces",
      features: ["Ventilation Systems", "Air Filtration", "Humidity Control", "Environmental Testing"],
      icon: "air-vent"
    },
    {
      id: 5,
      name: "Commercial Controllers",
      description: "Building automation and HVAC control systems",
      features: ["BMS Integration", "Remote Monitoring", "Energy Management", "Automated Controls"],
      icon: "computer"
    }
  ]
};

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Dallas, TX",
    rating: 5,
    text: "DFW HVAC saved the day when our AC went out during a Texas heatwave. Professional, fast, and reasonably priced!",
    service: "AC Repair"
  },
  {
    id: 2,
    name: "Mike Thompson",
    location: "Fort Worth, TX", 
    rating: 5,
    text: "Been using DFW HVAC for our office building for 3 years. Always reliable and their maintenance program keeps our costs down.",
    service: "Commercial Maintenance"
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    location: "Arlington, TX",
    rating: 5,
    text: "Family business that really cares about their customers. Installed our new system perfectly and explained everything clearly.",
    service: "System Installation"
  },
  {
    id: 4,
    name: "Robert Chen",
    location: "Plano, TX",
    rating: 5,
    text: "50 years in business shows! Professional technicians, fair pricing, and they stand behind their work. Highly recommend.",
    service: "Heating Repair"
  }
];

export const faqs = [
  {
    id: 1,
    question: "Do you offer 24/7 emergency service?",
    answer: "Yes, we provide 24/7 emergency HVAC service throughout the Dallas-Fort Worth area. Call us anytime for urgent heating or cooling issues."
  },
  {
    id: 2,
    question: "What areas do you serve?",
    answer: "We serve Dallas, Fort Worth, and all surrounding areas including Arlington, Plano, Irving, Garland, Grand Prairie, and more."
  },
  {
    id: 3,
    question: "Do you offer financing options?",
    answer: "Yes, we offer flexible financing options to make your HVAC investment more affordable. Contact us to learn about current financing programs."
  },
  {
    id: 4,
    question: "How often should I have my HVAC system maintained?",
    answer: "We recommend bi-annual maintenance - once in spring for AC and once in fall for heating systems to ensure optimal performance."
  },
  {
    id: 5,
    question: "Do you work on both residential and commercial systems?",
    answer: "Yes, we provide comprehensive HVAC services for both residential homes and commercial properties of all sizes."
  }
];

export const recentJobs = [
  {
    id: 1,
    title: "Complete HVAC System Replacement",
    location: "Dallas, TX",
    type: "Residential",
    description: "Replaced 20-year-old system with new high-efficiency heat pump",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    result: "40% reduction in energy costs"
  },
  {
    id: 2,
    title: "Commercial Office Building AC Install",
    location: "Fort Worth, TX",
    type: "Commercial",
    description: "Installed 5-ton rooftop unit for 8,000 sq ft office space",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
    result: "Improved comfort and efficiency"
  },
  {
    id: 3,
    title: "Emergency AC Repair",
    location: "Arlington, TX",
    type: "Emergency",
    description: "Same-day compressor replacement during July heatwave",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
    result: "System restored within 4 hours"
  }
];

// Mock form submission
export const submitLeadForm = async (formData) => {
  console.log("Mock lead form submission:", formData);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Thank you! We'll contact you within 24 hours." };
};

// Mock cost estimator
export const calculateEstimate = async (systemData) => {
  console.log("Mock cost calculation:", systemData);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock calculation logic
  const basePrice = systemData.systemType === 'heat-pump' ? 8000 : 
                   systemData.systemType === 'gas-furnace' ? 6000 : 7000;
  const sqftMultiplier = systemData.squareFootage / 1000;
  const estimate = Math.round(basePrice * sqftMultiplier * 1.2);
  
  return {
    lowEstimate: estimate - 1000,
    highEstimate: estimate + 1500,
    recommended: estimate,
    factors: [
      "Square footage of your home",
      "Current system condition", 
      "Ductwork requirements",
      "Energy efficiency preferences"
    ]
  };
};