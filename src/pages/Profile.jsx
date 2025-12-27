import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaEnvelope, FaInstagram, FaTwitter, FaBehance, FaShoppingCart } from 'react-icons/fa';

// Rating Form Component
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
      userId: user.email,
      userName: user.name,
      rating,
      review,
      date: new Date().toISOString()
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    alert('Terima kasih atas rating dan ulasan Anda!');
    setRating(0);
    setReview('');
    onClose();
    window.location.reload();
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
              className={`text-3xl transition ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
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
        <button
          type="submit"
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Kirim Rating
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [inputPesan, setInputPesan] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "artist", text: "Halo, ada yang bisa dibantu?" },
  ]);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    // Load creator from localStorage
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const foundCreator = creators.find(c => c.id === parseInt(id));
    
    if (foundCreator) {
      // Hitung rating dari reviews
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const creatorReviews = reviews.filter(r => r.creatorId === parseInt(id));
      const avgRating = creatorReviews.length > 0 
        ? creatorReviews.reduce((sum, r) => sum + r.rating, 0) / creatorReviews.length 
        : foundCreator.rating || 0;
      
      setCreator({
        ...foundCreator,
        rating: parseFloat(avgRating.toFixed(1)),
        reviews: creatorReviews.length || foundCreator.reviews || 0
      });
    } else {
      // Fallback to default data
      const defaultData = {
        1: { 
          id: 1,
          name: "Budi Santoso", 
          role: "Illustrator Karakter", 
          rating: 4.9, 
          reviews: 120,
          category: "Ilustrasi",
          bio: "Saya adalah illustrator dengan pengalaman lebih dari 5 tahun dalam membuat karakter untuk game dan komik. Spesialisasi dalam gaya anime dan semi-realistic.",
          skills: ["Character Design", "Digital Art", "Concept Art", "Illustration"],
          portfolio: [
            { id: 1, title: "Character Design Project", image: null },
            { id: 2, title: "Game Character", image: null },
            { id: 3, title: "Comic Character", image: null },
          ],
          social: {
            instagram: "@budisantoso",
            twitter: "@budisantoso",
            behance: "budisantoso"
          }
        },
        2: { 
          id: 2,
          name: "Citra Lestari", 
          role: "UI/UX Designer", 
          rating: 5.0, 
          reviews: 88,
          category: "Desain Web",
          bio: "UI/UX Designer dengan fokus pada user experience yang intuitif dan desain yang modern. Pernah bekerja dengan berbagai startup teknologi.",
          skills: ["UI Design", "UX Research", "Prototyping", "Figma"],
          portfolio: [
            { id: 1, title: "E-commerce App", image: null },
            { id: 2, title: "Dashboard Design", image: null },
          ],
          social: {
            instagram: "@citralestari",
            twitter: "@citralestari",
            behance: "citralestari"
          }
        },
        3: { 
          id: 3,
          name: "Andi Wijaya", 
          role: "Desainer Logo", 
          rating: 4.8, 
          reviews: 210,
          category: "Logo",
          bio: "Brand identity designer dengan pengalaman 8 tahun. Membantu berbagai brand membangun identitas visual yang kuat dan memorable.",
          skills: ["Logo Design", "Brand Identity", "Typography", "Graphic Design"],
          portfolio: [
            { id: 1, title: "Tech Startup Logo", image: null },
            { id: 2, title: "Restaurant Branding", image: null },
            { id: 3, title: "Fashion Brand", image: null },
          ],
          social: {
            instagram: "@andiwijaya",
            twitter: "@andiwijaya",
            behance: "andiwijaya"
          }
        },
        4: { 
          id: 4,
          name: "Siti Aminah", 
          role: "Animator 2D", 
          rating: 4.7, 
          reviews: 95,
          category: "Animasi",
          bio: "2D Animator dengan spesialisasi dalam animasi karakter dan motion graphics. Pernah mengerjakan proyek untuk iklan dan konten digital.",
          skills: ["2D Animation", "Motion Graphics", "After Effects", "Character Animation"],
          portfolio: [
            { id: 1, title: "Character Animation", image: null },
            { id: 2, title: "Motion Graphics", image: null },
          ],
          social: {
            instagram: "@sitianimah",
            twitter: "@sitianimah",
            behance: "sitianimah"
          }
        }
      };
      setCreator(defaultData[id] || defaultData[1]);
    }
  }, [id]);

  if (!creator) return null;

  // Check if user is viewing their own profile
  const isOwnProfile = user && user.role === 'Artist' && creator.email === user.email;
  const canOrder = user && user.role !== 'Artist';

  const kirimPesan = (e) => {
    e.preventDefault();
    if (!inputPesan.trim()) return;

    const myMessage = { id: Date.now(), sender: "me", text: inputPesan };
    setMessages((prev) => [...prev, myMessage]);
    setInputPesan("");

    setTimeout(() => {
      const botReply = { id: Date.now() + 1, sender: "artist", text: "Baik kak, silakan kirim referensinya ya!" };
      setMessages((prev) => [...prev, botReply]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Profile */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {creator.coverPhoto && (
              <img src={creator.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-6">
                {/* Avatar */}
                {creator.profilePhoto ? (
                  <img 
                    src={creator.profilePhoto} 
                    alt={creator.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover relative z-20"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-gray-700 relative z-20">
                    {creator.name.charAt(0)}
                  </div>
                )}
                
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{creator.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{creator.role}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="font-semibold text-gray-800">{creator.rating}</span>
                      <span className="text-gray-500 ml-1">({creator.reviews} reviews)</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {creator.category}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-100 text-pink-600 transition">
                  <FaInstagram />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 text-blue-600 transition">
                  <FaTwitter />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-200 text-blue-700 transition">
                  <FaBehance />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{creator.bio}</p>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creator.portfolio && creator.portfolio.length > 0 ? (
                  creator.portfolio.map((item) => (
                    <div key={item.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{item.title}</span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Belum ada portfolio</p>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Rating & Ulasan</h2>
                {canOrder && !isOwnProfile && (
                  <button
                    onClick={() => {
                      const modal = document.getElementById('ratingModal');
                      if (modal) modal.classList.remove('hidden');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Beri Rating
                  </button>
                )}
              </div>
              {(() => {
                const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
                const creatorReviews = reviews.filter(r => r.creatorId === parseInt(id));
                
                if (creatorReviews.length === 0) {
                  return <p className="text-gray-500">Belum ada ulasan</p>;
                }
                
                return (
                  <div className="space-y-4">
                    {creatorReviews.map((review, idx) => (
                      <div key={idx} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-900">{review.userName}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Rating Modal */}
            {canOrder && !isOwnProfile && (
              <div id="ratingModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Beri Rating & Ulasan</h3>
                  <RatingForm creatorId={parseInt(id)} onClose={() => {
                    const modal = document.getElementById('ratingModal');
                    if (modal) modal.classList.add('hidden');
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Chat or Order Button */}
          <div className="lg:col-span-1">
            {isOwnProfile ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Anda</h2>
                <Link 
                  to="/edit-profile"
                  className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Edit Profil
                </Link>
              </div>
            ) : canOrder ? (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <Link 
                    to={`/checkout/${id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                  >
                    <FaShoppingCart />
                    Pesan Layanan
                  </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[500px]">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" />
                    Chat dengan {creator.name.split(' ')[0]}
                  </h2>
              
              {/* Chat Messages */}
              <div className="flex-grow bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg.sender === 'me' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={kirimPesan} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ketik pesan..."
                  value={inputPesan}
                  onChange={(e) => setInputPesan(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
                >
                  Kirim
                </button>
              </form>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-600 text-center py-8">
                  Login sebagai pembeli untuk memesan layanan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

