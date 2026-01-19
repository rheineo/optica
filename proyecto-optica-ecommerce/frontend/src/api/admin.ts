import { apiClient } from './client';
import type { ApiResponse, Product, PaginatedResponse } from '../types';

export interface ProductFormData {
  sku: string;
  nombre: string;
  marca: string;
  categoria: string;
  categoryId?: string;
  precio: number;
  descuento?: number;
  imagenes: string[];
  descripcion: string;
  caracteristicas?: Record<string, unknown>;
  stock: number;
}

export const adminApi = {
  // Products
  getProducts: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.search) searchParams.append('search', params.search);
    
    const { data } = await apiClient.get(`/products?${searchParams.toString()}`);
    return data;
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  createProduct: async (product: ProductFormData): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.post('/products', product);
    return data;
  },

  updateProduct: async (id: string, product: Partial<ProductFormData>): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.put(`/products/${id}`, product);
    return data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },
};
