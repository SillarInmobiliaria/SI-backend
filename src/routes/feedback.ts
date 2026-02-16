import { Router } from 'express';
import { enviarFeedback, obtenerFeedbacks, finalizarFeedback } from '../controllers/feedbackController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, enviarFeedback);
router.get('/', authMiddleware, obtenerFeedbacks);

router.put('/:id/finalizar', authMiddleware, finalizarFeedback);

export default router;