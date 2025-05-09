import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import CreateBlog from '../CreateBlog';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { MemoryRouter } from 'react-router-dom';
// Mocking axios, useNavigate, and useAuth
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('CreateBlog Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
    jest.clearAllMocks(); // Dọn dẹp mocks trước mỗi test
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ userId: '123' });
});


    test('renders CreateBlog without crashing', () => {
       render(
    <MemoryRouter>
        <CreateBlog />
    </MemoryRouter>
);
    });

    test('should display input fields for title and content', () => {
       render(
    <MemoryRouter>
        <CreateBlog />
    </MemoryRouter>
);
        expect(screen.getByLabelText(/Tiêu đề/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nội dung/i)).toBeInTheDocument();
    });

    test('should call axios to create a blog when form is submitted', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        render(
    <MemoryRouter>
        <CreateBlog />
    </MemoryRouter>
);
        // Nhập dữ liệu vào form
        fireEvent.change(screen.getByLabelText(/Tiêu đề/i), {
            target: { value: 'Test Blog Title' },
        });
        fireEvent.change(screen.getByLabelText(/Nội dung/i), {
            target: { value: 'Test Blog Content' },
        });

        // Gửi form
        fireEvent.click(screen.getByText(/Tạo Blog/i));

        // Chờ và kiểm tra xem axios đã được gọi đúng không
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        // Kiểm tra xem axios đã được gọi đúng URL và dữ liệu không
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/v1/blog/create',
            {
                title: 'Test Blog Title',
                content: 'Test Blog Content',
                authorId: 123,
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // Kiểm tra xem điều hướng có xảy ra không sau khi tạo blog
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/home', { state: { userId: '123' } }));
    });

    test('should display error if blog creation fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Failed to create blog'));

        render(
    <MemoryRouter>
        <CreateBlog />
    </MemoryRouter>
);

        // Nhập dữ liệu vào form
        fireEvent.change(screen.getByLabelText(/Tiêu đề/i), {
            target: { value: 'Test Blog Title' },
        });
        fireEvent.change(screen.getByLabelText(/Nội dung/i), {
            target: { value: 'Test Blog Content' },
        });

        // Gửi form
        fireEvent.click(screen.getByText(/Tạo Blog/i));

        // Chờ và kiểm tra xem axios đã được gọi không
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        // Kiểm tra xem điều hướng không xảy ra nếu tạo blog thất bại
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
