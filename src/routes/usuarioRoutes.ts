import { Router } from 'express';
import { 
    createUsuario, 
    getUsuarios, 
    toggleEstadoUsuario, 
    deleteUsuario,
    getNotificaciones
} from '../controllers/usuarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createUsuario);
router.get('/', authMiddleware, getUsuarios);
router.put('/:id/estado', authMiddleware, toggleEstadoUsuario);
router.delete('/:id', authMiddleware, deleteUsuario);
router.get('/notificaciones', authMiddleware, getNotificaciones);

export default router;