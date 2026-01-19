import { apiClient } from './client';
import type { Product, Category, PaginatedResponse, ApiResponse } from '../types';

export interface ProductFilters {
  categoria?: string;
  marca?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getAll: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await apiClient.get(`/products?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await apiClient.get('/products/categories');
    return data;
  },
};
