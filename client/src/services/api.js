import axios from 'axios';
import toast from 'react-hot-toast';

// Auth service
// Auth service
const AUTH_API_URL = 'http://127.0.0.1:8080/api';

export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data?.message || 'An error occurred');
    } else if (error.request) {
      toast.error('Cannot connect to server');
    } else {
      toast.error('Request error');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authEndpoints = {
  register: async (userData) => {
    const response = await authApi.post('/auth/register', userData);
    return response.data; // backend wraps user/token in response.data
  },

  login: async (email, password) => {
    const response = await authApi.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await authApi.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default { authEndpoints };
