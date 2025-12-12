import { Router } from 'express';
import { crearCliente, obtenerClientes } from '../controllers/clienteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, crearCliente);
router.get('/', authMiddleware, obtenerClientes);

export default router;