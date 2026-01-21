export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CLIENTE' | 'ADMIN';
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  nombre: string;
  marca: string;
  categoria: 'MONTURAS_SOL' | 'MONTURAS_OFTALMICA' | 'LENTES_CONTACTO' | 'ACCESORIOS';
  precio: number;
  descuento?: number;
  imagenes: string[];
  descripcion: string;
  caracteristicas: Record<string, unknown>;
  stock: number;
  activo: boolean;
  category?: Category;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen?: string;
  _count?: {
    products: number;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  cantidad: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
}
