import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MatchCard from './components/MatchCard';
import PackageCard from './components/PackageCard';
import Footer from './components/Footer';
import { matches } from './data/matches';
import { packages } from './data/packages';
import { Calendar, Package, Trophy, MapPin } from 'lucide-react';

function App() {
  const featuredMatches = matches.slice(0, 6);
  const featuredPackages = packages;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      {/* Featured Matches Section */}
      <section id="matches" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-800">Featured Matches</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure your seats for the most anticipated matches of the tournament
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              View All Matches
            </button>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-800">Ticket Packages</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your World Cup experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section id="venues" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-800">Host Venues</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-class stadiums across three nations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "MetLife Stadium",
                city: "New York/New Jersey, USA",
                capacity: "82,500",
                image: "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg"
              },
              {
                name: "SoFi Stadium", 
                city: "Los Angeles, USA",
                capacity: "70,240",
                image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg"
              },
              {
                name: "Azteca Stadium",
                city: "Mexico City, Mexico", 
                capacity: "87,523",
                image: "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg"
              }
            ].map((venue, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-2">{venue.city}</p>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-semibold">Capacity: {venue.capacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;