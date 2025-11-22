import { Router } from 'express';
import { crearPropiedad, obtenerPropiedades } from '../controllers/propiedadController';

const router = Router();

router.post('/', crearPropiedad);
router.get('/', obtenerPropiedades);

export default router;