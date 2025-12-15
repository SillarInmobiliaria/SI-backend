import { Router } from 'express';
import { crearVisita, obtenerVisitas, actualizarVisita, exportarSeguimientoExcel } from '../controllers/visitaController';
import { authMiddleware } from '../middleware/authMiddleware'; 

const router = Router();

router.use(authMiddleware);

router.get('/exportar', exportarSeguimientoExcel);

router.get('/', obtenerVisitas);
router.post('/', crearVisita);
router.put('/:id', actualizarVisita);

export default router;