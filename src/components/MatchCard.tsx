import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, CreditCard } from 'lucide-react';
import { Match } from '../data/matches';
import RegistrationForm from './RegistrationForm';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof Match['prices']>('category3');
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);

  const categoryLabels = {
    category1: 'Category 1 - Premium',
    category2: 'Category 2 - Excellent', 
    category3: 'Category 3 - Good',
    category4: 'Category 4 - Standard'
  };

  const stageColors = {
    'Group Stage': 'bg-blue-100 text-blue-800',
    'Round of 16': 'bg-green-100 text-green-800',
    'Quarter Final': 'bg-yellow-100 text-yellow-800',
    'Semi Final': 'bg-orange-100 text-orange-800',
    'Third Place Play-off': 'bg-purple-100 text-purple-800',
    'Final': 'bg-red-100 text-red-800'
  };

  const handleBookNow = () => {
    setIsRegistrationFormOpen(true);
  };

  const ticketInfo = {
    type: 'match' as const,
    title: `${match.homeTeam} vs ${match.awayTeam} - ${categoryLabels[selectedCategory]}`,
    price: match.prices[selectedCategory],
    cryptoPrice: Math.round(match.prices[selectedCategory] * 0.7) // 30% discount
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColors[match.stage as keyof typeof stageColors]}`}>
              {match.stage}
            </span>
            {match.group && (
              <span className="text-blue-200 text-sm">Group {match.group}</span>
            )}
          </div>
          
          {/* Teams */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-right">
                <h3 className="text-lg font-bold">{match.homeTeam}</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-400">VS</div>
              <div className="text-left">
                <h3 className="text-lg font-bold">{match.awayTeam}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{match.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{match.venue}, {match.city}</span>
            </div>
          </div>

          {/* Ticket Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Select Category:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(match.prices).map(([category, price]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as keyof Match['prices'])}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedCategory === category
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs text-gray-500">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  <div className="text-lg font-bold">${price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Crypto Discount */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-green-700">
              <span className="text-sm font-semibold">💰 Crypto Payment Discount:</span>
            </div>
            <div className="text-green-800 font-bold">
              Pay ${Math.round(match.prices[selectedCategory] * 0.7)} with crypto (30% OFF!)
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookNow}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <div className="text-xl">💎</div>
            <span>Book with Crypto - ${Math.round(match.prices[selectedCategory] * 0.7)}</span>
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

export default MatchCard;