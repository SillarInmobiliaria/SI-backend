import { Router } from 'express';
import { 
    crearPropietario, 
    obtenerPropietarios, 
    toggleEstadoPropietario, 
    eliminarPropietario,
    updatePropietario
} from '../controllers/propietarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearPropietario);
router.get('/', authMiddleware, obtenerPropietarios);

// --- RUTA NUEVA PARA EDITAR ---
router.put('/:id', authMiddleware, updatePropietario);

router.put('/:id/estado', authMiddleware, toggleEstadoPropietario);
router.delete('/:id', authMiddleware, eliminarPropietario);

export default router;