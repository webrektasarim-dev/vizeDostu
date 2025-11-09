import { apiClient } from '../config/api.config';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Linking } from 'react-native';
import { AuthService } from './auth.service';

export class DocumentService {
  static async getDocuments() {
    try {
      const response = await apiClient.get('/documents', {
        timeout: 60000, // 60 saniye (Render için)
      });
      return response.data;
    } catch (error: any) {
      console.error('Get documents error:', error);
      if (error.code === 'ECONNABORTED') {
        console.log('Documents request timeout, returning empty');
      }
      return [];
    }
  }

  static async uploadDocument(uri: string, documentType: string, country?: string) {
    try {
      // Backend'i uyandır (cold start önleme)
      await AuthService.wakeUpBackend();
      
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

  static async downloadDocument(fileUrl: string, fileName: string) {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
      return downloadResult.uri;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  static async shareDocument(fileUrl: string, fileName: string) {
    try {
      const localUri = await this.downloadDocument(fileUrl, fileName);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localUri);
      } else {
        throw new Error('Paylaşım bu cihazda desteklenmiyor');
      }
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  }

  static async viewDocument(fileUrl: string) {
    try {
      // Web URL ise tarayıcıda aç (mock storage için)
      if (fileUrl.includes('http')) {
        const canOpen = await Linking.canOpenURL(fileUrl);
        if (canOpen) {
          await Linking.openURL(fileUrl);
        } else {
          throw new Error('URL açılamıyor');
        }
      }
    } catch (error) {
      console.error('View error:', error);
      throw error;
    }
  }
}

