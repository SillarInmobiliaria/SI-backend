import { Router } from 'express';
import { crearSeguimiento, obtenerSeguimientos } from '../controllers/seguimientoController';

const router = Router();

router.post('/', crearSeguimiento);
router.get('/', obtenerSeguimientos);

export default router;