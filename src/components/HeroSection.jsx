import React from 'react';
import { FiSearch } from 'react-icons/fi'; // Import ikon search

const HeroSection = () => {
  return (
    <section className="bg-white py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Temukan Desainer Grafis & Ilustrator Berbakat
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Platform kurasi untuk kolaborasi kreatif di Indonesia.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 relative">
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-full overflow-hidden p-1 focus-within:border-primary transition">
             <div className="pl-4 text-gray-400">
                <FiSearch size={24} />
             </div>
            <input 
              type="text" 
              placeholder="Cari layanan (mis: desain logo, ilustrasi buku...)" 
              className="flex-grow px-4 py-3 outline-none text-gray-700"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-600 transition">
              Cari
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition shadow-md shadow-blue-500/20">
            Cari Kreator
          </button>
          <button className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-medium hover:border-primary hover:text-primary transition">
            Cari Proyek
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;