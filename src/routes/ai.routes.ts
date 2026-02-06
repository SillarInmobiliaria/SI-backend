import { Router } from 'express';
import { generarDescripcion, chatAri } from '../controllers/aiController';

const router = Router();

router.post('/generar', generarDescripcion);
router.post('/chat-ari', chatAri);

export default router;