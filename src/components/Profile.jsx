import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
    const location = useLocation();
    const userId = location.state?.userId; // Lấy userId từ state
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <h1 className="text-xl font-semibold">Hồ Sơ {userId}</h1>
                <button
                    onClick={() => navigate('/', { state: { userId } })}
                    className="bg-blue-500 px-4 py-2 rounded-md text-white"
                >
                    Quay lại
                </button>
            </header>

            <main className="p-4">
                <h2 className="text-2xl font-semibold">Thông tin người dùng</h2>
                <p>Username: {userId}</p>
                <p>Email: user@example.com</p>
                {/* Thêm các thông tin khác nếu có */}
            </main>
        </div>
    );
}

export default Profile