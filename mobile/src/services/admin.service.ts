import { apiClient } from '../config/api.config';

export interface AdminStats {
  totalUsers: number;
  totalApplications: number;
  totalDocuments: number;
  activeApplications: number;
  completedApplications: number;
  todayRegistrations: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  _count: {
    applications: number;
    documents: number;
  };
}

export interface AdminApplication {
  id: string;
  country: string;
  visaType: string;
  status: string;
  progressPercentage: number;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export const AdminService = {
  // === DASHBOARD STATS ===
  async getDashboardStats(): Promise<AdminStats> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  // === USER MANAGEMENT ===
  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const params = { page, limit, ...(search && { search }) };
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  async getUserById(id: string) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  async updateUserStatus(id: string, isActive: boolean) {
    const response = await apiClient.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // === APPLICATION MANAGEMENT ===
  async getAllApplications(page: number = 1, limit: number = 20, status?: string) {
    const params = { page, limit, ...(status && { status }) };
    const response = await apiClient.get('/admin/applications', { params });
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await apiClient.get(`/admin/applications/${id}`);
    return response.data;
  },

  async updateApplicationStatus(id: string, status: string) {
    console.log(`🔄 Admin updating application ${id} to status: ${status}`);
    const response = await apiClient.put(`/admin/applications/${id}/status`, { status });
    console.log(`✅ Admin update response:`, response.data);
    return response.data;
  },

  async deleteApplication(id: string) {
    const response = await apiClient.delete(`/admin/applications/${id}`);
    return response.data;
  },

  // === DOCUMENT MANAGEMENT ===
  async getAllDocuments(page: number = 1, limit: number = 20) {
    const params = { page, limit };
    const response = await apiClient.get('/admin/documents', { params });
    return response.data;
  },

  async getDocumentById(id: string) {
    const response = await apiClient.get(`/admin/documents/${id}`);
    return response.data;
  },

  async deleteDocument(id: string) {
    const response = await apiClient.delete(`/admin/documents/${id}`);
    return response.data;
  },

  // === CHAT LOGS ===
  async getChatLogs(page: number = 1, limit: number = 50, userId?: string) {
    const params = { page, limit, ...(userId && { userId }) };
    const response = await apiClient.get('/admin/chat-logs', { params });
    return response.data;
  },
};

