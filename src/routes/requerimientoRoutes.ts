import { Router } from 'express';
import { crearRequerimiento, obtenerRequerimientos, actualizarEstadoReq } from '../controllers/requerimientoController';

const router = Router();

router.post('/', crearRequerimiento);
router.get('/', obtenerRequerimientos);
router.put('/:id', actualizarEstadoReq);

export default router;