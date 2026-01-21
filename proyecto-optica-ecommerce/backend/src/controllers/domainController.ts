import { Request, Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import prisma from '../config/database';

// Obtener todos los dominios por tipo
export const getDomainsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipo = req.params.tipo as string;

    const domains = await prisma.domain.findMany({
      where: {
        tipo,
        activo: true,
      },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
    });

    res.json({
      success: true,
      data: domains,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener dominios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los dominios',
    } as ApiResponse);
  }
};

// Obtener todos los dominios agrupados por tipo
export const getAllDomains = async (_req: Request, res: Response): Promise<void> => {
  try {
    const domains = await prisma.domain.findMany({
      where: { activo: true },
      orderBy: [{ tipo: 'asc' }, { orden: 'asc' }],
    });

    // Agrupar por tipo
    const grouped = domains.reduce((acc, domain) => {
      if (!acc[domain.tipo]) {
        acc[domain.tipo] = [];
      }
      acc[domain.tipo].push({
        codigo: domain.codigo,
        nombre: domain.nombre,
      });
      return acc;
    }, {} as Record<string, { codigo: string; nombre: string }[]>);

    res.json({
      success: true,
      data: grouped,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener dominios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los dominios',
    } as ApiResponse);
  }
};

// Obtener todos los dominios para admin (incluye inactivos)
export const getAllDomainsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: [{ tipo: 'asc' }, { orden: 'asc' }],
    });

    res.json({
      success: true,
      data: domains,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener dominios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los dominios',
    } as ApiResponse);
  }
};

// Crear dominio
export const createDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tipo, codigo, nombre, orden } = req.body;

    if (!tipo || !codigo || !nombre) {
      res.status(400).json({
        success: false,
        error: 'Tipo, código y nombre son requeridos',
      } as ApiResponse);
      return;
    }

    const domain = await prisma.domain.create({
      data: {
        tipo,
        codigo,
        nombre,
        orden: orden || 0,
      },
    });

    res.status(201).json({
      success: true,
      data: domain,
      message: 'Dominio creado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al crear dominio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear el dominio',
    } as ApiResponse);
  }
};

// Actualizar dominio
export const updateDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { nombre, orden, activo } = req.body;

    const domain = await prisma.domain.update({
      where: { id },
      data: {
        nombre,
        orden,
        activo,
      },
    });

    res.json({
      success: true,
      data: domain,
      message: 'Dominio actualizado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al actualizar dominio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el dominio',
    } as ApiResponse);
  }
};

// Eliminar dominio (soft delete)
export const deleteDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    await prisma.domain.update({
      where: { id },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: 'Dominio eliminado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al eliminar dominio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el dominio',
    } as ApiResponse);
  }
};
