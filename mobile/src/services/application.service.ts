import { apiClient } from '../config/api.config';
import { AuthService } from './auth.service';

export class ApplicationService {
  static async getActiveApplications() {
    try {
      console.log('🔍 Fetching user applications...');
      const response = await apiClient.get('/applications');
      console.log('📋 Raw applications:', response.data);
      
      // Her başvurunun durumunu logla
      response.data.forEach((app: any) => {
        console.log(`   - ${app.country}: ${app.status} (progress: ${app.progressPercentage}%)`);
      });
      
      // CANCELLED hariç tümünü göster (COMPLETED dahil)
      const allApps = response.data.filter((app: any) => 
        app.status !== 'CANCELLED'
      );
      console.log('✅ All applications (including completed):', allApps.length);
      
      return allApps;
    } catch (error: any) {
      console.error('❌ Get applications error:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      return [];
    }
  }

  static async getApplication(id: string) {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  }

  static async createApplication(data: any) {
    // Backend'i uyandır (cold start önleme)
    await AuthService.wakeUpBackend();
    
    const response = await apiClient.post('/applications', data);
    return response.data;
  }

  static async deleteApplication(id: string) {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  }
}

