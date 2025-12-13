import { Router } from 'express';
import { 
    crearCliente, 
    obtenerClientes, 
    toggleEstadoCliente, 
    eliminarCliente 
} from '../controllers/clienteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearCliente);
router.get('/', authMiddleware, obtenerClientes);

router.put('/:id/estado', authMiddleware, toggleEstadoCliente);
router.delete('/:id', authMiddleware, eliminarCliente);

export default router;