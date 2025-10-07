import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const residentialServices = [
    { name: 'Air Conditioning', path: '/services/residential/air-conditioning' },
    { name: 'Heating', path: '/services/residential/heating' },
    { name: 'Preventative Maintenance', path: '/services/residential/maintenance' },
    { name: 'Indoor Air Quality', path: '/services/residential/indoor-air-quality' },
    { name: 'System Controllers', path: '/services/residential/controllers' }
  ];

  const commercialServices = [
    { name: 'Commercial AC', path: '/services/commercial/air-conditioning' },
    { name: 'Commercial Heating', path: '/services/commercial/heating' },
    { name: 'Commercial Maintenance', path: '/services/commercial/maintenance' },
    { name: 'Commercial Air Quality', path: '/services/commercial/indoor-air-quality' },
    { name: 'Commercial Controllers', path: '/services/commercial/controllers' }
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-electric-blue sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-200">
          <div className="text-gray-600">
            Serving Dallas-Fort Worth Since 1974
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Phone className="w-4 h-4" />
              <span>(972) 777-COOL</span>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Call Now
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              DFW
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">DFW HVAC</div>
              <div className="text-sm text-gray-600">Family Owned Since 1974</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="px-4 py-2 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2">
                  Residential Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    {residentialServices.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2">
                  Commercial Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-64">
                    {commercialServices.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/about" className="px-4 py-2 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/reviews" className="px-4 py-2 hover:text-blue-600 transition-colors">
                  Reviews
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact" className="px-4 py-2 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/cost-estimator">Get Estimate</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/book-service">Book Service</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            
            <div className="space-y-2">
              <div className="font-semibold text-gray-800">Residential Services</div>
              {residentialServices.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className="block pl-4 py-1 text-gray-600 hover:text-blue-600 text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-gray-800">Commercial Services</div>
              {commercialServices.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className="block pl-4 py-1 text-gray-600 hover:text-blue-600 text-sm"
                >
                  {service.name}
                </Link>
              ))}
            </div>

            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/reviews" className="block py-2 text-gray-700 hover:text-blue-600">
              Reviews
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
              Contact
            </Link>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/cost-estimator">Get Estimate</Link>
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/book-service">Book Service</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;