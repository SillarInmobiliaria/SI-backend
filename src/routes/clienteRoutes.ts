import { Router } from 'express';
import { 
    crearCliente, 
    obtenerClientes, 
    actualizarCliente, // <-- NUEVA FUNCIÓN AÑADIDA
    toggleEstadoCliente, 
    eliminarCliente 
} from '../controllers/clienteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearCliente);
router.get('/', authMiddleware, obtenerClientes);

// <-- NUEVA RUTA PARA ACTUALIZAR -->
router.put('/:id', authMiddleware, actualizarCliente);

router.put('/:id/estado', authMiddleware, toggleEstadoCliente);
router.delete('/:id', authMiddleware, eliminarCliente);

export default router;