import { Router } from 'express';
import { crearSeguimiento, obtenerSeguimientos, actualizarSeguimiento } from '../controllers/seguimientoController';

const router = Router();

router.post('/', crearSeguimiento);
router.get('/', obtenerSeguimientos);
router.put('/:id', actualizarSeguimiento);

export default router;