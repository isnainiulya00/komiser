import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaHeart } from 'react-icons/fa';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [allCreators, setAllCreators] = useState([]);

  const getDefaultCreators = () => {
    return [
      { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", rating: 4.9, category: "Ilustrasi", approved: true },
      { id: 2, name: "Citra Lestari", role: "UI/UX Designer", rating: 5.0, category: "Desain Web", approved: true },
      { id: 3, name: "Andi Wijaya", role: "Desainer Logo", rating: 4.8, category: "Logo", approved: true },
      { id: 4, name: "Siti Aminah", role: "Animator 2D", rating: 4.7, category: "Animasi", approved: true },
    ];
  };

  useEffect(() => {
    const loadCreators = () => {
      const creators = JSON.parse(localStorage.getItem('creators') || '[]');
      const defaultCreators = getDefaultCreators();
      
      if (creators.length === 0) {
        localStorage.setItem('creators', JSON.stringify(defaultCreators));
        setAllCreators(defaultCreators);
      } else {
        // Merge default dengan existing
        const merged = [...defaultCreators];
        creators.forEach(c => {
          if (!merged.find(m => m.id === c.id)) {
            merged.push(c);
          } else {
            // Update existing
            const index = merged.findIndex(m => m.id === c.id);
            merged[index] = c;
          }
        });
        setAllCreators(merged);
      }
    };
    
    loadCreators();
    
    // Refresh setiap 2 detik
    const interval = setInterval(loadCreators, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simpan favorites ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite - hanya untuk pembeli
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
    
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // Logika Filter - hanya tampilkan yang approved (untuk pembeli)
  // Admin bisa lihat semua, termasuk yang belum approved
  
  const filteredCreators = allCreators.filter((creator) => {
    // Admin bisa lihat semua, pembeli hanya yang approved
    if (!isAdmin && !creator.approved) return false;
    if (searchTerm === "") return true;
    return creator.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           creator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           creator.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* --- HERO SECTION (Search) --- */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Temukan Kreator Terbaik</h1>
          <p className="text-xl text-blue-100 mb-10">Cari ilustrator, desainer, atau animator favoritmu di sini</p>
          
          {/* INPUT PENCARIAN */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari berdasarkan nama, role, atau kategori..."
                className="w-full border-0 p-4 pr-12 rounded-xl shadow-lg text-gray-800 focus:ring-4 focus:ring-blue-300 outline-none text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HASIL PENCARIAN --- */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Daftar Kreator <span className="text-blue-600">({filteredCreators.length})</span>
          </h2>
          {favorites.length > 0 && (
            <div className="text-sm text-gray-600">
              <FaHeart className="inline text-red-500 mr-1" />
              {favorites.length} favorit
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.length > 0 ? (
            filteredCreators.map((item) => (
              <Link to={`/profile/${item.id}`} key={item.id} className="block group">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
                  {/* Cover Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
                    {/* Favorite Button - hanya untuk pembeli */}
                    {isConsumer && (
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          favorites.includes(item.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-400 hover:bg-red-50'
                        }`}
                      >
                        <FaHeart className={favorites.includes(item.id) ? 'fill-current' : ''} />
                      </button>
                    )}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="p-6 -mt-12 relative">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-2xl text-gray-700 mb-4">
                      {item.name.charAt(0)}
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{item.role}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-semibold text-gray-800">{item.rating}</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Tidak ada hasil</h3>
              <p className="text-gray-500">Tidak ada kreator dengan kata kunci "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;