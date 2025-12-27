import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUpload, FaTrash } from 'react-icons/fa';

const EditProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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

    // Load existing profile
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const existingProfile = creators.find(c => c.email === user.email);
    
    if (existingProfile) {
      setFormData({
        name: existingProfile.name || user.name,
        role: existingProfile.role || '',
        bio: existingProfile.bio || '',
        category: existingProfile.category || '',
        skills: existingProfile.skills || [],
        portfolio: existingProfile.portfolio || [],
        profilePhoto: existingProfile.profilePhoto || null,
        coverPhoto: existingProfile.coverPhoto || null,
        social: existingProfile.social || { instagram: '', twitter: '', behance: '' }
      });
    } else {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user, navigate]);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioAdd = () => {
    const title = prompt('Judul portfolio:');
    if (title) {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { id: Date.now(), title, image: null }]
      }));
    }
  };

  const handlePortfolioImageUpload = (portfolioId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          portfolio: prev.portfolio.map(p => 
            p.id === portfolioId ? { ...p, image: reader.result } : p
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioDelete = (portfolioId) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== portfolioId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.name || !formData.role || !formData.category) {
      alert('Harap isi semua field yang wajib (Nama, Role, Kategori)!');
      return;
    }
    
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const existingIndex = creators.findIndex(c => c.email === user.email);
    
    // Hitung rating dari reviews
    const existingId = existingIndex >= 0 ? creators[existingIndex].id : Date.now();
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const creatorReviews = reviews.filter(r => r.creatorId === existingId);
    const avgRating = creatorReviews.length > 0 
      ? creatorReviews.reduce((sum, r) => sum + r.rating, 0) / creatorReviews.length 
      : 0;
    
    const creatorData = {
      id: existingId,
      email: user.email,
      name: formData.name.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim() || '',
      category: formData.category,
      skills: formData.skills || [],
      portfolio: formData.portfolio || [],
      profilePhoto: formData.profilePhoto || null,
      coverPhoto: formData.coverPhoto || null,
      social: formData.social || { instagram: '', twitter: '', behance: '' },
      rating: parseFloat(avgRating.toFixed(1)),
      reviews: creatorReviews.length,
      approved: existingIndex >= 0 ? creators[existingIndex].approved : false // Tetap pertahankan status approved
    };

    if (existingIndex >= 0) {
      creators[existingIndex] = creatorData;
    } else {
      creators.push(creatorData);
    }

    localStorage.setItem('creators', JSON.stringify(creators));
    alert('Profil berhasil disimpan!');
    navigate('/dashboard');
    window.location.reload(); // Reload untuk update data
  };

  if (!user || user.role !== 'Artist') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profil</h1>
          <p className="text-gray-600">Kelola profil dan portfolio Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Photo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Cover</label>
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl relative overflow-hidden">
              {formData.coverPhoto && (
                <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition cursor-pointer z-10" style={{ pointerEvents: 'auto' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('coverPhoto', e)}
                  className="hidden"
                />
                <FaUpload className="text-white text-2xl" style={{ pointerEvents: 'none' }} />
              </label>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full relative overflow-hidden">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition cursor-pointer z-10" style={{ pointerEvents: 'auto' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('profilePhoto', e)}
                    className="hidden"
                  />
                  <FaUpload className="text-white" style={{ pointerEvents: 'none' }} />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Upload foto profil Anda</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role/Spesialisasi</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleInputChange}
                  placeholder="Contoh: Illustrator Karakter"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ceritakan tentang diri Anda..."
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.skills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
              <button
                type="button"
                onClick={handlePortfolioAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                + Tambah Portfolio
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.portfolio.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="h-32 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <label className="absolute inset-0 flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePortfolioImageUpload(item.id, e)}
                          className="hidden"
                        />
                        <FaUpload className="text-gray-400 text-2xl" />
                      </label>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <button
                      type="button"
                      onClick={() => handlePortfolioDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  name="social.instagram"
                  value={formData.social?.instagram || ''}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="text"
                  name="social.twitter"
                  value={formData.social?.twitter || ''}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Behance</label>
                <input
                  type="text"
                  name="social.behance"
                  value={formData.social?.behance || ''}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
            >
              Simpan Profil
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
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

