import { Router } from 'express';
import { 
    crearCliente, 
    obtenerClientes, 
    actualizarCliente,
    toggleEstadoCliente, 
    eliminarCliente,
    promoverACliente
} from '../controllers/clienteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearCliente);
router.get('/', authMiddleware, obtenerClientes);

router.put('/:id', authMiddleware, actualizarCliente);
router.put('/:id/promover', authMiddleware, promoverACliente);

router.put('/:id/estado', authMiddleware, toggleEstadoCliente);
router.delete('/:id', authMiddleware, eliminarCliente);

export default router;