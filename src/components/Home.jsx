import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');  // Lấy userId từ localStorage

    const [blogs, setBlogs] = useState([]);
    const [visibleComments, setVisibleComments] = useState({});
    const [fetchedComments, setFetchedComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${apiUrl}/blog/all`);

                // Kiểm tra lại giá trị authorId và đảm bảo nó có mặt
                const enrichedBlogs = response.data.map(blog => ({
                    ...blog,
                    likes: blog.likes ?? 0,
                    author: `User #${blog.authorId}`,
                    authorId: blog.authorId ?? null,  // Đảm bảo authorId luôn có giá trị hợp lệ
                }));

                setBlogs(enrichedBlogs);
                console.log('Blogs:', enrichedBlogs);  // Kiểm tra lại giá trị blogs
            } catch (error) {
                console.error('Lỗi tải blog:', error);
            }
        };

        fetchBlogs();
    }, []);

    const handleLike = async (blogId) => {
        try {
            var response = await axios.post(`${apiUrl}/like/action`,
                { blogId: blogId, userId: userId }  // Gửi userId để xác định người dùng đã like
            );

            var action = response.data;

            if (action === 'like') {
                console.log(`Blog ${blogId} đã được thích.`);

                setBlogs(blogs.map(blog =>
                    blog.id === blogId ? { ...blog, likeCount: blog.likeCount + 1 } : blog
                ));
            }
            else if (action === 'unlike') {
                console.log(`Blog ${blogId} đã được bỏ thích.`);

                setBlogs(blogs.map(blog =>
                    blog.id === blogId ? { ...blog, likeCount: blog.likeCount - 1 } : blog
                ));
            }
        } catch (error) {
            console.error('Lỗi like:', error);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        try {
            await axios.delete(`${apiUrl}/blog/delete/${blogId}`);
            setBlogs(blogs.filter(blog => blog.id !== blogId));
            console.log(`Blog ${blogId} đã được xóa.`);
        } catch (error) {
            console.error('Lỗi xóa blog:', error);
        }
    };

    const toggleCommentSection = async (blogId) => {
        // Nếu chưa hiện, thì fetch bình luận
        if (!visibleComments[blogId]) {
            try {
                const response = await axios.get(`${apiUrl}/api/comment/${blogId}`);
                setFetchedComments(prev => ({ ...prev, [blogId]: response.data }));
            } catch (error) {
                console.error('Lỗi fetch bình luận:', error);
            }
        }

        // Toggle hiển thị
        setVisibleComments(prev => ({ ...prev, [blogId]: !prev[blogId] }));
    };

    const handlePostComment = async (blogId) => {
        const commentText = newComment[blogId];
        if (!commentText) return;

        try {
            await axios.post(`${apiUrl}/api/v1/comment/${blogId}`, {
                comment: commentText,
            });

            // Làm mới comment sau khi đăng
            const response = await axios.get(`${apiUrl}/api/comment/${blogId}`);
            setFetchedComments(prev => ({ ...prev, [blogId]: response.data }));
            setNewComment(prev => ({ ...prev, [blogId]: '' }));
        } catch (error) {
            console.error('Lỗi đăng bình luận:', error);
        }
    };

    console.log('Current userId from localStorage:', userId);  // In ra userId để kiểm tra
    console.log('Blogs authorId:', blogs.map(blog => blog.authorId));  // In ra tất cả authorId của các blog

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">📝 Danh sách bài viết</h2>

                {blogs.length > 0 ? blogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                        <p className="text-gray-700 mb-2">{blog.content}</p>
                        <p className="text-sm text-gray-500 mb-4">🕒 {new Date(blog.createdAt).toLocaleString()}</p>

                        <div className="flex items-center mb-4 space-x-4">
                            <button
                                onClick={() => handleLike(blog.id)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer duration-200"
                            >
                                👍 Thích ({blog.likeCount})
                            </button>

                            <button
                                onClick={() => toggleCommentSection(blog.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer duration-200"
                            >
                                💬 Bình luận
                            </button>

                            {/* Nút xóa chỉ hiển thị nếu userId trùng với authorId */}
                            {blog.authorId !== null && blog.authorId === parseInt(userId) && (
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer duration-200"
                                    onClick={() => handleDeleteBlog(blog.id)}  // Chức năng xóa sẽ được triển khai sau
                                >
                                    🗑️ Xóa Blog
                                </button>
                            )}
                        </div>

                        {visibleComments[blog.id] && (
                            <div className="bg-gray-100 p-4 rounded-md mt-4">
                                <h4 className="font-semibold mb-2">💬 Bình luận:</h4>
                                {fetchedComments[blog.id]?.length > 0 ? (
                                    fetchedComments[blog.id].map((comment, idx) => (
                                        <p key={idx} className="text-gray-800 mb-1">- {comment}</p>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">Chưa có bình luận.</p>
                                )}

                                <div className="flex items-center gap-2 mt-4">
                                    <input
                                        type="text"
                                        value={newComment[blog.id] || ''}
                                        onChange={(e) =>
                                            setNewComment(prev => ({ ...prev, [blog.id]: e.target.value }))
                                        }
                                        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg"
                                        placeholder="Nhập bình luận..."
                                    />
                                    <button
                                        onClick={() => handlePostComment(blog.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer duration-200"
                                    >
                                        Đăng
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-600 mt-3">✍️ Tác giả: {blog.author}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">Chưa có blog nào.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
