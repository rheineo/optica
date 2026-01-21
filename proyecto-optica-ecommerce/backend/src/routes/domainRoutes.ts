import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import {
  getDomainsByType,
  getAllDomains,
  getAllDomainsAdmin,
  createDomain,
  updateDomain,
  deleteDomain,
} from '../controllers/domainController';

const router = Router();

// Rutas públicas
router.get('/', getAllDomains);
router.get('/:tipo', getDomainsByType);

// Rutas de admin
router.get('/admin/all', authMiddleware, adminMiddleware, getAllDomainsAdmin);
router.post('/', authMiddleware, adminMiddleware, createDomain);
router.put('/:id', authMiddleware, adminMiddleware, updateDomain);
router.delete('/:id', authMiddleware, adminMiddleware, deleteDomain);

export default router;
