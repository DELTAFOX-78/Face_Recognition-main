import axios from 'axios';
import { storage } from '../utils/storage';
import { config } from '../config/constants';

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (role: 'student' | 'teacher', credentials: { username: string; password: string }) => {
    // For demo purposes, always succeed with mock data
    if (config.USE_MOCK_SERVICES) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return {
        token: 'mock-token',
        user: {
          id: '1',
          name: credentials.username,
        },
      };
    }
    
    const response = await api.post(`/${role}/login`, credentials);
    return response.data;
  },
};

export default api;