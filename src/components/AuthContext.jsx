import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') || null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || '';
    });

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
        if (isAuthenticated) {
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId); // ✅ Lưu userId vào localStorage
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('userId'); // ✅ Xóa nếu logout
        }
    }, [isAuthenticated, username, userId]);

    const login = (user, id) => {
        setIsAuthenticated(true);
        setUserId(id);
        setUsername(user);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setUserId(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
// Hook để các component sử dụng context
export const useAuth = () => useContext(AuthContext);
