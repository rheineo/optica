import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface UploadResponse {
  url: string;
  filename: string;
}

export const uploadApi = {
  // Subir imagen individual de producto
  uploadProductImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post('/upload/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Subir múltiples imágenes de producto
  uploadProductImages: async (files: File[]): Promise<ApiResponse<UploadResponse[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const { data } = await apiClient.post('/upload/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Eliminar imagen
  deleteImage: async (url: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete('/upload/product', {
      data: { url },
    });
    return data;
  },

  // Agregar imagen a producto existente
  addImageToProduct: async (productId: string, file: File): Promise<ApiResponse<unknown>> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post(`/upload/product/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Eliminar imagen de producto
  removeImageFromProduct: async (productId: string, imageUrl: string): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.delete(`/upload/product/${productId}/image`, {
      data: { imageUrl },
    });
    return data;
  },

  // Reordenar imágenes de producto
  reorderProductImages: async (productId: string, imagenes: string[]): Promise<ApiResponse<unknown>> => {
    const { data } = await apiClient.put(`/upload/product/${productId}/images/reorder`, {
      imagenes,
    });
    return data;
  },

  // Subir logo de empresa
  uploadLogo: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post('/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
