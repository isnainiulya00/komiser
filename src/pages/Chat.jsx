import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaEnvelope } from 'react-icons/fa';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [inputPesan, setInputPesan] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Generate consistent chat key (sorted emails to ensure same key for both users)
  const getChatKey = (email1, email2) => {
    const emails = [email1, email2].sort();
    return `chat_${emails[0]}_${emails[1]}`;
  };
  
  const chatKey = userId ? getChatKey(user.email, userId) : null;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userId) {
      // Load target user info
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const found = registeredUsers.find(u => u.email === userId);
      setTargetUser(found);
      
      // Load existing messages
      if (chatKey) {
        const saved = localStorage.getItem(chatKey);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          // Initialize with welcome message
          const welcomeMsg = {
            id: Date.now(),
            senderEmail: user.role === 'Artist' ? userId : user.email,
            text: user.role === 'Artist' ? "Halo, ada yang bisa saya bantu?" : "Halo, saya tertarik dengan layanan Anda",
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMsg]);
          localStorage.setItem(chatKey, JSON.stringify([welcomeMsg]));
        }
      }
    }
  }, [userId, chatKey, user, navigate]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const kirimPesan = (e) => {
    e.preventDefault();
    if (!inputPesan.trim() || !chatKey) return;

    // Create message object
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

  // Check if message is from current user
  const isMyMessage = (message) => {
    return message.senderEmail === user.email;
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FaEnvelope className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Chat</h2>
            <p className="text-gray-600">Pilih seseorang untuk memulai percakapan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full p-4 flex-grow flex flex-col">
        {/* Chat Header */}
        {targetUser && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 mb-2 text-sm"
            >
              ← Kembali ke Dashboard
            </button>
            <h2 className="text-xl font-bold text-gray-900">Chat dengan {targetUser.name}</h2>
            <p className="text-sm text-gray-600">{targetUser.email}</p>
          </div>
        )}
        
        {/* Area Chat */}
        <div className="flex-grow bg-white rounded-xl shadow-lg p-4 mb-4 overflow-y-auto h-96 border border-gray-200">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Belum ada pesan. Mulai percakapan!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = isMyMessage(msg);
              return (
                <div key={msg.id} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                    isMe 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {!isMe && (
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName || 'User'}</p>
                    )}
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Kirim */}
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
    </div>
  );
};

export default Chat;