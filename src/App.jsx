import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Payment from './pages/Payment';
import Register from './pages/Register';
import RegisterForm from './pages/RegisterForm';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Checkout from './pages/Checkout';
import EditProfile from './pages/EditProfile';
import Categories from './pages/Categories';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:role" element={<RegisterForm />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;