import { Request, Response } from 'express';
import { PrismaClient, CategoriaConfig, TipoConfig } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Obtener todas las configuraciones (agrupadas por categoría)
export const getAllConfigs = async (req: Request, res: Response): Promise<void> => {
  try {
    const configs = await prisma.config.findMany({
      orderBy: [{ categoria: 'asc' }, { key: 'asc' }],
    });

    // Agrupar por categoría
    const grouped: Record<string, Record<string, unknown>> = {};
    
    configs.forEach((config) => {
      const categoria = config.categoria.toLowerCase();
      if (!grouped[categoria]) {
        grouped[categoria] = {};
      }
      
      const key = config.key.replace(`${categoria}_`, '');
      grouped[categoria][key] = parseValue(config.value, config.tipo);
    });

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('Error obteniendo configuraciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuraciones',
    });
  }
};

// Obtener configuraciones por categoría
export const getConfigsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoria = req.params.categoria as string;
    const categoriaUpper = categoria.toUpperCase() as CategoriaConfig;

    const configs = await prisma.config.findMany({
      where: { categoria: categoriaUpper },
      orderBy: { key: 'asc' },
    });

    const result: Record<string, unknown> = {};
    configs.forEach((config) => {
      const key = config.key.replace(`${categoria.toLowerCase()}_`, '');
      result[key] = parseValue(config.value, config.tipo);
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error obteniendo configuraciones por categoría:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuraciones',
    });
  }
};

// Obtener configuración específica
export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.key as string;

    const config = await prisma.config.findUnique({
      where: { key },
    });

    if (!config) {
      res.status(404).json({
        success: false,
        error: 'Configuración no encontrada',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        key: config.key,
        value: parseValue(config.value, config.tipo),
        tipo: config.tipo,
        categoria: config.categoria,
        descripcion: config.descripcion,
      },
    });
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuración',
    });
  }
};

// Actualizar configuración
export const updateConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const key = req.params.key as string;
    const { value } = req.body;
    const userId = req.user?.userId;

    const config = await prisma.config.findUnique({
      where: { key },
    });

    if (!config) {
      res.status(404).json({
        success: false,
        error: 'Configuración no encontrada',
      });
      return;
    }

    // Validar valor según tipo
    const validationError = validateValue(value, config.tipo);
    if (validationError) {
      res.status(400).json({
        success: false,
        error: validationError,
      });
      return;
    }

    // Guardar historial
    await prisma.configHistory.create({
      data: {
        configKey: key,
        oldValue: config.value,
        newValue: stringifyValue(value, config.tipo),
        updatedBy: userId || 'unknown',
      },
    });

    // Actualizar configuración
    const updated = await prisma.config.update({
      where: { key },
      data: {
        value: stringifyValue(value, config.tipo),
        updatedBy: userId,
      },
    });

    res.json({
      success: true,
      data: {
        key: updated.key,
        value: parseValue(updated.value, updated.tipo),
        updatedAt: updated.updatedAt,
      },
      message: 'Configuración actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar configuración',
    });
  }
};

// Actualizar múltiples configuraciones
export const updateBulkConfigs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { configs } = req.body;
    const userId = req.user?.userId;

    if (!Array.isArray(configs) || configs.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Se requiere un array de configuraciones',
      });
      return;
    }

    // Validar todas las configuraciones primero
    for (const item of configs) {
      const config = await prisma.config.findUnique({
        where: { key: item.key },
      });

      if (!config) {
        res.status(400).json({
          success: false,
          error: `Configuración no encontrada: ${item.key}`,
        });
        return;
      }

      const validationError = validateValue(item.value, config.tipo);
      if (validationError) {
        res.status(400).json({
          success: false,
          error: `Error en ${item.key}: ${validationError}`,
        });
        return;
      }
    }

    // Actualizar en transacción
    await prisma.$transaction(async (tx) => {
      for (const item of configs) {
        const config = await tx.config.findUnique({
          where: { key: item.key },
        });

        if (config) {
          // Guardar historial
          await tx.configHistory.create({
            data: {
              configKey: item.key,
              oldValue: config.value,
              newValue: stringifyValue(item.value, config.tipo),
              updatedBy: userId || 'unknown',
            },
          });

          // Actualizar
          await tx.config.update({
            where: { key: item.key },
            data: {
              value: stringifyValue(item.value, config.tipo),
              updatedBy: userId,
            },
          });
        }
      }
    });

    res.json({
      success: true,
      message: `${configs.length} configuraciones actualizadas exitosamente`,
    });
  } catch (error) {
    console.error('Error actualizando configuraciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar configuraciones',
    });
  }
};

