import { apiClient } from '../config/api.config';
import * as SecureStore from 'expo-secure-store';

export class AuthService {
  // Backend'i uyandır (warm-up)
  static async wakeUpBackend() {
    try {
      console.log('🔄 Waking up backend...');
      const baseUrl = apiClient.defaults.baseURL?.replace('/api/v1', '') || '';
      
      // Simple fetch ile backend'i uyandır
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      await fetch(`${baseUrl}/health`, { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Backend is awake');
      return true;
    } catch (error) {
      console.log('⚠️ Backend wake-up check (might be already awake)');
      return false;
    }
  }

  static async register(email: string, password: string, fullName: string) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      fullName,
    });
    return response.data;
  }

  static async login(email: string, password: string) {
    try {
      console.log('🔐 Logging in:', email);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;
      console.log('✅ Login success:', user.email, user.role);

      if (!user || !accessToken) {
        throw new Error('Invalid response from server');
      }

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      console.log('💾 Tokens saved');

      return { user, accessToken };
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
      
      // Error'u yukarı fırlat ama önce token'ları temizle
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      throw error;
    }
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
      const token = await SecureStore.getItemAsync('accessToken');
      console.log('📱 Getting profile...');
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token (first 20 chars):', token?.substring(0, 20) + '...');
      
      const response = await apiClient.get('/users/profile', {
        timeout: 5000, // 5 saniye max
      });
      
      console.log('✅ Profile loaded:', response.data.email);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get profile error:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
      throw error;
    }
  }
}

