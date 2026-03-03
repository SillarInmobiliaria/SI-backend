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
  { name: 'file_testimonio', maxCount: 10 },
  { name: 'file_hr', maxCount: 10 },
  { name: 'file_pu', maxCount: 10 },
  { name: 'file_impuestoPredial', maxCount: 10 },
  { name: 'file_arbitrios', maxCount: 10 },
  { name: 'file_copiaLiteral', maxCount: 10 },
  { name: 'file_cri', maxCount: 10 },
  { name: 'file_reciboAguaLuz', maxCount: 10 },
  { name: 'file_planos', maxCount: 10 },
  { name: 'file_certificadoParametros', maxCount: 10 },
  { name: 'file_certificadoZonificacion', maxCount: 10 },
  { name: 'file_otros', maxCount: 10 }
]);

router.post('/', authMiddleware, uploadFields, crearPropiedad);
router.get('/', obtenerPropiedades);
router.get('/:id', getPropiedad);

router.put('/:id', authMiddleware, uploadFields, updatePropiedad);

// También permitimos la subida múltiple en la ruta de actualización individual
router.post('/:id/upload-pdf', authMiddleware, upload.array('files', 10), subirPdfDocumento);

router.put('/:id/estado', authMiddleware, toggleEstadoPropiedad);
router.delete('/:id', authMiddleware, eliminarPropiedad);

export default router;