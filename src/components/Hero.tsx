import React from 'react';
import { Calendar, MapPin, Trophy, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"></div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              FIFA World Cup
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                2026
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Secure your tickets to the greatest football celebration on Earth
            </p>
          </div>

          {/* Key information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Tournament Dates</h3>
              <p className="text-blue-200">June 11 - July 19, 2026</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <MapPin className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Host Countries</h3>
              <p className="text-blue-200">USA, Canada & Mexico</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Total Teams</h3>
              <p className="text-blue-200">48 National Teams</p>
            </div>
          </div>

          {/* Crypto discount banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-3xl animate-pulse">💎</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">30% OFF with Crypto Payment!</h3>
                <p className="text-green-100">Pay with cryptocurrency and save on all ticket packages</p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#matches"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Browse Matches
            </a>
            <a
              href="#packages"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300"
            >
              View Packages
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;