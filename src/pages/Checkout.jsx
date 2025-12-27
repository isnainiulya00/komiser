import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaCheck } from 'react-icons/fa';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [selectedService, setSelectedService] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRating, setShowRating] = useState(false);

  // Dummy services
  const services = [
    { id: 1, name: "Design Grafis", price: 500000, description: "Desain grafis untuk kebutuhan bisnis atau personal" },
    { id: 2, name: "Logo Design", price: 750000, description: "Desain logo profesional untuk brand Anda" },
    { id: 3, name: "UI/UX Design", price: 2000000, description: "Desain interface dan user experience untuk aplikasi" },
    { id: 4, name: "Ilustrasi Karakter", price: 1000000, description: "Ilustrasi karakter custom sesuai kebutuhan" },
    { id: 5, name: "Infografis", price: 600000, description: "Desain infografis yang menarik dan informatif" },
    { id: 6, name: "Animasi 2D", price: 3000000, description: "Animasi 2D untuk video atau konten digital" },
  ];

  const [creator, setCreator] = useState(null);

  useEffect(() => {
    // Load creator from localStorage
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const foundCreator = creators.find(c => c.id === parseInt(id));
    
    if (foundCreator) {
      setCreator(foundCreator);
    } else {
      // Fallback to default data
      const defaultData = {
        1: { id: 1, name: "Budi Santoso", role: "Illustrator Karakter", category: "Ilustrasi" },
        2: { id: 2, name: "Citra Lestari", role: "UI/UX Designer", category: "Desain Web" },
        3: { id: 3, name: "Andi Wijaya", role: "Desainer Logo", category: "Logo" },
        4: { id: 4, name: "Siti Aminah", role: "Animator 2D", category: "Animasi" },
      };
      setCreator(defaultData[id] || defaultData[1]);
    }
  }, [id]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!creator) return null;

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleCheckout = () => {
    if (!selectedService) {
      alert('Pilih layanan terlebih dahulu!');
      return;
    }
    if (!creator) {
      alert('Data creator tidak ditemukan!');
      return;
    }
    navigate(`/payment/${id}`, { 
      state: { 
        service: selectedService,
        creator: creator 
      } 
    });
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert('Pilih rating terlebih dahulu!');
      return;
    }
    
    // Simpan rating dan review
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push({
      creatorId: parseInt(id),
      userId: user.email,
      userName: user.name,
      rating,
      review,
      date: new Date().toISOString()
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    alert('Terima kasih atas rating dan ulasan Anda!');
    setShowRating(false);
    setRating(0);
    setReview('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/profile/${id}`} className="text-blue-600 hover:text-blue-700 font-medium">
            ← Kembali ke Profil
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Service Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                {creator.profilePhoto ? (
                  <img 
                    src={creator.profilePhoto} 
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {creator.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                  <p className="text-gray-600">{creator.role}</p>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pilih Layanan</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          {selectedService?.id === service.id && (
                            <FaCheck className="text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-600">
                          Rp {service.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Rating & Ulasan</h3>
                {!showRating && (
                  <button
                    onClick={() => setShowRating(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Beri Rating
                  </button>
                )}
              </div>

              {showRating && (
                <div className="border-t pt-4 mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
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
                      onClick={handleSubmitRating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Kirim Rating
                    </button>
                    <button
                      onClick={() => {
                        setShowRating(false);
                        setRating(0);
                        setReview('');
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="mt-6 space-y-4">
                {JSON.parse(localStorage.getItem('reviews') || '[]')
                  .filter(r => r.creatorId === parseInt(id))
                  .slice(0, 3)
                  .map((reviewItem, idx) => (
                    <div key={idx} className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < reviewItem.rating ? 'fill-current' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{reviewItem.userName}</span>
                      </div>
                      <p className="text-gray-700">{reviewItem.review}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              {selectedService ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Layanan</span>
                      <span className="font-medium text-gray-900">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harga</span>
                      <span className="font-bold text-gray-900">
                        Rp {selectedService.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-blue-600">
                          Rp {selectedService.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                  >
                    Lanjutkan ke Pembayaran
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Pilih layanan terlebih dahulu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

