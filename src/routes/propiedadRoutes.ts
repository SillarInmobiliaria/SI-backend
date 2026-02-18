import { Router } from 'express';
import { 
    crearPropiedad, obtenerPropiedades, getPropiedad, updatePropiedad, 
    toggleEstadoPropiedad, eliminarPropiedad, subirPdfDocumento
} from '../controllers/propiedadController';
import upload from '../config/multer';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const uploadFields = upload.fields([
  { name: 'fotoPrincipal', maxCount: 1 },
  { name: 'galeria', maxCount: 30 },
  { name: 'pdf', maxCount: 1 }
]);

router.post('/', authMiddleware, uploadFields, crearPropiedad);
router.get('/', obtenerPropiedades);
router.get('/:id', getPropiedad);
router.put('/:id', authMiddleware, updatePropiedad);

// Para la subida de PDFs individuales desde la auditoría
router.post('/:id/upload-pdf', authMiddleware, upload.single('file'), subirPdfDocumento);

// Rutas Admin
router.put('/:id/estado', authMiddleware, toggleEstadoPropiedad);
router.delete('/:id', authMiddleware, eliminarPropiedad);

export default router;