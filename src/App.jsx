import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import CreateBlog from './components/CreateBlog';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './components/AuthContext'; // thêm AuthProvider

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Navbar chỉ hiển thị khi không ở trang đăng nhập, hoặc tùy biến theo trạng thái */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
        <Route path="/create-blog" element={isAuthenticated ? <CreateBlog /> : <Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;