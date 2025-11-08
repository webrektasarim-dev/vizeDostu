import { apiClient } from '../config/api.config';

export class AIService {
  static async sendMessage(message: string) {
    const response = await apiClient.post('/ai-assistant/chat', {
      message,
    });
    return response.data;
  }

  static async getChatHistory(limit: number = 50) {
    try {
      const response = await apiClient.get(`/ai-assistant/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get chat history error:', error);
      return [];
    }
  }

  static async clearHistory() {
    const response = await apiClient.delete('/ai-assistant/history');
    return response.data;
  }
}

