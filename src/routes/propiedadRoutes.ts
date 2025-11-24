import { Router } from 'express';
import { crearPropiedad, obtenerPropiedades } from '../controllers/propiedadController';
import upload from '../config/multer';

const router = Router();

// Configuramos la subida múltiple
const uploadFields = upload.fields([
  { name: 'fotoPrincipal', maxCount: 1 },
  { name: 'galeria', maxCount: 10 },
  { name: 'pdf', maxCount: 1 }
]);

router.post('/', uploadFields, crearPropiedad);
router.get('/', obtenerPropiedades);

export default router;