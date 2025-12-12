import { Router } from 'express';
import { crearPropietario, obtenerPropietarios } from '../controllers/propietarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protegemos las rutas
router.post('/', authMiddleware, crearPropietario);
router.get('/', authMiddleware, obtenerPropietarios);

export default router;