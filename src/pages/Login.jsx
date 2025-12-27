import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Special admin login (untuk testing)
    if (email === 'admin@komiser.com' && password === 'admin123') {
      const adminData = {
        name: 'Admin',
        email: 'admin@komiser.com',
        role: 'Admin'
      };
      localStorage.setItem('user', JSON.stringify(adminData));
      alert("Login berhasil! Selamat datang, Admin");
      navigate('/admin');
      window.location.reload();
      return;
    }
    
    // Cek dari data registrasi
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email);
    
    if (user) {
      // Simpan user yang login
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
      alert("Login berhasil! Selamat datang, " + user.name);
      navigate('/');
      window.location.reload();
    } else {
      alert("Email tidak terdaftar. Silakan daftar terlebih dahulu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h2>
          <p className="text-gray-500 text-sm">Masuk untuk mulai menjelajahi kreator</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
              placeholder="nama@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg shadow-blue-500/30">
            Masuk Sekarang
          </button>
          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Daftar di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}