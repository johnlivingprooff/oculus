import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Register function
    const register = async (username, email, password) => {
        try {
            const response = await fetch('http://localhost:3010/api/v1/users/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
    
            if (!response.ok) {
                // Handle HTTP errors
                const errorData = await response.json();
                throw new Error(errorData.errors || response.statusText);
            }
    
            const data = await response.json();
    
            // Assuming response contains accessToken and user data
            const { accessToken, user } = data;
    
            setAccessToken(accessToken);
            setUser(user);
            setIsAuthenticated(true);
    
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3010/api/v1/users/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors || response.statusText);
            }
    
            const data = await response.json();
            const { accessToken, user } = data;
    
            setAccessToken(accessToken);
            setUser(user);
            setIsAuthenticated(true);
    
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.post('/users/auth/logout');

            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);

            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || error.message);
        }
    };

    // Refresh token function
    const refreshToken = async () => {
        try {
            const response = await axios.post('/users/auth/refresh-token');
            const { accessToken } = response.data;

            setAccessToken(accessToken);
        } catch (error) {
            console.error('Token refresh failed:', error.response?.data?.message || error.message);
            logout();
        }
    };

    // Automatically refresh the token periodically
    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 15 * 60 * 1000); // 15 minutes

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, accessToken, register, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
