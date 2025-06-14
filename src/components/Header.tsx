import React, { useState } from 'react';
import { Trophy, Menu, X, Globe, Phone } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold">FIFA World Cup 2026</h1>
              <p className="text-xs text-blue-200">Official Ticket Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-yellow-400 transition-colors duration-200">Home</a>
            <a href="#matches" className="hover:text-yellow-400 transition-colors duration-200">Matches</a>
            <a href="#packages" className="hover:text-yellow-400 transition-colors duration-200">Packages</a>
            <a href="#venues" className="hover:text-yellow-400 transition-colors duration-200">Venues</a>
            <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full text-sm">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="hover:text-yellow-400 transition-colors duration-200">Home</a>
              <a href="#matches" className="hover:text-yellow-400 transition-colors duration-200">Matches</a>
              <a href="#packages" className="hover:text-yellow-400 transition-colors duration-200">Packages</a>
              <a href="#venues" className="hover:text-yellow-400 transition-colors duration-200">Venues</a>
              <div className="flex items-center space-x-2 bg-green-600 px-3 py-2 rounded-full text-sm w-fit">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;