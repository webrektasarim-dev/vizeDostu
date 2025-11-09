import { apiClient } from '../config/api.config';

export class PassportService {
  static async getPassport() {
    try {
      const response = await apiClient.get('/passports');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Pasaport bulunamadı, normal
        return null;
      }
      console.error('Get passport error:', error);
      throw error;
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
      
      // Eğer görsel varsa, önce yükle
      let imageUrl = '';
      if (data.imageUri) {
        imageUrl = await this.uploadPassportImage(data.imageUri);
      }

      const payload = {
        passportNumber: data.passportNumber,
        fullName: data.fullName,
        nationality: data.nationality,
        expiryDate: data.expiryDate,
        ...(imageUrl && { imageUrl }),
      };

      const response = await apiClient.post('/passports', payload);
      console.log('✅ Passport saved:', response.data);
      return response.data;
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

      return response.data.fileUrl;
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
