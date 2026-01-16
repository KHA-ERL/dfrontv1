import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_BASE = API_URL;

const api = axios.create({
  baseURL: API_URL + '/api',
  timeout: 60000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Token is invalid or expired
      const token = localStorage.getItem('token');
      if (token) {
        console.warn('Received 401 error - token may be expired or invalid');
        localStorage.removeItem('token');
        // Reload the page to reset auth state
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
