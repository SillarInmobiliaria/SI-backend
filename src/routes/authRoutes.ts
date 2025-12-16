import { Router } from 'express';
import { login, cambiarPassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);

router.post('/cambiar-password', authMiddleware, cambiarPassword);

export default router;