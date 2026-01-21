import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface DomainOption {
  codigo: string;
  nombre: string;
}

export interface Domain {
  id: string;
  tipo: string;
  codigo: string;
  nombre: string;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DomainsGrouped {
  color: DomainOption[];
  forma: DomainOption[];
  genero: DomainOption[];
  material: DomainOption[];
  polarizado: DomainOption[];
  proteccion_uv: DomainOption[];
  marca: DomainOption[];
  [key: string]: DomainOption[];
}

export interface CreateDomainData {
  tipo: string;
  codigo: string;
  nombre: string;
  orden?: number;
}

export interface UpdateDomainData {
  nombre?: string;
  orden?: number;
  activo?: boolean;
}

export const domainsApi = {
  // Obtener todos los dominios agrupados por tipo
  getAll: async (): Promise<ApiResponse<DomainsGrouped>> => {
    const { data } = await apiClient.get('/domains');
    return data;
  },

  // Obtener dominios por tipo específico
  getByType: async (tipo: string): Promise<ApiResponse<DomainOption[]>> => {
    const { data } = await apiClient.get(`/domains/${tipo}`);
    return data;
  },

  // Admin: Obtener todos los dominios (incluye inactivos)
  getAllAdmin: async (): Promise<ApiResponse<Domain[]>> => {
    const { data } = await apiClient.get('/domains/admin/all');
    return data;
  },

  // Admin: Crear dominio
  create: async (domainData: CreateDomainData): Promise<ApiResponse<Domain>> => {
    const { data } = await apiClient.post('/domains', domainData);
    return data;
  },

  // Admin: Actualizar dominio
  update: async (id: string, domainData: UpdateDomainData): Promise<ApiResponse<Domain>> => {
    const { data } = await apiClient.put(`/domains/${id}`, domainData);
    return data;
  },

  // Admin: Eliminar dominio (soft delete)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(`/domains/${id}`);
    return data;
  },
};
