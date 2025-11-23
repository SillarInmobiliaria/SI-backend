import { Router } from 'express';
import { crearOperacion, obtenerOperaciones } from '../controllers/operacionController';

const router = Router();

router.post('/', crearOperacion);
router.get('/', obtenerOperaciones);

export default router;