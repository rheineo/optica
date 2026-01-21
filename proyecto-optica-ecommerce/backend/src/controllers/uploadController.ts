import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { deleteImage, getPublicIdFromUrl } from '../config/cloudinary';
import prisma from '../config/database';

// Subir imagen de producto (retorna URL para usar en formulario)
export const uploadProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📤 Upload request received');
    console.log('📁 File:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      console.log('❌ No file in request');
      res.status(400).json({
        success: false,
        error: 'No se proporcionó ninguna imagen',
      } as ApiResponse);
      return;
    }

    const file = req.file as Express.Multer.File & { path: string };
    console.log('✅ File uploaded:', { path: file.path, filename: file.filename });

    res.json({
      success: true,
      data: {
        url: file.path,
        filename: file.filename,
      },
      message: 'Imagen subida exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({
      success: false,
      error: `Error al subir la imagen: ${errorMessage}`,
    } as ApiResponse);
  }
};

// Subir múltiples imágenes de producto
export const uploadProductImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No se proporcionaron imágenes',
      } as ApiResponse);
      return;
    }

    const files = req.files as (Express.Multer.File & { path: string })[];
    const urls = files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    res.json({
      success: true,
      data: urls,
      message: `${urls.length} imágenes subidas exitosamente`,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al subir las imágenes',
    } as ApiResponse);
  }
};

// Eliminar imagen de Cloudinary
export const deleteProductImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'URL de imagen requerida',
      } as ApiResponse);
      return;
    }

    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      await deleteImage(publicId);
    }

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la imagen',
    } as ApiResponse);
  }
};

// Agregar imagen a producto existente
export const addImageToProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No se proporcionó ninguna imagen',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    const file = req.file as Express.Multer.File & { path: string };
    const currentImages = product.imagenes || [];

    // Agregar nueva imagen al array
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        imagenes: [...currentImages, file.path],
      },
    });

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Imagen agregada al producto',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al agregar imagen a producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al agregar la imagen',
    } as ApiResponse);
  }
};

// Eliminar imagen de producto
export const removeImageFromProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        error: 'URL de imagen requerida',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    // Eliminar de Cloudinary
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      await deleteImage(publicId);
    }

    // Actualizar array de imágenes
    const currentImages = product.imagenes || [];
    const updatedImages = currentImages.filter((url) => url !== imageUrl);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { imagenes: updatedImages },
    });

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Imagen eliminada del producto',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al eliminar imagen de producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la imagen',
    } as ApiResponse);
  }
};

// Reordenar imágenes de producto (establecer imagen principal)
export const reorderProductImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { imagenes } = req.body;

    if (!imagenes || !Array.isArray(imagenes)) {
      res.status(400).json({
        success: false,
        error: 'Array de imágenes requerido',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { imagenes },
    });

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Orden de imágenes actualizado',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al reordenar imágenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al reordenar las imágenes',
    } as ApiResponse);
  }
};

// Subir logo de empresa
export const uploadLogo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No se proporcionó ninguna imagen',
      } as ApiResponse);
      return;
    }

    const file = req.file as Express.Multer.File & { path: string };

    res.json({
      success: true,
      data: {
        url: file.path,
        filename: file.filename,
      },
      message: 'Logo subido exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al subir logo:', error);
    res.status(500).json({
      success: false,
      error: 'Error al subir el logo',
    } as ApiResponse);
  }
};
