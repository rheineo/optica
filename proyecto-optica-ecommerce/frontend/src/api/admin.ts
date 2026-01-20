import { apiClient } from './client';
import type { ApiResponse, Product, PaginatedResponse } from '../types';

// Types para Users
export interface UserListItem {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  estado: string;
  nivelCliente: string;
  emailVerified: boolean;
  lastLogin?: string;
  totalCompras: number;
  totalGastado: number;
  etiquetas: string[];
  createdAt: string;
}

export interface UserDetail {
  perfil: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    estado: string;
    nivelCliente: string;
    etiquetas: string[];
  };
  verificaciones: {
    emailVerified: boolean;
    emailVerifiedAt?: string;
    phoneVerified: boolean;
  };
  estadisticas: {
    totalCompras: number;
    totalGastado: number;
    pedidoPromedio: number;
    ultimaCompra?: string;
    clienteDesde: string;
  };
  direcciones: Array<{
    id: string;
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono: string;
    esDefault: boolean;
  }>;
  seguridad: {
    lastLogin?: string;
    loginAttempts: number;
    blockedAt?: string;
    blockedBy?: string;
    motivoBloqueo?: string;
  };
  admin: {
    notasInternas?: string;
    etiquetas: string[];
  };
  pedidosRecientes: Array<{
    id: string;
    numero: string;
    total: number;
    estadoPedido: string;
    fecha: string;
    itemsCount: number;
  }>;
  timestamps: {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  };
}

export interface UsersResponse {
  success: boolean;
  data: UserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalUsuarios: number;
    activos: number;
    bloqueados: number;
    nuevosEsteMes: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  role?: string;
  estado?: string;
  nivelCliente?: string;
  fechaInicio?: string;
  fechaFin?: string;
  search?: string;
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
  role?: string;
  estado?: string;
  nivelCliente?: string;
  etiquetas?: string[];
  notasInternas?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface UserOrdersResponse {
  success: boolean;
  data: Array<{
    id: string;
    numero: string;
    fecha: string;
    total: number;
    estadoPedido: string;
    estadoPago: string;
    itemsCount: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalCompras: number;
    totalGastado: number;
    pedidoPromedio: number;
  };
}

export interface UserStats {
  periodo: string;
  general: {
    totalUsuarios: number;
    nuevosUsuarios: number;
    usuariosActivos: number;
  };
  porRol: Record<string, number>;
  porEstado: Record<string, number>;
  porNivel: Record<string, number>;
  topClientes: Array<{
    id: string;
    name: string;
    email: string;
    totalGastado: number;
    totalCompras: number;
  }>;
}

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

  // Users
  createUser: async (userData: CreateUserData): Promise<ApiResponse<UserListItem>> => {
    const { data } = await apiClient.post('/admin/users', userData);
    return data;
  },

  getUsers: async (filters?: UserFilters): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    if (filters?.page) searchParams.append('page', String(filters.page));
    if (filters?.limit) searchParams.append('limit', String(filters.limit));
    if (filters?.sort) searchParams.append('sort', filters.sort);
    if (filters?.role) searchParams.append('role', filters.role);
    if (filters?.estado) searchParams.append('estado', filters.estado);
    if (filters?.nivelCliente) searchParams.append('nivelCliente', filters.nivelCliente);
    if (filters?.fechaInicio) searchParams.append('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) searchParams.append('fechaFin', filters.fechaFin);
    if (filters?.search) searchParams.append('search', filters.search);

    const { data } = await apiClient.get(`/admin/users?${searchParams.toString()}`);
    return data;
  },

  getUser: async (id: string): Promise<ApiResponse<UserDetail>> => {
    const { data } = await apiClient.get(`/admin/users/${id}`);
    return data;
  },

  updateUser: async (id: string, payload: Partial<UserUpdateData>): Promise<ApiResponse<UserListItem>> => {
    const { data } = await apiClient.put(`/admin/users/${id}`, payload);
    return data;
  },

  blockUser: async (id: string, motivo: string): Promise<ApiResponse<UserListItem>> => {
    const { data } = await apiClient.post(`/admin/users/${id}/bloquear`, { motivo });
    return data;
  },

  unblockUser: async (id: string): Promise<ApiResponse<UserListItem>> => {
    const { data } = await apiClient.post(`/admin/users/${id}/desbloquear`, {});
    return data;
  },

  resetUserPassword: async (id: string): Promise<ApiResponse<{ tempPassword: string }>> => {
    const { data } = await apiClient.post(`/admin/users/${id}/reset-password`, {});
    return data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(`/admin/users/${id}`);
    return data;
  },

  addUserNotes: async (id: string, nota: string): Promise<ApiResponse<{ notasInternas: string }>> => {
    const { data } = await apiClient.post(`/admin/users/${id}/notas`, { nota });
    return data;
  },

  updateUserTags: async (id: string, etiquetas: string[]): Promise<ApiResponse<{ etiquetas: string[] }>> => {
    const { data } = await apiClient.put(`/admin/users/${id}/etiquetas`, { etiquetas });
    return data;
  },

  getUserOrders: async (id: string, page?: number, limit?: number): Promise<UserOrdersResponse> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', String(page));
    if (limit) searchParams.append('limit', String(limit));
    const { data } = await apiClient.get(`/admin/users/${id}/orders?${searchParams.toString()}`);
    return data;
  },

  getUserStats: async (periodo?: 'hoy' | 'semana' | 'mes'): Promise<ApiResponse<UserStats>> => {
    const { data } = await apiClient.get(`/admin/users/stats${periodo ? `?periodo=${periodo}` : ''}`);
    return data;
  },

  verifyUserEmail: async (id: string): Promise<ApiResponse<UserListItem>> => {
    const { data } = await apiClient.post(`/admin/users/${id}/verify-email`, {});
    return data;
  },
};
