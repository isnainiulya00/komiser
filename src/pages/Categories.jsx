import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaHeart } from 'react-icons/fa';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [allCreators, setAllCreators] = useState([]);

  const categories = [
    { id: 'all', name: 'Semua', icon: '🎨' },
    { id: 'Ilustrasi', name: 'Ilustrasi', icon: '🖼️' },
    { id: 'Desain Web', name: 'Desain Web', icon: '💻' },
    { id: 'Logo', name: 'Logo', icon: '✨' },
    { id: 'Animasi', name: 'Animasi', icon: '🎬' },
    { id: 'Design Grafis', name: 'Design Grafis', icon: '📐' },
    { id: 'Infografis', name: 'Infografis', icon: '📊' },
    { id: 'UI/UX', name: 'UI/UX', icon: '🎯' },
  ];

  const getDefaultCreators = () => {
    return [
      { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", rating: 4.9, category: "Ilustrasi", approved: true },
      { id: 2, name: "Citra Lestari", role: "UI/UX Designer", rating: 5.0, category: "Desain Web", approved: true },
      { id: 3, name: "Andi Wijaya", role: "Desainer Logo", rating: 4.8, category: "Logo", approved: true },
      { id: 4, name: "Siti Aminah", role: "Animator 2D", rating: 4.7, category: "Animasi", approved: true },
    ];
  };

  useEffect(() => {
    const loadData = () => {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(savedFavorites);

      const creators = JSON.parse(localStorage.getItem('creators') || '[]');
      const defaultCreators = getDefaultCreators();
      
      if (creators.length === 0) {
        localStorage.setItem('creators', JSON.stringify(defaultCreators));
        setAllCreators(defaultCreators);
      } else {
        // Merge default dengan existing
        const merged = [...defaultCreators];
        creators.forEach(c => {
          const existingIndex = merged.findIndex(m => m.id === c.id);
          if (existingIndex >= 0) {
            merged[existingIndex] = c; // Update existing
          } else {
            merged.push(c); // Add new
          }
        });
        setAllCreators(merged);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isConsumer = user && user.role !== 'Artist' && user.role !== 'Admin';
  const isAdmin = user && user.role === 'Admin';
  
  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Hanya pembeli yang bisa favorit
    if (!isConsumer) {
      alert('Hanya pembeli yang bisa menambahkan favorit!');
      return;
    }
    
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  const filteredCreators = selectedCategory && selectedCategory !== 'all'
    ? allCreators.filter(c => {
        if (!isAdmin && !c.approved) return false;
        return c.category === selectedCategory;
      })
    : allCreators.filter(c => isAdmin || c.approved);

  // Get featured creators per category (top rated)
  const getFeaturedCreators = (category) => {
    const categoryCreators = allCreators
      .filter(c => {
        if (!isAdmin && !c.approved) return false;
        return c.category === category;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
    return categoryCreators;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kategori</h1>
          <p className="text-gray-600">Jelajahi kreator berdasarkan kategori</p>
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border-2 transition ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-900">{cat.name}</div>
            </button>
          ))}
        </div>

        {/* Featured Creators by Category */}
        {!selectedCategory || selectedCategory === 'all' ? (
          <div className="space-y-8">
            {categories.slice(1).map((cat) => {
              const featured = getFeaturedCreators(cat.name);
              if (featured.length === 0) return null;
              
              return (
                <div key={cat.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Kreator Unggulan - {cat.name}</h2>
                      <p className="text-gray-600">Berdasarkan rating tertinggi</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featured.map((creator) => (
                      <Link key={creator.id} to={`/profile/${creator.id}`} className="block group">
                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition border border-gray-200">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {creator.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">
                                {creator.name}
                              </h3>
                              <p className="text-sm text-gray-600">{creator.role}</p>
                            </div>
                            {isConsumer && (
                              <button
                                onClick={(e) => toggleFavorite(creator.id, e)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                  favorites.includes(creator.id)
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-gray-400 hover:bg-red-50'
                                }`}
                              >
                                <FaHeart className={favorites.includes(creator.id) ? 'fill-current' : ''} />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <FaStar className="mr-1" />
                            <span className="font-semibold text-gray-800">{creator.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* All Creators in Selected Category */
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name} ({filteredCreators.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => (
                <Link key={creator.id} to={`/profile/${creator.id}`} className="block group">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                      {isConsumer && (
                        <button
                          onClick={(e) => toggleFavorite(creator.id, e)}
                          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            favorites.includes(creator.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-400 hover:bg-red-50'
                          }`}
                        >
                          <FaHeart className={favorites.includes(creator.id) ? 'fill-current' : ''} />
                        </button>
                      )}
                    </div>
                    
                    <div className="p-6 -mt-12 relative">
                      <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-2xl text-gray-700 mb-4">
                        {creator.name.charAt(0)}
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition">
                        {creator.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{creator.role}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-500">
                          <FaStar className="mr-1" />
                          <span className="font-semibold text-gray-800">{creator.rating}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {creator.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

