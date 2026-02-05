import { Router } from 'express';
import { generarDescripcion } from '../controllers/aiController';

const router = Router();

router.post('/generar', generarDescripcion);

export default router;