import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, PaginatedResponse, AuthRequest } from '../types';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      categoria,
      marca,
      minPrice,
      maxPrice,
      search,
      page = '1',
      limit = '12',
      orderBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      activo: true,
    };

    if (categoria) {
      where.categoria = categoria as string;
    }

    if (marca) {
      where.marca = {
        contains: marca as string,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      where.precio = {};
      if (minPrice) where.precio.gte = parseFloat(minPrice as string);
      if (maxPrice) where.precio.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search as string, mode: 'insensitive' } },
        { marca: { contains: search as string, mode: 'insensitive' } },
        { descripcion: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [orderBy as string]: order },
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const response: PaginatedResponse<typeof products[0]> = {
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos',
    } as ApiResponse);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: product,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener producto',
    } as ApiResponse);
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      sku,
      nombre,
      marca,
      categoria,
      categoryId,
      precio,
      descuento,
      imagenes,
      descripcion,
      caracteristicas,
      stock,
    } = req.body;

    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      res.status(400).json({
        success: false,
        error: 'El SKU ya existe',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.create({
      data: {
        sku,
        nombre,
        marca,
        categoria,
        categoryId,
        precio,
        descuento,
        imagenes,
        descripcion,
        caracteristicas,
        stock,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear producto',
    } as ApiResponse);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto',
    } as ApiResponse);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    await prisma.product.update({
      where: { id },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto',
    } as ApiResponse);
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        activo: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener categorías',
    } as ApiResponse);
  }
};
