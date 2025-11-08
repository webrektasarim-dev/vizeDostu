import { apiClient } from '../config/api.config';

export class PassportService {
  static async getPassports() {
    try {
      const response = await apiClient.get('/passports');
      return response.data;
    } catch (error) {
      console.error('Get passports error:', error);
      return [];
    }
  }

  static async createPassport(data: any) {
    const response = await apiClient.post('/passports', data);
    return response.data;
  }

  static async updatePassport(id: string, data: any) {
    const response = await apiClient.put(`/passports/${id}`, data);
    return response.data;
  }
}

