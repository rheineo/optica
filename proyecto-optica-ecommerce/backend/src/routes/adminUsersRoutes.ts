import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  resetPassword,
  deleteUser,
  addNotes,
  updateTags,
  getUserOrders,
  getUserStats,
  verifyEmail,
} from '../controllers/adminUsersController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Estadísticas (debe ir antes de /:id para evitar conflicto)
router.get('/stats', getUserStats);

// CRUD de usuarios
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Acciones sobre usuarios
router.post('/:id/bloquear', blockUser);
router.post('/:id/desbloquear', unblockUser);
router.post('/:id/reset-password', resetPassword);
router.post('/:id/notas', addNotes);
router.put('/:id/etiquetas', updateTags);
router.post('/:id/verify-email', verifyEmail);

// Historial de pedidos del usuario
router.get('/:id/orders', getUserOrders);

export default router;
