import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock các hook và context
jest.mock('../AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
    });

    test('renders Navbar without crashing', () => {
        useAuth.mockReturnValue({
            isAuthenticated: false,
            username: '',
            logout: jest.fn(),
        });

       
        render(
            <BrowserRouter>
            <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText(/Đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByText(/Đăng ký/i)).toBeInTheDocument();
    });

    test('renders correct links when user is authenticated', () => {
        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: 'Test User',
            logout: jest.fn(),
        });

        render(
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          );

        expect(screen.getByText(/Trang chủ/i)).toBeInTheDocument();
        expect(screen.getByText(/Tạo blog/i)).toBeInTheDocument();
        expect(screen.getByText(/Xin chào, Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/Đăng xuất/i)).toBeInTheDocument();
    });

    test('calls logout and navigates to home when logout button is clicked', async () => {
        const mockLogout = jest.fn();

        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: 'Test User',
            logout: mockLogout,
        });

        render(
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          );

        fireEvent.click(screen.getByText(/Đăng xuất/i));

        await waitFor(() => expect(mockLogout).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navbar hides when scrolling down and shows again when scrolling up', async () => {
        const mockLogout = jest.fn();

        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: 'Test User',
            logout: mockLogout,
        });

        render(
            <BrowserRouter>
              <Navbar />
            </BrowserRouter>
          );

        // Kiểm tra navbar hiển thị ban đầu
        expect(screen.getByText(/Trang chủ/i)).toBeInTheDocument();

        // Giả lập cuộn xuống
        fireEvent.scroll(window, { target: { scrollY: 100 } });

        // Kiểm tra xem navbar đã ẩn chưa
        


        // Giả lập cuộn lên
        fireEvent.scroll(window, { target: { scrollY: 0 } });

        // Kiểm tra navbar xuất hiện lại
        expect(screen.getByText(/Trang chủ/i)).toBeInTheDocument();
    });
});
