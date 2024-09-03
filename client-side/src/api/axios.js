import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create an axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://oculus-server.onrender.com/api/v1', // Backend base URL
    withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to add the authorization header
api.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuth().useContext();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await useAuth().refreshToken(); // Try refreshing the token
                return api(originalRequest); // Retry the original request with the new token
            } catch (refreshError) {
                useAuth().logout(); // If refresh fails, log out
            }
        }

        return Promise.reject(error);
    }
);

export default api;
