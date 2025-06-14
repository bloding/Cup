import React, { useState } from 'react';
import { Check, Star, CreditCard } from 'lucide-react';
import { Package } from '../data/packages';
import RegistrationForm from './RegistrationForm';

interface PackageCardProps {
  package: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);

  const handleBookNow = () => {
    setIsRegistrationFormOpen(true);
  };

  const ticketInfo = {
    type: 'package' as const,
    title: pkg.name,
    price: pkg.price,
    cryptoPrice: Math.round(pkg.price * 0.7) // 30% discount
  };

  return (
    <>
      <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${pkg.featured ? 'ring-4 ring-yellow-400' : ''}`}>
        {/* Featured badge */}
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        )}

        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}>
          <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-white text-opacity-90 mb-4">{pkg.description}</p>
          <div className="text-4xl font-bold">${pkg.price.toLocaleString()}</div>
          <div className="text-white text-opacity-75">{pkg.matches} matches included</div>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {pkg.includes.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Crypto discount */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-green-700 font-semibold text-sm mb-1">💰 Crypto Payment Special:</div>
            <div className="text-green-800 font-bold text-xl">
              ${Math.round(pkg.price * 0.7).toLocaleString()} (30% OFF!)
            </div>
          </div>

          {/* Book button */}
          <button
            onClick={handleBookNow}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <div className="text-xl">💎</div>
            <span>Book with Crypto</span>
          </button>
        </div>
      </div>

      <RegistrationForm
        isOpen={isRegistrationFormOpen}
        onClose={() => setIsRegistrationFormOpen(false)}
        ticketInfo={ticketInfo}
      />
    </>
  );
};

export default PackageCard;