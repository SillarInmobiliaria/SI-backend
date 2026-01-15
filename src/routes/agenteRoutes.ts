import { Router } from 'express';
import { getAgentes, createAgente, toggleEstadoAgente, deleteAgente } from '../controllers/agenteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getAgentes);
router.post('/', authMiddleware, createAgente);
router.put('/:id/estado', authMiddleware, toggleEstadoAgente);
router.delete('/:id', authMiddleware, deleteAgente);

export default router;