import { apiClient } from './client';
import type { ApiResponse, Product, PaginatedResponse } from '../types';

// Types para Orders
export interface OrderClient {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  totalCompras?: number;
  clienteDesde?: string;
}

export interface OrderItem {
  id: string;
  producto: {
    id: string;
    nombre: string;
    marca?: string;
    imagen?: string;
    sku: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrderListItem {
  id: string;
  numero: string;
  cliente: OrderClient;
  total: number;
  estadoPedido: string;
  estadoPago: string;
  metodoPago: string;
  createdAt: string;
  itemsCount: number;
}

export interface OrderDetail {
  id: string;
  numero: string;
  cliente: OrderClient;
  items: OrderItem[];
  montos: {
    subtotal: number;
    descuento: number;
    costoEnvio: number;
    total: number;
  };
  direccionEnvio: {
    nombre: string;
    direccion: string;
    ciudad: string;
    departamento?: string;
    telefono: string;
    instrucciones?: string;
  };
  pago: {
    metodo: string;
    estado: string;
    fechaPago?: string;
  };
  envio: {
    transportadora?: string;
    numeroGuia?: string;
    fechaEstimada?: string;
    fechaEnvio?: string;
    fechaEntrega?: string;
  };
  estados: {
    actual: string;
    historial: Array<{
      estado: string;
      fecha: string;
      usuario: string;
      notas?: string;
    }>;
  };
  notas: {
    cliente?: string;
    internas?: string;
  };
  cancelacion?: {
    motivo: string;
    canceladoPor: string;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  data: OrderListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    pendientes: number;
    pagados: number;
    procesando: number;
    enviados: number;
    entregados: number;
    cancelados: number;
  };
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  estadoPedido?: string;
  estadoPago?: string;
  fechaInicio?: string;
  fechaFin?: string;
  search?: string;
  metodoPago?: string;
}

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

  // Orders
  getOrders: async (filters?: OrderFilters): Promise<OrdersResponse> => {
    const searchParams = new URLSearchParams();
    if (filters?.page) searchParams.append('page', String(filters.page));
    if (filters?.limit) searchParams.append('limit', String(filters.limit));
    if (filters?.sort) searchParams.append('sort', filters.sort);
    if (filters?.estadoPedido) searchParams.append('estadoPedido', filters.estadoPedido);
    if (filters?.estadoPago) searchParams.append('estadoPago', filters.estadoPago);
    if (filters?.fechaInicio) searchParams.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) searchParams.append('fechaFin', filters.fechaFin);
    if (filters?.search) searchParams.append('search', filters.search);
    if (filters?.metodoPago) searchParams.append('metodoPago', filters.metodoPago);

    const { data } = await apiClient.get(`/admin/orders?${searchParams.toString()}`);
    return data;
  },

  getOrder: async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await apiClient.get(`/admin/orders/${id}`);
    return data;
  },

  updateOrderStatus: async (
    id: string,
    payload: {
      nuevoEstado: string;
      notificarCliente?: boolean;
      notasInternas?: string;
      transportadora?: string;
      numeroGuia?: string;
      fechaEstimadaEntrega?: string;
    }
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await apiClient.put(`/admin/orders/${id}/estado`, payload);
    return data;
  },

  addOrderNotes: async (id: string, nota: string): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await apiClient.post(`/admin/orders/${id}/notas`, { nota });
    return data;
  },

  cancelOrder: async (
    id: string,
    payload: {
      motivo: string;
      reembolsar?: boolean;
      notificarCliente?: boolean;
    }
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await apiClient.post(`/admin/orders/${id}/cancelar`, payload);
    return data;
  },

  updateShippingInfo: async (
    id: string,
    payload: {
      transportadora?: string;
      numeroGuia?: string;
      fechaEstimadaEntrega?: string;
      notificarCliente?: boolean;
    }
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await apiClient.put(`/admin/orders/${id}/envio`, payload);
    return data;
  },

  getOrderStats: async (periodo?: 'hoy' | 'semana' | 'mes'): Promise<ApiResponse<{
    periodo: string;
    totalPedidos: number;
    totalIngresos: number;
    pedidoPromedio: number;
    porEstado: Record<string, number>;
    porMetodoPago: Record<string, number>;
  }>> => {
    const { data } = await apiClient.get(`/admin/orders/stats${periodo ? `?periodo=${periodo}` : ''}`);
    return data;
  },
};
