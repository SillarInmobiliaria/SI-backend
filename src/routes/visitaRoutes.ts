import { Router } from 'express';
import { 
    crearVisita, 
    obtenerVisitas, 
    actualizarVisita, 
    cancelarVisita, 
    exportarSeguimientoExcel 
} from '../controllers/visitaController';

// 👇 CORRECCIÓN: Usamos 'verificarToken' que es el nombre real en tu archivo
import { verificarToken } from '../middleware/authMiddleware'; 

const router = Router();

// Protegemos todas las rutas con 'verificarToken'
router.get('/', verificarToken, obtenerVisitas); 
router.post('/', verificarToken, crearVisita);
router.put('/:id', verificarToken, actualizarVisita);
router.put('/:id/cancelar', verificarToken, cancelarVisita);
router.get('/excel', verificarToken, exportarSeguimientoExcel);

export default router;