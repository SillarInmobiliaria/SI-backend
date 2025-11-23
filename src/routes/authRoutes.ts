import { Router } from 'express';
// Asegúrate de tener también el controlador creado (Paso 2)
import { registro, login } from '../controllers/authController';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);

export default router;