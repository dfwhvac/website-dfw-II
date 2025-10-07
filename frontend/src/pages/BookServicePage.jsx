import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import LeadForm from '../components/LeadForm';
import { 
  Phone, 
  Clock, 
  Shield, 
  Wrench,
  Snowflake,
  Flame,
  Settings,
  AlertCircle
} from 'lucide-react';
import { companyInfo } from '../mock/mockData';

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
      color: "blue",
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your HVAC Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule professional HVAC service with Dallas-Fort Worth's most trusted 
            heating and cooling experts. Fast, reliable service.
          </p>
        </div>

        {/* Service Banner */}
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Phone className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Need HVAC Service?</h2>
          </div>
          <p className="text-lg mb-4">
            Contact us today for professional heating and cooling service.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg h-auto"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call (972) 777-COOL Now
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Service Request Form */}
          <div>
            <LeadForm 
              title="Schedule Your Service"
              description="Fill out the form below and we'll contact you to schedule your appointment"
            />
          </div>

          {/* Service Information */}
          <div className="space-y-6">
            
            {/* Service Types */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Our Services</CardTitle>
                <CardDescription>
                  Professional HVAC services for all your heating and cooling needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceTypes.map((service, index) => {
                  const IconComponent = service.icon;
                  const colorClasses = {
                    red: "bg-red-100 text-red-600",
                    blue: "bg-blue-100 text-blue-600", 
                    orange: "bg-orange-100 text-orange-600",
                    green: "bg-green-100 text-green-600"
                  };

                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[service.color]}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          {service.urgent && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                              FAST
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-800">Call for Immediate Service</div>
                      <div className="text-red-600 font-bold">{companyInfo.phoneDisplay}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-800">Online Service Request</div>
                      <div className="text-blue-600">Fill out the form for non-emergency service</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Guarantees */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Service Guarantees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">
                      <strong>24/7 Emergency Service</strong> - Available when you need us most
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">
                      <strong>Licensed & Insured</strong> - Fully certified technicians
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">
                      <strong>Guaranteed Work</strong> - We stand behind our service
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  We proudly serve the entire Dallas-Fort Worth metroplex including:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {companyInfo.serviceAreas.map((area, index) => (
                    <div key={index} className="text-gray-700">• {area}</div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/cities-served">View All Service Areas</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder CRM Integration Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 font-medium mb-2">Integration Note:</div>
              <p className="text-blue-700 text-sm">
                This form currently uses mock data. In production, form submissions will 
                integrate directly with your CRM system for automatic scheduling and follow-up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;