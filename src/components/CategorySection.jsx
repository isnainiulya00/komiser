import React from 'react';
// Import ikon yang sesuai dari react-icons
import { FaPalette, FaPenNib, FaLaptopCode, FaVideo } from 'react-icons/fa';

const categories = [
  { name: 'Desain Logo', icon: <FaPalette size={28} className="text-pink-500" /> },
  { name: 'Ilustrasi', icon: <FaPenNib size={28} className="text-orange-500" /> },
  { name: 'Desain Web/App', icon: <FaLaptopCode size={28} className="text-blue-500" /> },
  { name: 'Animasi', icon: <FaVideo size={28} className="text-purple-500" /> },
];

const CategorySection = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
        Telusuri Berdasarkan Kategori
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center text-center border border-gray-100">
            <div className="mb-4 bg-gray-50 p-4 rounded-full">
                {cat.icon}
            </div>
            <h3 className="font-semibold text-gray-800">{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;