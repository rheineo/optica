import { Router } from 'express';
import {
  getAllConfigs,
  getConfigsByCategory,
  getConfig,
  updateConfig,
  updateBulkConfigs,
  getPublicConfigs,
  getConfigHistory,
  testSmtpConnection,
} from '../controllers/configController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Ruta pública (sin autenticación)
router.get('/public', getPublicConfigs);

// Rutas protegidas (requieren admin)
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', getAllConfigs);
router.get('/categoria/:categoria', getConfigsByCategory);
router.get('/key/:key', getConfig);
router.get('/key/:key/history', getConfigHistory);
router.put('/key/:key', updateConfig);
router.put('/bulk', updateBulkConfigs);
router.post('/test-smtp', testSmtpConnection);

export default router;
