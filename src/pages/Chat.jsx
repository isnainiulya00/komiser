import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Chat = () => {
  const { userId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [inputPesan, setInputPesan] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  
  // Load chat messages from localStorage
  const chatKey = userId ? `chat_${user.email}_${userId}` : `chat_${user.email}`;
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(chatKey);
    return saved ? JSON.parse(saved) : [
      { id: 1, sender: userId ? "other" : "artist", text: "Halo, ada yang bisa dibantu?" },
    ];
  });

  useEffect(() => {
    if (userId) {
      // Load target user info
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const found = registeredUsers.find(u => u.email === userId);
      setTargetUser(found);
      
      // Load existing messages
      const saved = localStorage.getItem(chatKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, [userId, chatKey]);

  const kirimPesan = (e) => {
    e.preventDefault();
    if (!inputPesan.trim()) return;

    // Tambahkan pesan kita
    const myMessage = { 
      id: Date.now(), 
      sender: "me", 
      text: inputPesan,
      timestamp: new Date().toISOString()
    };
    const newMessages = [...messages, myMessage];
    setMessages(newMessages);
    localStorage.setItem(chatKey, JSON.stringify(newMessages));
    setInputPesan("");

    // Simulasi balasan otomatis
    setTimeout(() => {
      const botReply = { 
        id: Date.now() + 1, 
        sender: userId ? "other" : "artist", 
        text: "Baik, terima kasih atas pesannya!",
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...newMessages, botReply];
      setMessages(updatedMessages);
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full p-4 flex-grow flex flex-col">
        {/* Chat Header */}
        {targetUser && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Chat dengan {targetUser.name}</h2>
          </div>
        )}
        
        {/* Area Chat */}
        <div className="flex-grow bg-white rounded-xl shadow-lg p-4 mb-4 overflow-y-auto h-96 border border-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Kirim */}
        <form onSubmit={kirimPesan} className="flex gap-2">
          <input 
            type="text" 
            className="flex-grow border rounded-full px-4 py-2 outline-none focus:border-primary"
            placeholder="Ketik pesan..."
            value={inputPesan}
            onChange={(e) => setInputPesan(e.target.value)}
          />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600">
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;