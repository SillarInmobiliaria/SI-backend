import { Router } from 'express';
import { login, cambiarPassword, registrarAdmin } from '../controllers/authController';

const router = Router();

// Ruta para Login
router.post('/login', login);

// Ruta para Cambiar Contraseña
// El frontend suele llamar a /api/auth/cambiar-password
router.post('/cambiar-password', cambiarPassword);

// Ruta extra para crear admins manualmente si lo necesitas
router.post('/registro-admin', registrarAdmin);

export default router;