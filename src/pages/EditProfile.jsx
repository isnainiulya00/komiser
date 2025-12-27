import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUpload, FaTrash } from 'react-icons/fa';

const EditProfile = () => {
  const navigate = useNavigate();
  
  // Ref untuk pemicu klik upload file
  const coverPhotoInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    category: '',
    skills: [],
    portfolio: [],
    profilePhoto: null,
    coverPhoto: null,
    social: {
      instagram: '',
      twitter: '',
      behance: ''
    }
  });

  const categories = ['Ilustrasi', 'Desain Web', 'Logo', 'Animasi', 'Design Grafis', 'Infografis', 'UI/UX'];
  const allSkills = ['Character Design', 'Digital Art', 'Concept Art', 'Illustration', 'UI Design', 'UX Research', 'Prototyping', 'Figma', 'Logo Design', 'Brand Identity', 'Typography', 'Graphic Design', '2D Animation', 'Motion Graphics', 'After Effects'];

  useEffect(() => {
    if (!user || user.role !== 'Artist') {
      navigate('/');
      return;
    }

    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const existingProfile = creators.find(c => c.email === user.email);
    
    if (existingProfile) {
      setFormData({
        ...existingProfile,
        social: existingProfile.social || { instagram: '', twitter: '', behance: '' }
      });
    } else {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user, navigate]);

  // Handle input teks dan select
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: { ...prev.social, [socialKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleImageUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1500000) { // Limit ~1.5MB agar localStorage tidak penuh
        alert("Ukuran file terlalu besar, pilih gambar di bawah 1.5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.role.trim() || !formData.category) {
      alert('Nama, Role, dan Kategori wajib diisi!');
      return;
    }
    
    try {
      const creators = JSON.parse(localStorage.getItem('creators') || '[]');
      const existingIndex = creators.findIndex(c => c.email === user.email);
      
      const creatorData = {
        ...formData,
        id: existingIndex >= 0 ? creators[existingIndex].id : Date.now(),
        email: user.email,
        approved: existingIndex >= 0 ? creators[existingIndex].approved : false
      };

      if (existingIndex >= 0) {
        creators[existingIndex] = creatorData;
      } else {
        creators.push(creatorData);
      }

      localStorage.setItem('creators', JSON.stringify(creators));
      alert('Profil berhasil disimpan!');
      navigate('/dashboard');
    } catch (error) {
      alert('Gagal menyimpan! Pastikan ukuran foto tidak terlalu besar.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Cover Photo - Area ini sekarang bisa diklik tanpa macet */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Cover</label>
            <div 
              className="h-48 bg-blue-100 rounded-xl relative overflow-hidden cursor-pointer group flex items-center justify-center"
              onClick={() => coverPhotoInputRef.current.click()}
            >
              {formData.coverPhoto ? (
                <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="text-blue-400 flex flex-col items-center">
                   <FaUpload size={30} />
                   <span className="text-sm mt-2">Klik untuk upload cover</span>
                </div>
              )}
              <input 
                type="file" ref={coverPhotoInputRef} className="hidden" 
                accept="image/*" onChange={(e) => handleImageUpload('coverPhoto', e)} 
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-6">
              <div 
                className="w-32 h-32 bg-gray-200 rounded-full relative overflow-hidden cursor-pointer flex items-center justify-center border-4 border-white shadow-inner"
                onClick={() => profilePhotoInputRef.current.click()}
              >
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">{formData.name[0]}</span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition">
                   <FaUpload className="text-white opacity-0 hover:opacity-100" />
                </div>
                <input 
                  type="file" ref={profilePhotoInputRef} className="hidden" 
                  accept="image/*" onChange={(e) => handleImageUpload('profilePhoto', e)} 
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Foto Profil</h3>
                <p className="text-sm text-gray-500">Klik lingkaran untuk mengubah foto</p>
              </div>
            </div>
          </div>

          {/* Informasi Dasar */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Informasi Dasar</h2>
            <div className="grid gap-4">
              <input
                type="text" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="Nama Lengkap" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text" name="role" value={formData.role} onChange={handleInputChange}
                placeholder="Role (Contoh: Digital Illustrator)" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="category" value={formData.category} onChange={handleInputChange}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <textarea
                name="bio" value={formData.bio} onChange={handleInputChange}
                placeholder="Bio Singkat" rows="3" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex gap-4 pb-10">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;