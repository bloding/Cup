import React from 'react';
import { Trophy, Phone, Mail, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">FIFA World Cup 2026</h3>
                <p className="text-sm text-blue-200">Official Ticket Portal</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm">
              Your trusted source for authentic FIFA World Cup 2026 tickets. Experience the greatest football celebration with exclusive crypto discounts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="#home" className="hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#matches" className="hover:text-yellow-400 transition-colors">Matches</a></li>
              <li><a href="#packages" className="hover:text-yellow-400 transition-colors">Packages</a></li>
              <li><a href="#venues" className="hover:text-yellow-400 transition-colors">Venues</a></li>
            </ul>
          </div>

          {/* Tournament Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tournament Info</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>48 Teams Competing</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>USA, Canada & Mexico</span>
              </li>
              <li className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>104 Total Matches</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>tickets@worldcup2026.com</span>
              </li>
              <li>
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  💬 WhatsApp Support Available 24/7
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Crypto Wallet Info */}
        <div className="border-t border-blue-700 mt-8 pt-8">
          <div className="bg-green-900 bg-opacity-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-green-300 mb-2">Cryptocurrency Payments</h4>
            <p className="text-green-200 text-sm mb-2">
              Pay with crypto and save 50%! Send payments to our secure wallet:
            </p>
            <div className="bg-black bg-opacity-30 rounded-lg p-3 font-mono text-sm text-green-300 break-all">
              0x62468C025d2738eDB2662B9994F52Af0Afa17c9d
            </div>
            <p className="text-green-200 text-xs mt-2">
              Accepts ETH, BTC, USDT and other major cryptocurrencies
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blue-700 mt-8 pt-8 text-center">
          <p className="text-blue-200 text-sm">
            © 2024 FIFA World Cup 2026 Ticket Portal. All rights reserved. 
            <span className="block mt-1">
              Secure payments • Instant delivery • 24/7 customer support
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;