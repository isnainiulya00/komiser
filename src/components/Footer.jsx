import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-sm text-center">
      <div className="flex justify-center space-x-4 mb-4">
        <a href="#" className="hover:text-white transition">Tentang Kami</a>
        <span>|</span>
        <a href="#" className="hover:text-white transition">Bantuan</a>
        <span>|</span>
        <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
      </div>
      <p className="flex items-center justify-center justify-center gap-1">
        © 2025 Komiser. Dibuat dengan <FaHeart className="text-red-500 mx-1" /> di Indonesia.
      </p>
    </footer>
  );
};

export default Footer;