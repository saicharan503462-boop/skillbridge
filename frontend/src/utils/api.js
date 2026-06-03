import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');
    }
    return Promise.reject(err);
  }
);

export default api;
