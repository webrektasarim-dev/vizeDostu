import { apiClient } from '../config/api.config';

export class ApplicationService {
  static async getActiveApplications() {
    try {
      const response = await apiClient.get('/applications');
      return response.data.filter((app: any) => 
        app.status !== 'COMPLETED' && app.status !== 'CANCELLED'
      );
    } catch (error) {
      console.error('Get applications error:', error);
      return [];
    }
  }

  static async getApplication(id: string) {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  }

  static async createApplication(data: any) {
    const response = await apiClient.post('/applications', data);
    return response.data;
  }

  static async deleteApplication(id: string) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  }
}

