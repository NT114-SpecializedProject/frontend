import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // 🛡️ Import AuthContext

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth(); // 🛡️ Sử dụng AuthContext
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('apiUrl: ', apiUrl);
            const response = await axios.post(`${apiUrl}/user/login`, {
                email,
                password
            });

            const userId = response.data.id;
            console.log('userId: ', userId);
            const fullName = response.data.fullName;
            login(fullName, userId); // 🛡️ Gọi hàm login từ AuthContext
            setMessage(`Đăng nhập tài khoản thành công!`);
            navigate('/home');
        } catch (error) {
            setMessage(error.response?.status === 401 ? 'Sai tài khoản hoặc mật khẩu' : 'Lỗi kết nối đến máy chủ');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold text-lg">Tài khoản</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold text-lg">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Chưa có tài khoản?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                    >
                        Đăng ký
                    </button>
                </p>

                {message && <p className="mt-4 text-center text-red-600 font-medium">{message}</p>}
            </div>
        </div>
    );
}

export default Login;
