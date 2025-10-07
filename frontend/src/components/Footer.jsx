import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { companyInfo } from '../mock/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-prussian-blue text-white px-3 py-2 rounded-lg font-bold text-lg">
                DFW
              </div>
              <div>
                <div className="text-lg font-bold">DFW HVAC</div>
                <div className="text-sm text-gray-400">Family Owned Since 1974</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Trusted HVAC contractor serving Dallas-Fort Worth and surrounding areas 
              for over 50 years. Quality service, reliable solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-electric-blue cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-electric-blue cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-electric-blue cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/residential/air-conditioning" className="text-gray-300 hover:text-white transition-colors">
                  Air Conditioning
                </Link>
              </li>
              <li>
                <Link to="/services/residential/heating" className="text-gray-300 hover:text-white transition-colors">
                  Heating Systems
                </Link>
              </li>
              <li>
                <Link to="/services/residential/maintenance" className="text-gray-300 hover:text-white transition-colors">
                  Preventative Maintenance
                </Link>
              </li>
              <li>
                <Link to="/services/residential/indoor-air-quality" className="text-gray-300 hover:text-white transition-colors">
                  Indoor Air Quality
                </Link>
              </li>
              <li>
                <Link to="/services/commercial/air-conditioning" className="text-gray-300 hover:text-white transition-colors">
                  Commercial HVAC
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-300 hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-300 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/financing" className="text-gray-300 hover:text-white transition-colors">
                  Financing Options
                </Link>
              </li>
              <li>
                <Link to="/cities-served" className="text-gray-300 hover:text-white transition-colors">
                  Cities Served
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-vivid-red" />
                <div>
                  <div className="font-semibold">{companyInfo.phoneDisplay}</div>
                  <div className="text-gray-400">Professional HVAC Service</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-gray-300">{companyInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">{companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-yellow-500" />
                <div className="text-gray-300">
                  <div>Mon-Fri: 7AM-7PM</div>
                  <div>Sat: 8AM-5PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © {currentYear} DFW HVAC. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;