// Obtener configuraciones públicas (para frontend sin auth)
export const getPublicConfigs = async (req: Request, res: Response): Promise<void> => {
  try {
    const configs = await prisma.config.findMany({
      where: { isPublic: true },
      orderBy: [{ categoria: 'asc' }, { key: 'asc' }],
    });

    const grouped: Record<string, Record<string, unknown>> = {};
    
    configs.forEach((config) => {
      const categoria = config.categoria.toLowerCase();
      if (!grouped[categoria]) {
        grouped[categoria] = {};
      }
      
      const key = config.key.replace(`${categoria}_`, '');
      grouped[categoria][key] = parseValue(config.value, config.tipo);
    });

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('Error obteniendo configuraciones públicas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuraciones',
    });
  }
};

// Obtener historial de cambios de una configuración
export const getConfigHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.key as string;

    const history = await prisma.configHistory.findMany({
      where: { configKey: key },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener historial',
    });
  }
};

// Probar conexión SMTP
export const testSmtpConnection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { host, port, user, password, testEmail } = req.body;

    // Importar nodemailer dinámicamente
    const nodemailer = await import('nodemailer');
    
    const transporter = nodemailer.default.createTransport({
      host,
      port: parseInt(port),
      secure: false,
      auth: { user, pass: password },
    });

    // Verificar conexión
    await transporter.verify();

    // Enviar email de prueba si se proporciona
    if (testEmail) {
      await transporter.sendMail({
        from: `"Test" <${user}>`,
        to: testEmail,
        subject: 'Prueba de conexión SMTP - Liney Visión',
        html: '<p>Este es un email de prueba. La configuración SMTP funciona correctamente.</p>',
      });
    }

    res.json({
      success: true,
      message: testEmail 
        ? `Conexión exitosa. Email de prueba enviado a ${testEmail}` 
        : 'Conexión SMTP verificada exitosamente',
    });
  } catch (error) {
    console.error('Error probando SMTP:', error);
    res.status(400).json({
      success: false,
      error: 'Error de conexión SMTP: ' + (error as Error).message,
    });
  }
};

// Helpers
function parseValue(value: string, tipo: TipoConfig): unknown {
  switch (tipo) {
    case 'NUMBER':
      return parseFloat(value);
    case 'BOOLEAN':
      return value === 'true';
    case 'JSON':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

function stringifyValue(value: unknown, tipo: TipoConfig): string {
  switch (tipo) {
    case 'JSON':
      return JSON.stringify(value);
    case 'BOOLEAN':
      return value ? 'true' : 'false';
    default:
      return String(value);
  }
}

function validateValue(value: unknown, tipo: TipoConfig): string | null {
  switch (tipo) {
    case 'EMAIL':
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email inválido';
      }
      break;
    case 'URL':
      if (typeof value !== 'string' || !/^https?:\/\/.+/.test(value)) {
        return 'URL inválida (debe comenzar con http:// o https://)';
      }
      break;
    case 'NUMBER':
      if (isNaN(Number(value))) {
        return 'Debe ser un número válido';
      }
      break;
    case 'BOOLEAN':
      if (typeof value !== 'boolean') {
        return 'Debe ser verdadero o falso';
      }
      break;
  }
  return null;
}
