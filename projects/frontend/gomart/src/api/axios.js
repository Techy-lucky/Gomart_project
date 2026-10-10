import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});



// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if it's an admin route
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/adminlogin';
            } else {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

// Add auth check function
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Add admin auth check function
export const isAdminAuthenticated = () => {
    return document.cookie.includes('adminToken');
};

export default instance; 