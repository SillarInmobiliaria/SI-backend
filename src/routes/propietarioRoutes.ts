import { Router } from 'express';
import { 
    crearPropietario, 
    obtenerPropietarios, 
    toggleEstadoPropietario, 
    eliminarPropietario 
} from '../controllers/propietarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearPropietario);
router.get('/', authMiddleware, obtenerPropietarios);

router.put('/:id/estado', authMiddleware, toggleEstadoPropietario);
router.delete('/:id', authMiddleware, eliminarPropietario);

export default router;