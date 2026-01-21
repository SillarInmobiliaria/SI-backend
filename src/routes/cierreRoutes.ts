import { Router } from 'express';
import { createCierre, getCierres } from '../controllers/cierreController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createCierre);
router.get('/', authMiddleware, getCierres);

export default router;