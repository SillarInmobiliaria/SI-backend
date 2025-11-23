import { Router } from 'express';
import { crearVisita, obtenerVisitas } from '../controllers/visitaController';

const router = Router();

router.post('/', crearVisita);
router.get('/', obtenerVisitas);

export default router;