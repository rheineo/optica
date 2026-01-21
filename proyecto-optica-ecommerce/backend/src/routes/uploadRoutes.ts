import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import { uploadProductImage as uploadProductMiddleware, uploadLogo as uploadLogoMiddleware } from '../config/cloudinary';
import {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  addImageToProduct,
  removeImageFromProduct,
  reorderProductImages,
  uploadLogo,
} from '../controllers/uploadController';

const router = Router();

// Todas las rutas requieren autenticación de admin
router.use(authMiddleware, adminMiddleware);

// Subir imagen individual (retorna URL)
router.post('/product', uploadProductMiddleware.single('image'), uploadProductImage);

// Subir múltiples imágenes (retorna URLs)
router.post('/products', uploadProductMiddleware.array('images', 10), uploadProductImages);

// Eliminar imagen de Cloudinary
router.delete('/product', deleteProductImage);

// Agregar imagen a producto existente
router.post('/product/:id/image', uploadProductMiddleware.single('image'), addImageToProduct);

// Eliminar imagen de producto
router.delete('/product/:id/image', removeImageFromProduct);

// Reordenar imágenes de producto
router.put('/product/:id/images/reorder', reorderProductImages);

// Subir logo de empresa
router.post('/logo', uploadLogoMiddleware.single('image'), uploadLogo);

export default router;
