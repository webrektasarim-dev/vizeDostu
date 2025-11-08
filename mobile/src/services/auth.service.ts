import { apiClient } from '../config/api.config';
import * as SecureStore from 'expo-secure-store';

export class AuthService {
  static async register(email: string, password: string, fullName: string) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      fullName,
    });
    return response.data;
  }

  static async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const { user, accessToken, refreshToken } = response.data;

    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);

    return { user, accessToken };
  }

  static async logout() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  static async checkAuth() {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  static async getProfile() {
    try {
      const response = await apiClient.get('/users/profile', {
        timeout: 5000, // 5 saniye max
      });
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}

