import { Router } from 'express';
import { 
    crearVisita, 
    obtenerVisitas, 
    actualizarVisita, 
    cancelarVisita, 
    exportarSeguimientoExcel 
} from '../controllers/visitaController';

import { verificarToken } from '../middleware/authMiddleware'; 

const router = Router();

router.get('/', verificarToken, obtenerVisitas); 
router.post('/', verificarToken, crearVisita);
router.put('/:id', verificarToken, actualizarVisita);
router.put('/:id/cancelar', verificarToken, cancelarVisita);
router.get('/excel', verificarToken, exportarSeguimientoExcel);

export default router;