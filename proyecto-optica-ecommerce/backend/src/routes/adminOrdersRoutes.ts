import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  addInternalNotes,
  cancelOrder,
  updateShippingInfo,
  getOrderStats,
} from '../controllers/adminOrdersController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/orders/stats - Estadísticas (debe ir antes de /:id)
router.get('/stats', getOrderStats);

// GET /api/admin/orders - Listar pedidos
router.get('/', getOrders);

// GET /api/admin/orders/:id - Detalle de pedido
router.get('/:id', getOrderById);

// PUT /api/admin/orders/:id/estado - Actualizar estado
router.put('/:id/estado', updateOrderStatus);

// POST /api/admin/orders/:id/notas - Agregar notas internas
router.post('/:id/notas', addInternalNotes);

// POST /api/admin/orders/:id/cancelar - Cancelar pedido
router.post('/:id/cancelar', cancelOrder);

// PUT /api/admin/orders/:id/envio - Actualizar info de envío
router.put('/:id/envio', updateShippingInfo);

export default router;
