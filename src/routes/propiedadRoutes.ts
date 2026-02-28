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
  { name: 'pdf', maxCount: 1 },
  // NUEVOS CAMPOS DE AUDITORÍA (PDFs)
  { name: 'file_testimonio', maxCount: 1 },
  { name: 'file_hr', maxCount: 1 },
  { name: 'file_pu', maxCount: 1 },
  { name: 'file_impuestoPredial', maxCount: 1 },
  { name: 'file_arbitrios', maxCount: 1 },
  { name: 'file_copiaLiteral', maxCount: 1 },
  { name: 'file_cri', maxCount: 1 },
  { name: 'file_reciboAguaLuz', maxCount: 1 }
]);

router.post('/', authMiddleware, uploadFields, crearPropiedad);
router.get('/', obtenerPropiedades);
router.get('/:id', getPropiedad);
router.put('/:id', authMiddleware, updatePropiedad);

// ESTA RUTA DEBE COINCIDIR CON EL FRONT
router.post('/:id/upload-pdf', authMiddleware, upload.single('file'), subirPdfDocumento);

router.put('/:id/estado', authMiddleware, toggleEstadoPropiedad);
router.delete('/:id', authMiddleware, eliminarPropiedad);

export default router;