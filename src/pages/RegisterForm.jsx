import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RegisterForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const isArtist = role === 'artist';

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      name: e.target.name.value,
      role: isArtist ? "Artist" : "Consumer"
    };
    
    // Simpan data registrasi
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push(formData);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Jika artist, buat creator profile (belum approved)
    if (isArtist) {
      const creators = JSON.parse(localStorage.getItem('creators') || '[]');
      const newCreator = {
        id: Date.now(),
        email: formData.email,
        name: formData.name,
        role: '',
        bio: '',
        category: '',
        skills: [],
        portfolio: [],
        rating: 0,
        reviews: 0,
        approved: false // Perlu approval admin
      };
      creators.push(newCreator);
      localStorage.setItem('creators', JSON.stringify(creators));
    }

    alert("Pendaftaran Berhasil! Silakan masuk dengan email dan password Anda.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Daftar {isArtist ? "Artist" : "Pembeli"}
            </h2>
            <p className="text-gray-500 text-sm">Buat akun untuk mulai {isArtist ? "menjual karya" : "mencari jasa"}</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Masukkan nama lengkap" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="nama@email.com" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Minimal 8 karakter" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg shadow-blue-500/30">
              Daftar Sekarang
            </button>
            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;