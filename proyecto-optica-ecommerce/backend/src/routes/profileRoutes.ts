import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/profileController';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de perfil
router.get('/', getProfile);
router.put('/', updateProfile);

// Rutas de direcciones
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);

export default router;
