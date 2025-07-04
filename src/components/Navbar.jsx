import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import hook để lấy thông tin xác thực

const Navbar = () => {
    const [scrolling, setScrolling] = useState(false);
    const [prevScrollY, setPrevScrollY] = useState(0);
    const { isAuthenticated, username, logout } = useAuth(); // lấy dữ liệu từ context
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > prevScrollY && currentScrollY > 50) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
            setPrevScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollY]);

    const handleLogout = () => {
        logout();            // gọi context logout
        navigate('/');       // chuyển về trang login
    };

    return (
        <nav
            className={`bg-blue-600 p-4 sticky top-0 z-50 shadow-md transition-all duration-300 ease-in-out ${scrolling ? 'translate-y-[-100%] opacity-0' : 'opacity-90'}`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <span
                    onClick={() => navigate(isAuthenticated ? '/home' : '/')}
                    className="text-white text-xl font-semibold cursor-pointer"
                >
                    Blog App
                </span>
                <div className="space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/home" className="text-white hover:text-gray-300">Trang chủ</Link>
                            <Link to="/create-blog" className="text-white hover:text-gray-300">Tạo blog</Link>
                            <Link to="/profile" className="text-white hover:text-gray-300">Xin chào, {username}</Link>
                            <button onClick={handleLogout} className="text-white hover:text-gray-300">Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-white hover:text-gray-300">Đăng nhập</Link>
                            <Link to="/register" className="text-white hover:text-gray-300">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
