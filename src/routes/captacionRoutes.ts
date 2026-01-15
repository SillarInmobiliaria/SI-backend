import { Router } from 'express';
import { getCaptaciones, createCaptacion, cargaMasivaCaptaciones, deleteCaptacion } from '../controllers/captacionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getCaptaciones);
router.post('/', authMiddleware, createCaptacion);
router.post('/masiva', authMiddleware, cargaMasivaCaptaciones);
router.delete('/:id', authMiddleware, deleteCaptacion);

export default router;