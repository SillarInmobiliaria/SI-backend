import { Router } from 'express';
import { crearUsuario, obtenerUsuarios } from '../controllers/usuarioController';
import { verificarToken, esAdmin } from '../middleware/authMiddleware';

const router = Router();

// Rutas Protegidas (Solo Admins pueden ver y crear usuarios)
router.get('/', verificarToken, esAdmin, obtenerUsuarios);
router.post('/', verificarToken, esAdmin, crearUsuario);

export default router;