import { Router } from 'express';
import { obtenerCumpleanos, exportarExcelCumpleanos } from '../controllers/cumpleanosController';
import { verificarToken, esAdmin } from '../middleware/authMiddleware'; // Asegúrate de tener estos middlewares

const router = Router();

// RUTA BASE: /api/admin/cumpleanos

router.get('/', verificarToken, esAdmin, obtenerCumpleanos);

router.get('/excel', verificarToken, esAdmin, exportarExcelCumpleanos);

export default router;