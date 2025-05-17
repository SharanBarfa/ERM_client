import axios from 'axios';
import { API_URL, TOKEN_KEY, USER_KEY } from '../config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Must be false when using wildcard CORS
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.log('No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.log('Unauthorized access detected');
        // Only clear storage and redirect if not already on login or register page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          console.log('Redirecting to login');
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = '/login';
        } else {
          console.log('Already on login/register page, not redirecting');
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
