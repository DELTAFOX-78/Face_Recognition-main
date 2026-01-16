import api from './api';
import { LoginFormData } from '../types/auth';
import { storage } from '../utils/storage';

export const authService = {
  login: async (role: 'student' | 'teacher', credentials: LoginFormData) => {
    const response = await api.post(`/${role}/login`, credentials);
    const { token, user } = response.data;
    storage.setToken(token);
    return { token, user };
  },

  verifyToken: async (token: string) => {
    try {
      await api.post('/auth/verify-token', { token });
      return true;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    const { token } = response.data;
    storage.setToken(token);
    return token;
  },

  logout: async () => {
    await api.post('/auth/logout');
    storage.removeToken();
  }
};