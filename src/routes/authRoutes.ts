import { Router } from 'express';
import { login, cambiarPassword, registrarAdmin } from '../controllers/authController';

const router = Router();

// POST: /api/auth/login
router.post('/login', login);

// POST: /api/auth/cambiar-password
router.post('/cambiar-password', cambiarPassword);

// POST: /api/auth/registro-admin (Solo para uso inicial o del CEO)
router.post('/registro-admin', registrarAdmin);

export default router;