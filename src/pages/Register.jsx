import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Bergabung dengan Komiser</h1>
          <p className="text-gray-600 mb-10 text-lg">Pilih peran Anda untuk memulai perjalanan kreatif</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilihan Konsumen */}
            <Link to="/register/consumer">
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-3">Daftar sebagai Pembeli</h3>
                <p className="text-gray-600 mb-4">Saya ingin mencari jasa ilustrasi, desain, atau animasi untuk proyek saya.</p>
                <div className="text-sm text-blue-600 font-medium">Mulai mencari kreator →</div>
              </div>
            </Link>
            {/* Pilihan Artist */}
            <Link to="/register/artist">
              <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-green-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-green-600 mb-3">Daftar sebagai Artist</h3>
                <p className="text-gray-600 mb-4">Saya ingin menjual karya saya dan membangun portofolio profesional.</p>
                <div className="text-sm text-green-600 font-medium">Mulai menjual karya →</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;