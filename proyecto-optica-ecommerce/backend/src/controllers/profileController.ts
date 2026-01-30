import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    console.log('getProfile - userId:', userId);
    console.log('getProfile - user object:', (req as any).user);

    if (!userId) {
      console.error('getProfile - No se encontró userId en el request');
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        apellidos: true,
        phone: true,
        tipoDocumento: true,
        numeroDocumento: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('getProfile - user found:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error al obtener perfil - detalle:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil',
    });
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, apellidos, phone, tipoDocumento, numeroDocumento } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        apellidos,
        phone,
        tipoDocumento,
        numeroDocumento,
      },
      select: {
        id: true,
        email: true,
        name: true,
        apellidos: true,
        phone: true,
        tipoDocumento: true,
        numeroDocumento: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: user,
      message: 'Perfil actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar perfil',
    });
  }
};

// ==================== DIRECCIONES ====================

// Obtener todas las direcciones del usuario
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const addresses = await prisma.address.findMany({
      where: { 
        userId,
        activo: true,
      },
      orderBy: [
        { esDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener direcciones',
    });
  }
};

// Crear nueva dirección
export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { 
      nombre, 
      destinatario, 
      telefono, 
      departamento, 
      municipio, 
      direccion, 
      infoAdicional, 
      barrio, 
      codigoPostal,
      esDefault 
    } = req.body;

    // Si es default, quitar el default de las otras direcciones
    if (esDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { esDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        nombre,
        destinatario,
        telefono,
        departamento,
        municipio,
        direccion,
        infoAdicional,
        barrio,
        codigoPostal,
        esDefault: esDefault || false,
      },
    });

    res.status(201).json({
      success: true,
      data: address,
      message: 'Dirección creada correctamente',
    });
  } catch (error) {
    console.error('Error al crear dirección:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear dirección',
    });
  }
};

// Actualizar dirección
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;
    const { 
      nombre, 
      destinatario, 
      telefono, 
      departamento, 
      municipio, 
      direccion, 
      infoAdicional, 
      barrio, 
      codigoPostal,
      esDefault 
    } = req.body;

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        error: 'Dirección no encontrada',
      });
    }

    // Si es default, quitar el default de las otras direcciones
    if (esDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { esDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        nombre,
        destinatario,
        telefono,
        departamento,
        municipio,
        direccion,
        infoAdicional,
        barrio,
        codigoPostal,
        esDefault,
      },
    });

    res.json({
      success: true,
      data: address,
      message: 'Dirección actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar dirección',
    });
  }
};

// Eliminar dirección (soft delete)
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        error: 'Dirección no encontrada',
      });
    }

    // Soft delete
    await prisma.address.update({
      where: { id },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: 'Dirección eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar dirección',
    });
  }
};

// Establecer dirección como predeterminada
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        error: 'Dirección no encontrada',
      });
    }

    // Quitar default de todas las direcciones
    await prisma.address.updateMany({
      where: { userId },
      data: { esDefault: false },
    });

    // Establecer la nueva como default
    const address = await prisma.address.update({
      where: { id },
      data: { esDefault: true },
    });

    res.json({
      success: true,
      data: address,
      message: 'Dirección establecida como predeterminada',
    });
  } catch (error) {
    console.error('Error al establecer dirección predeterminada:', error);
    res.status(500).json({
      success: false,
      error: 'Error al establecer dirección predeterminada',
    });
  }
};
