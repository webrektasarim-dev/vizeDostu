import { apiClient } from '../config/api.config';
import { AuthService } from './auth.service';

export class PassportService {
  static async getPassport() {
    try {
      const response = await apiClient.get('/passports');
      // İlk pasaportu döndür (kullanıcının tek pasaportu olduğunu varsayıyoruz)
      const passports = response.data;
      if (passports && passports.length > 0) {
        return passports[0];
      }
      return null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Pasaport bulunamadı, normal
        return null;
      }
      console.error('Get passport error:', error);
      return null;
    }
  }

  static async createOrUpdatePassport(data: {
    passportNumber: string;
    fullName: string;
    nationality: string;
    expiryDate: string;
    imageUri?: string;
  }) {
    try {
      console.log('💾 Saving passport:', data);
      
      // Backend'i uyandır (cold start önleme)
      await AuthService.wakeUpBackend();
      
      // Eğer görsel varsa, önce yükle ve documentId al
      let documentId = '';
      if (data.imageUri) {
        const doc = await this.uploadPassportImage(data.imageUri);
        documentId = doc.id;
      }

      // Backend'e uygun payload
      const payload = {
        passportNumber: data.passportNumber,
        issueDate: new Date().toISOString().split('T')[0], // Bugün
        expiryDate: data.expiryDate,
        issuingCountry: data.nationality === 'Türkiye' ? 'TUR' : data.nationality,
        ...(documentId && { documentId }),
      };

      const response = await apiClient.post('/passports', payload);
      console.log('✅ Passport saved:', response.data);
      
      // Pasaportu tekrar çek (document ilişkisi ile)
      const savedPassport = await apiClient.get(`/passports/${response.data.id}`);
      
      return savedPassport.data;
    } catch (error) {
      console.error('Save passport error:', error);
      throw error;
    }
  }

  static async uploadPassportImage(uri: string) {
    try {
      const formData = new FormData();
      
      const filename = uri.split('/').pop() || 'passport.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);
      
      formData.append('documentType', 'passport');

      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Document'in tamamını döndür (id ve fileUrl dahil)
      return response.data;
    } catch (error) {
      console.error('Upload passport image error:', error);
      throw error;
    }
  }

  static async deletePassport() {
    try {
      const response = await apiClient.delete('/passports');
      return response.data;
    } catch (error) {
      console.error('Delete passport error:', error);
      throw error;
    }
  }
}
