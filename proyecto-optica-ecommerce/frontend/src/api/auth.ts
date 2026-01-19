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
};
