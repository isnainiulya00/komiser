import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCheck, FaTimes, FaUser, FaCreditCard } from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [creators, setCreators] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('artists');

  const loadData = () => {
    const creatorsData = JSON.parse(localStorage.getItem('creators') || '[]');
    setCreators(creatorsData);

    const paymentsData = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(paymentsData);
  };

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const handleApproveArtist = (creatorId) => {
    const updatedCreators = creators.map(c => 
      c.id === creatorId ? { ...c, approved: true } : c
    );
    setCreators(updatedCreators);
    localStorage.setItem('creators', JSON.stringify(updatedCreators));
    alert('Artist berhasil disetujui!');
    loadData(); // Reload data
  };

  const handleRejectArtist = (creatorId) => {
    if (confirm('Yakin ingin menolak artist ini?')) {
      const updatedCreators = creators.filter(c => c.id !== creatorId);
      setCreators(updatedCreators);
      localStorage.setItem('creators', JSON.stringify(updatedCreators));
      alert('Artist ditolak dan dihapus.');
      loadData(); // Reload data
    }
  };

  const handleApprovePayment = (paymentId) => {
    const updatedPayments = payments.map(p => 
      p.id === paymentId ? { ...p, status: 'approved' } : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    alert('Pembayaran disetujui!');
  };

  const handleRejectPayment = (paymentId) => {
    if (confirm('Yakin ingin menolak pembayaran ini?')) {
      const updatedPayments = payments.map(p => 
        p.id === paymentId ? { ...p, status: 'rejected' } : p
      );
      setPayments(updatedPayments);
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
      alert('Pembayaran ditolak.');
    }
  };

  if (!user || user.role !== 'Admin') return null;

  const pendingArtists = creators.filter(c => !c.approved);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola artist dan pembayaran</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'artists'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaUser className="inline mr-2" />
            Artist ({pendingArtists.length} pending)
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'payments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaCreditCard className="inline mr-2" />
            Pembayaran ({pendingPayments.length} pending)
          </button>
        </div>

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Daftar Artist</h2>
            {pendingArtists.length > 0 ? (
              <div className="space-y-4">
                {pendingArtists.map((creator) => (
                  <div key={creator.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {creator.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                          <p className="text-gray-600">{creator.role}</p>
                          <p className="text-sm text-gray-500">{creator.category}</p>
                          <p className="text-sm text-gray-500">{creator.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveArtist(creator.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <FaCheck />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRejectArtist(creator.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <FaTimes />
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaUser className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>Tidak ada artist yang menunggu persetujuan</p>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Daftar Pembayaran</h2>
            {pendingPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Pembayaran #{payment.id}</h3>
                        <p className="text-gray-600">Dari: {payment.userName}</p>
                        <p className="text-gray-600">Ke: {payment.creatorName}</p>
                        <p className="text-gray-600">Layanan: {payment.serviceName}</p>
                        <p className="text-lg font-bold text-blue-600">
                          Rp {payment.amount.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePayment(payment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <FaCheck />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRejectPayment(payment.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <FaTimes />
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaCreditCard className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>Tidak ada pembayaran yang menunggu persetujuan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

