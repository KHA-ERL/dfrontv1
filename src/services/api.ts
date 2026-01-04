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
    // Don't automatically redirect - let components handle auth errors
    // This prevents false logouts when optional API calls fail
    return Promise.reject(error);
  }
);

export default api;
