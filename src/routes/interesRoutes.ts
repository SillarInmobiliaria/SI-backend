import { Router } from 'express';
import { crearInteres, obtenerIntereses } from '../controllers/interesController';

const router = Router();

router.post('/', crearInteres);
router.get('/', obtenerIntereses);

export default router;