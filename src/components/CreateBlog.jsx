import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CreateBlog = () => {
    const location = useLocation();
    const { userId } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const handleCreate = async (e) => {
        e.preventDefault();

        console.log('userId: ', userId);

        const blogData = {
            title: title,
            content: content,
            authorId: Number(userId)
        };

        try {
            console.log('userid: ', userId);
            await axios.post(`/backend/api/v1/blog/create`, blogData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Quay lại trang Home sau khi tạo thành công
            navigate('/home', { state: { userId } });
        } catch (error) {
            console.error('Không thể tạo blog', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-4">
                <form onSubmit={handleCreate} className="bg-white p-6 shadow-lg rounded-lg max-w-xl mx-auto">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">Tiêu đề</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700">Nội dung</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            rows="5"
                            required
                        />
                    </div>
                    {/*
                    <div className="mb-4">
                        <label className="block text-gray-700">Chọn hình ảnh</label>
                        <div className="flex items-center">
                            <label htmlFor="file-upload" className="cursor-pointer bg-gray-500 text-white py-1 px-2 rounded-lg hover:bg-gray-600 transition duration-200">
                                Chọn Hình
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {imageName && (
                                <span className="ml-4 text-gray-700">{imageName}</span>
                            )}
                        </div>
                    </div>
                    */}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 cursor-pointer"
                    >
                        Tạo Blog
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateBlog;
