import { apiClient } from './client';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  validateResetToken: async (token: string): Promise<ApiResponse<{ email: string; name: string }>> => {
    const { data } = await apiClient.get(`/auth/validate-reset-token/${token}`);
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data;
  },
};
