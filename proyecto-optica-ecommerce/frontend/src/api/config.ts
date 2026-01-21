import { apiClient } from './client';
import type { ApiResponse } from '../types';

// Tipos
export interface ConfigData {
  empresa?: {
    nombre?: string;
    logo?: string;
    favicon?: string;
    direccion?: string;
    telefono?: string;
    whatsapp?: string;
    email?: string;
    email_soporte?: string;
    horario?: string;
    nit?: string;
    razon_social?: string;
    redes_sociales?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
  };
  pagos?: {
    metodos_activos?: {
      tarjetaCredito?: boolean;
      tarjetaDebito?: boolean;
      pse?: boolean;
      efectivo?: boolean;
      transferencia?: boolean;
      contraentrega?: boolean;
    };
    pasarela?: string;
    pasarela_public_key?: string;
    pasarela_private_key?: string;
    modo_prueba?: boolean;
  };
  envios?: {
    gratis_desde?: number;
    costo_default?: number;
    dias_entrega?: string;
    zonas?: Array<{
      nombre: string;
      costo: number;
      diasEntrega: string;
      activo: boolean;
    }>;
    transportadoras?: string[];
    peso_maximo?: number;
  };
  impuestos?: {
    iva?: number;
    moneda?: string;
    simbolo_moneda?: string;
    formato_numero?: string;
    incluir_en_precio?: boolean;
    precios_con_iva?: boolean;
  };
  emails?: {
    smtp_host?: string;
    smtp_port?: number;
    smtp_user?: string;
    smtp_password?: string;
    remitente_nombre?: string;
    remitente_email?: string;
  };
  sitio?: {
    modo_mantenimiento?: boolean;
    permitir_registro?: boolean;
    registro_habilitado?: boolean;
    verificacion_email?: boolean;
    productos_por_pagina?: number;
    habilitar_comentarios?: boolean;
    habilitar_valoraciones?: boolean;
    habilitar_wishlist?: boolean;
    resenas_habilitadas?: boolean;
    wishlist_habilitada?: boolean;
    comparador_habilitado?: boolean;
    chat_en_vivo?: boolean;
    productos_relacionados?: boolean;
  };
  seo?: {
    meta_titulo?: string;
    meta_descripcion?: string;
    keywords?: string;
    google_analytics?: string;
    facebook_pixel?: string;
    google_tag_manager?: string;
  };
  optica?: {
    garantia_meses?: number;
    servicios_incluidos?: string[];
    validez_prescripcion?: number;
    requerir_prescripcion?: boolean;
    requiere_prescripcion?: boolean;
    tipos_lentes?: string[];
    tratamientos?: string[];
  };
  legal?: {
    terminos_condiciones?: string;
    politica_privacidad?: string;
    politica_devoluciones?: string;
    politica_envios?: string;
    politica_cookies?: string;
  };
}

export interface ConfigItem {
  key: string;
  value: unknown;
  tipo: string;
  categoria: string;
  descripcion?: string;
}

export interface ConfigHistoryItem {
  id: string;
  configKey: string;
  oldValue: string | null;
  newValue: string;
  updatedBy: string;
  updatedAt: string;
}

export const configApi = {
  // Obtener todas las configuraciones
  getAll: async (): Promise<ApiResponse<ConfigData>> => {
    const { data } = await apiClient.get('/config');
    return data;
  },

  // Obtener configuraciones por categoría
  getByCategory: async (categoria: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const { data } = await apiClient.get(`/config/categoria/${categoria}`);
    return data;
  },

  // Obtener configuración específica
  get: async (key: string): Promise<ApiResponse<ConfigItem>> => {
    const { data } = await apiClient.get(`/config/key/${key}`);
    return data;
  },

  // Actualizar configuración
  update: async (key: string, value: unknown): Promise<ApiResponse<ConfigItem>> => {
    const { data } = await apiClient.put(`/config/key/${key}`, { value });
    return data;
  },

  // Actualizar múltiples configuraciones
  updateBulk: async (configs: Array<{ key: string; value: unknown }>): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.put('/config/bulk', { configs });
    return data;
  },

  // Obtener historial de cambios
  getHistory: async (key: string): Promise<ApiResponse<ConfigHistoryItem[]>> => {
    const { data } = await apiClient.get(`/config/key/${key}/history`);
    return data;
  },

  // Probar conexión SMTP
  testSmtp: async (smtpConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    testEmail?: string;
  }): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post('/config/test-smtp', smtpConfig);
    return data;
  },

  // Obtener configuraciones públicas (sin auth)
  getPublic: async (): Promise<ApiResponse<ConfigData>> => {
    const { data } = await apiClient.get('/config/public');
    return data;
  },
};
