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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/auth/register`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // If you need to include cookies
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

            console.log('Login successful:', user);
            console.log('Access Token:', accessToken);
    
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // If you need to include cookies
                body: JSON.stringify({}),
            });
    
            if (!response.ok) {
                throw new Error(`Logout failed with status: ${response.status}`);
            }
    
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
    
            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };
    
    const refreshToken = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // If you need to include cookies (both for login, refresh token, logout)
            });
    
            if (!response.ok) {
                throw new Error(`Token refresh failed with status: ${response.status}`);
            }
    
            const data = await response.json();
            const { accessToken } = data;
    
            setAccessToken(accessToken);
        } catch (error) {
            console.error('Token refresh failed:', error.message);
            logout();
        }
    };

    // Automatically refresh the token periodically
    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 3 * 24 * 60 * 60 * 1000); // 15 minutes

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
