import { apiClient } from './client';
import type { ApiResponse, Cart } from '../types';

export const cartApi = {
  get: async (): Promise<ApiResponse<Cart>> => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addItem: async (productId: string, cantidad: number = 1): Promise<ApiResponse<Cart>> => {
    const { data } = await apiClient.post('/cart/items', { productId, cantidad });
    return data;
  },

  updateItem: async (itemId: string, cantidad: number): Promise<ApiResponse<Cart>> => {
    const { data } = await apiClient.put(`/cart/items/${itemId}`, { cantidad });
    return data;
  },

  removeItem: async (itemId: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(`/cart/items/${itemId}`);
    return data;
  },

  clear: async (): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete('/cart');
    return data;
  },
};
