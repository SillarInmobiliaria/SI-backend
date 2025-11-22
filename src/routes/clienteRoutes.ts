import { Router } from 'express';
import { crearCliente, obtenerClientes } from '../controllers/clienteController';

const router = Router();

router.post('/', crearCliente);
router.get('/', obtenerClientes);

export default router;