import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaHeart, FaEdit, FaShoppingCart, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [favorites, setFavorites] = useState([]);
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
    if (!user) {
      navigate('/login');
      return;
    }

    // Load favorites
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);

    // Load creators from localStorage
    const loadCreators = () => {
      const creators = JSON.parse(localStorage.getItem('creators') || '[]');
      const defaultCreators = getDefaultCreators();
      
      // Merge dengan default jika belum ada
      if (creators.length === 0) {
        localStorage.setItem('creators', JSON.stringify(defaultCreators));
        setAllCreators(defaultCreators);
      } else {
        // Merge default dengan existing, hindari duplikat
        const merged = [...defaultCreators];
        creators.forEach(c => {
          if (!merged.find(m => m.id === c.id)) {
            merged.push(c);
          }
        });
        setAllCreators(merged);
      }
    };
    
    loadCreators();
    
    // Refresh setiap 2 detik untuk update data
    const interval = setInterval(loadCreators, 2000);
    return () => clearInterval(interval);
  }, [navigate, user]);

  if (!user) return null;

  const isArtist = user.role === 'Artist';
  const isAdmin = user.role === 'Admin';

  // Dashboard untuk Pembeli
  if (!isArtist && !isAdmin) {
    const favoriteCreators = allCreators.filter(c => favorites.includes(c.id));

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Pembeli</h1>
            <p className="text-gray-600">Selamat datang, {user.name}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Favorit Saya</p>
                  <p className="text-3xl font-bold text-gray-900">{favorites.length}</p>
                </div>
                <FaHeart className="text-4xl text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Pesanan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {JSON.parse(localStorage.getItem('payments') || '[]')
                      .filter(p => p.userId === user.email && p.status === 'approved').length}
                  </p>
                </div>
                <FaShoppingCart className="text-4xl text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Kreator Tersedia</p>
                  <p className="text-3xl font-bold text-gray-900">{allCreators.filter(c => c.approved).length}</p>
                </div>
                <FaUser className="text-4xl text-purple-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/" className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <p className="font-semibold text-gray-900">Jelajahi Kreator</p>
                <p className="text-sm text-gray-600 mt-1">Cari kreator terbaik</p>
              </Link>
              <Link to="/favorites" className="p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition text-center">
                <FaHeart className="mx-auto text-red-500 mb-2" />
                <p className="font-semibold text-gray-900">Favorit Saya</p>
                <p className="text-sm text-gray-600 mt-1">Lihat kreator favorit</p>
              </Link>
              <Link to="/categories" className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-center">
                <p className="font-semibold text-gray-900">Kategori</p>
                <p className="text-sm text-gray-600 mt-1">Jelajahi berdasarkan kategori</p>
              </Link>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pesanan Saya</h2>
            {JSON.parse(localStorage.getItem('payments') || '[]')
              .filter(p => p.userId === user.email)
              .length > 0 ? (
              <div className="space-y-3">
                {JSON.parse(localStorage.getItem('payments') || '[]')
                  .filter(p => p.userId === user.email)
                  .slice(0, 5)
                  .map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{payment.serviceName}</p>
                          <p className="text-sm text-gray-600">Ke: {payment.creatorName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            Rp {payment.amount.toLocaleString('id-ID')}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                            payment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status === 'approved' ? 'Disetujui' :
                             payment.status === 'rejected' ? 'Ditolak' :
                             'Menunggu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada pesanan</p>
            )}
          </div>

          {/* Favorite Creators Preview */}
          {favoriteCreators.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Kreator Favorit</h2>
                <Link to="/favorites" className="text-blue-600 hover:text-blue-700 font-medium">
                  Lihat Semua →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteCreators.slice(0, 3).map((creator) => (
                  <Link key={creator.id} to={`/profile/${creator.id}`} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{creator.name}</p>
                        <p className="text-sm text-gray-600">{creator.role}</p>
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
  }

  // Dashboard untuk Artist
  if (isArtist) {
    const myProfile = allCreators.find(c => c.email === user.email) || null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Artist</h1>
            <p className="text-gray-600">Selamat datang, {user.name}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rating</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {myProfile?.rating || '0.0'}
                  </p>
                </div>
                <FaStar className="text-4xl text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Pesanan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {JSON.parse(localStorage.getItem('payments') || '[]')
                      .filter(p => p.creatorId === myProfile?.id && p.status === 'approved').length}
                  </p>
                </div>
                <FaShoppingCart className="text-4xl text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {myProfile?.approved ? '✓ Disetujui' : '⏳ Menunggu'}
                  </p>
                </div>
                <FaUser className="text-4xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/edit-profile" className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-center">
                <FaEdit className="mx-auto text-blue-500 mb-2 text-2xl" />
                <p className="font-semibold text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600 mt-1">Kelola profil dan portfolio</p>
              </Link>
              <Link to="/" className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-center">
                <p className="font-semibold text-gray-900">Jelajahi Kreator</p>
                <p className="text-sm text-gray-600 mt-1">Lihat kreator lain</p>
              </Link>
              <Link to="/categories" className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center">
                <p className="font-semibold text-gray-900">Kategori</p>
                <p className="text-sm text-gray-600 mt-1">Jelajahi kategori</p>
              </Link>
            </div>
          </div>

          {/* Orders List for Artist */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pesanan Saya</h2>
            {(() => {
              const payments = JSON.parse(localStorage.getItem('payments') || '[]');
              const myOrders = payments.filter(p => p.creatorId === myProfile?.id);
              
              if (myOrders.length === 0) {
                return <p className="text-gray-500 text-center py-8">Belum ada pesanan</p>;
              }
              
              return (
                <div className="space-y-3">
                  {myOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{order.serviceName}</p>
                          <p className="text-sm text-gray-600">Dari: {order.userName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            Rp {order.amount.toLocaleString('id-ID')}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'approved' ? 'bg-green-100 text-green-700' :
                            order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status === 'approved' ? 'Disetujui' :
                             order.status === 'rejected' ? 'Ditolak' :
                             'Menunggu'}
                          </span>
                        </div>
                      </div>
                      {order.status === 'approved' && (
                        <Link
                          to={`/chat/${order.userId}`}
                          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                        >
                          Kirim Pesan ke {order.userName}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Profile Status */}
          {!myProfile && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Profil Belum Dibuat</h3>
              <p className="text-yellow-800 mb-4">Buat profil Anda sekarang agar muncul di daftar kreator!</p>
              <Link to="/edit-profile" className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
                Buat Profil Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;

