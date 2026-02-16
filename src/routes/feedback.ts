import { Router } from 'express';
import { enviarFeedback, obtenerFeedbacks } from '../controllers/feedbackController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Rutas de Feedback
router.post('/', authMiddleware, enviarFeedback);
router.get('/', authMiddleware, obtenerFeedbacks); 

export default router;