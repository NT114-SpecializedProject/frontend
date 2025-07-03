import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Mật khẩu không khớp!');
            return;
        }

        try {
            const res = await axios.post(`${apiUrl}/user/register`, {
                username,
                password,
            });

            const userId = res.data.userId;
            setMessage('Đăng ký thành công!');
            navigate('/home', { state: { userId } }); // 🔄 Redirect có userId
        } catch (error) {
            setMessage('Đăng ký không thành công. Tài khoản đã tồn tại');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Đăng ký</h2>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold text-lg">Tài khoản</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                    <div>
                        <label className="block text-gray-700 font-semibold text-lg">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 cursor-pointer"
                    >
                        Đăng ký
                    </button>

                    <p className="text-center text-sm mt-4 text-gray-600">
                        Đã có tài khoản?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    </p>
                </form>

                {message && <p className="mt-4 text-center text-red-600 font-medium">{message}</p>}
            </div>
        </div>
    );
}

export default Register;
