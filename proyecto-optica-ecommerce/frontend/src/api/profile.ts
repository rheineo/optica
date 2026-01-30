import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  apellidos?: string;
  phone?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  role: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  nombre: string;
  destinatario: string;
  telefono: string;
  departamento: string;
  municipio: string;
  direccion: string;
  infoAdicional?: string;
  barrio?: string;
  codigoPostal?: string;
  esDefault: boolean;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  nombre: string;
  destinatario: string;
  telefono: string;
  departamento: string;
  municipio: string;
  direccion: string;
  infoAdicional?: string;
  barrio?: string;
  codigoPostal?: string;
  esDefault?: boolean;
}

export interface UpdateProfileData {
  name: string;
  apellidos?: string;
  phone?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
}

export const profileApi = {
  // Obtener perfil
  getProfile: async () => {
    const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.put<{ success: boolean; data: UserProfile; message: string }>('/profile', data);
    return response.data;
  },

  // Obtener direcciones
  getAddresses: async () => {
    const response = await apiClient.get<{ success: boolean; data: Address[] }>('/profile/addresses');
    return response.data;
  },

  // Crear dirección
  createAddress: async (data: CreateAddressData) => {
    const response = await apiClient.post<{ success: boolean; data: Address; message: string }>('/profile/addresses', data);
    return response.data;
  },

  // Actualizar dirección
  updateAddress: async (id: string, data: CreateAddressData) => {
    const response = await apiClient.put<{ success: boolean; data: Address; message: string }>(`/profile/addresses/${id}`, data);
    return response.data;
  },

  // Eliminar dirección
  deleteAddress: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/profile/addresses/${id}`);
    return response.data;
  },

  // Establecer dirección como predeterminada
  setDefaultAddress: async (id: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Address; message: string }>(`/profile/addresses/${id}/default`);
    return response.data;
  },
};
