import { apiClient } from '../config/api.config';
import * as DocumentPicker from 'expo-document-picker';

export class DocumentService {
  static async getDocuments() {
    try {
      const response = await apiClient.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Get documents error:', error);
      return [];
    }
  }

  static async uploadDocument(uri: string, documentType: string, country?: string) {
    try {
      // Simple upload for now - chunk upload can be added later
      const formData = new FormData();
      
      const filename = uri.split('/').pop() || 'document.pdf';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `application/${match[1]}` : 'application/pdf';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);
      
      formData.append('documentType', documentType);
      if (country) formData.append('country', country);

      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  static async pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0];
    }
    
    return null;
  }
}

