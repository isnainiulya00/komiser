import React from 'react';
import { FaStar } from 'react-icons/fa';

// Data dummy untuk kreator
const creators = [
  { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", rating: 4.9, reviews: 120 },
  { id: 2, name: "Citra Lestari", role: "UI/UX Designer", rating: 5.0, reviews: 88 },
  { id: 3, name: "Andi Wijaya", role: "Desainer Logo & Brand", rating: 4.8, reviews: 210 },
];

const FeaturedCreators = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
        Kreator Unggulan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {creators.map((creator) => (
          <div key={creator.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
            {/* Placeholder Image (Kotak Abu-abu) */}
            <div className="h-48 bg-gray-300 w-full animate-pulse"></div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{creator.name}</h3>
              <p className="text-gray-600 mb-4">{creator.role}</p>
              
              {/* Rating */}
              <div className="flex items-center font-medium">
                <FaStar className="text-yellow-400 mr-2" />
                <span className="text-gray-800 mr-1">{creator.rating}</span>
                <span className="text-gray-500">({creator.reviews} Review)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCreators;