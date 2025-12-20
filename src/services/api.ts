import axios from 'axios';

export const API_BASE = 'https://dback-atwi.onrender.com';
// export const API_BASE = 'https://myfastapiapp.loca.lt';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000, // Increased to 60 seconds for slow backend cold-start
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
