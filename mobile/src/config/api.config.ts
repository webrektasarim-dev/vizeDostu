import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// PC'nin IP adresini kullan (iPhone için)
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.104:3000/api/v1' 
  : 'https://api.vizedostu.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // 8 saniye
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekle
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        await SecureStore.setItemAsync('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
