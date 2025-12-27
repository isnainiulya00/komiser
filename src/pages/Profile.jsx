import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaEnvelope, FaInstagram, FaTwitter, FaBehance, FaShoppingCart } from 'react-icons/fa';

// Rating Form Component tetap sama seperti milikmu
const RatingForm = ({ creatorId, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Pilih rating terlebih dahulu!');
      return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push({
      creatorId: creatorId,
      userId: user?.email || 'anonim',
      userName: user?.name || 'User',
      rating,
      review,
      date: new Date().toISOString()
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    alert('Terima kasih atas rating dan ulasan Anda!');
    setRating(0);
    setReview('');
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new Event('reviewsUpdated'));
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              <FaStar className="fill-current" />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ulasan</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          rows="4"
          placeholder="Tulis ulasan Anda di sini..."
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Kirim Rating</button>
        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">Batal</button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [inputPesan, setInputPesan] = useState("");
  const [messages, setMessages] = useState([]);
  const [creator, setCreator] = useState(null);

  const loadCreator = () => {
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    
    // Perbaikan: Mencari ID dengan lebih teliti (string vs number)
    let foundCreator = creators.find(c => String(c.id) === String(id));
    
    if (!foundCreator) {
      const defaultCreators = [
        { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", rating: 4.9, category: "Ilustrasi", approved: true },
        { id: 2, name: "Citra Lestari", role: "UI/UX Designer", rating: 5.0, category: "Desain Web", approved: true },
        { id: 3, name: "Andi Wijaya", role: "Desainer Logo", rating: 4.8, category: "Logo", approved: true },
        { id: 4, name: "Siti Aminah", role: "Animator 2D", rating: 4.7, category: "Animasi", approved: true },
      ];
      foundCreator = defaultCreators.find(c => String(c.id) === String(id));
    }
    
    if (foundCreator) {
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const creatorReviews = reviews.filter(r => String(r.creatorId) === String(id));
      const avgRating = creatorReviews.length > 0 
        ? creatorReviews.reduce((sum, r) => sum + r.rating, 0) / creatorReviews.length 
        : foundCreator.rating || 0;
      
      setCreator({
        ...foundCreator,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: creatorReviews.length || foundCreator.reviews || 0,
        bio: foundCreator.bio || 'Tidak ada bio.',
        skills: foundCreator.skills || [],
        portfolio: foundCreator.portfolio || [],
        social: foundCreator.social || { instagram: '', twitter: '', behance: '' }
      });
    }
  };

  useEffect(() => {
    loadCreator();
    const handleReviewsUpdate = () => loadCreator();
    window.addEventListener('reviewsUpdated', handleReviewsUpdate);
    return () => window.removeEventListener('reviewsUpdated', handleReviewsUpdate);
  }, [id]);

  // Handle Chat Logic
  const getChatKey = (email1, email2) => {
    const emails = [email1, email2].sort();
    return `chat_${emails[0]}_${emails[1]}`;
  };

  useEffect(() => {
    if (creator?.email && user?.email && user.role !== 'Artist') {
      const chatKey = getChatKey(user.email, creator.email);
      const saved = localStorage.getItem(chatKey);
      if (saved) setMessages(JSON.parse(saved));
    }
  }, [creator, user]);

  const kirimPesan = (e) => {
    e.preventDefault();
    if (!inputPesan.trim() || !creator?.email || !user?.email) return;

    const chatKey = getChatKey(user.email, creator.email);
    const newMessage = {
      id: Date.now(),
      senderEmail: user.email,
      senderName: user.name,
      text: inputPesan.trim(),
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    localStorage.setItem(chatKey, JSON.stringify(newMessages));
    setInputPesan("");
  };

  // Mencegah Layar Putih: Jika creator belum ketemu, jangan render konten utama
  if (!creator) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center mt-20">Memuat profil...</div>
    </div>
  );

  const isOwnProfile = user && user.role === 'Artist' && creator.email === user.email;
  const canOrder = user && user.role !== 'Artist';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {creator.coverPhoto && <img src={creator.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
          </div>
          
          <div className="px-8 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-6">
                {creator.profilePhoto ? (
                  <img src={creator.profilePhoto} alt={creator.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-gray-700">
                    {creator.name ? creator.name.charAt(0) : 'A'}
                  </div>
                )}
                
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{creator.role}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="font-semibold text-gray-800">{creator.rating}</span>
                      <span className="text-gray-500 ml-1">({creator.reviewsCount || 0} reviews)</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{creator.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{creator.bio}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {creator.skills?.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creator.portfolio?.length > 0 ? (
                  creator.portfolio.map((item) => (
                    <div key={item.id} className="rounded-xl overflow-hidden shadow-md">
                      {item.image ? <img src={item.image} alt={item.title} className="h-48 w-full object-cover" /> : <div className="h-48 bg-gray-200" />}
                      <div className="p-4"><h3 className="font-semibold">{item.title}</h3></div>
                    </div>
                  ))
                ) : <p className="text-gray-500">Belum ada portfolio</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {isOwnProfile ? (
              <Link to="/edit-profile" className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-semibold">Edit Profil</Link>
            ) : canOrder ? (
              <div className="space-y-6">
                <Link to={`/checkout/${id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg">
                  <FaShoppingCart /> Pesan Layanan
                </Link>
                {/* Bagian Chat */}
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[500px]">
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaEnvelope className="text-blue-600" /> Chat</h2>
                   <div className="flex-grow bg-gray-50 rounded-xl p-4 overflow-y-auto space-y-3 mb-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}>
                          <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.senderEmail === user.email ? 'bg-blue-600 text-white' : 'bg-white shadow-sm'}`}>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                   <form onSubmit={kirimPesan} className="flex gap-2">
                      <input value={inputPesan} onChange={(e) => setInputPesan(e.target.value)} placeholder="Tanya sesuatu..." className="flex-grow border rounded-xl px-4 py-2 outline-none" />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl">Kirim</button>
                   </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;