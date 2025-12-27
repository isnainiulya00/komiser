import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [status, setStatus] = useState("idle"); // idle, processing, success
  const [service, setService] = useState(null);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load creator from localStorage first
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const foundCreator = creators.find(c => c.id === parseInt(id));
    
    if (foundCreator) {
      setCreator(foundCreator);
    } else if (location.state && location.state.creator) {
      setCreator(location.state.creator);
    } else {
      // Fallback
      const defaultData = {
        1: { id: 1, name: "Budi Santoso", role: "Illustrator Karakter" },
        2: { id: 2, name: "Citra Lestari", role: "UI/UX Designer" },
        3: { id: 3, name: "Andi Wijaya", role: "Desainer Logo" },
        4: { id: 4, name: "Siti Aminah", role: "Animator 2D" },
      };
      setCreator(defaultData[id] || defaultData[1]);
    }

    if (location.state && location.state.service) {
      setService(location.state.service);
    }
  }, [user, navigate, location, id]);

  const handleBayar = () => {
    setStatus("processing");
    
    // Simulasi delay bank (3 detik)
    setTimeout(() => {
      setStatus("success");
      
      // Simpan payment untuk admin approval
      const payment = {
        id: Date.now(),
        userId: user.email,
        userName: user.name,
        creatorId: parseInt(id),
        creatorName: creator?.name || 'Unknown',
        serviceName: service?.name || 'Unknown',
        amount: service?.price || 0,
        status: 'pending',
        date: new Date().toISOString()
      };

      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push(payment);
      localStorage.setItem('payments', JSON.stringify(payments));

      alert("Pembayaran berhasil! Menunggu persetujuan admin.");
      navigate('/dashboard');
    }, 3000);
  };

  if (!user || !service) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pembayaran</h2>
          
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kreator</span>
                <span className="font-medium text-gray-900">{creator?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layanan</span>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  Rp {service.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* QRIS Code */}
          {status === "idle" && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Scan QRIS untuk Membayar</h3>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-600">QRIS Code</p>
                      <p className="text-xs text-gray-500 mt-1">Scan dengan aplikasi e-wallet</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Gunakan aplikasi e-wallet (GoPay, OVO, DANA, dll) untuk scan QRIS
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "processing" && (
            <div className="mb-6 text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memproses pembayaran...</p>
            </div>
          )}

          {status === "success" && (
            <div className="mb-6 text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-lg font-semibold text-gray-900 mb-2">Pembayaran Berhasil!</p>
              <p className="text-gray-600">Pesanan Anda sedang menunggu persetujuan admin</p>
            </div>
          )}

          {/* Payment Button */}
          <button 
            onClick={handleBayar}
            disabled={status === "processing" || status === "success"}
            className={`w-full py-4 rounded-xl font-semibold text-white transition shadow-lg ${
              status === "processing" || status === "success"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            }`}
          >
            {status === "idle" && "Konfirmasi Pembayaran (QRIS)"}
            {status === "processing" && "Memproses..."}
            {status === "success" && "Pembayaran Berhasil"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan pembayaran
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;