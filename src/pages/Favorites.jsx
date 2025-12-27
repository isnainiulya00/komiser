import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

const Favorites = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [favorites, setFavorites] = useState([]);
  const [allCreators, setAllCreators] = useState([]);

  const getDefaultCreators = () => {
    return [
      { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", rating: 4.9, category: "Ilustrasi" },
      { id: 2, name: "Citra Lestari", role: "UI/UX Designer", rating: 5.0, category: "Desain Web" },
      { id: 3, name: "Andi Wijaya", role: "Desainer Logo", rating: 4.8, category: "Logo" },
      { id: 4, name: "Siti Aminah", role: "Animator 2D", rating: 4.7, category: "Animasi" },
    ];
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);

    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    setAllCreators(creators.length > 0 ? creators : getDefaultCreators());
  }, [navigate, user]);

  const favoriteCreators = allCreators.filter(c => favorites.includes(c.id));

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kreator Favorit Saya</h1>
          <p className="text-gray-600">{favoriteCreators.length} kreator favorit</p>
        </div>

        {favoriteCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCreators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <button
                    onClick={() => toggleFavorite(creator.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                  >
                    <FaHeart className="fill-current" />
                  </button>
                </div>
                
                <div className="p-6 -mt-12 relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-2xl text-gray-700 mb-4">
                    {creator.name.charAt(0)}
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{creator.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{creator.role}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="font-semibold text-gray-800">{creator.rating}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {creator.category}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      to={`/profile/${creator.id}`}
                      className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      Lihat Profil
                    </Link>
                    <Link 
                      to={`/checkout/${creator.id}`}
                      className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Belum Ada Favorit</h3>
            <p className="text-gray-600 mb-6">Mulai jelajahi dan tambahkan kreator favorit Anda!</p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Jelajahi Kreator
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

