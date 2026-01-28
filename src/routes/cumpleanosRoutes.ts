import { Router } from 'express';
import { obtenerCumpleanos, exportarExcelCumpleanos } from '../controllers/cumpleanosController';
import { verificarToken, esAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verificarToken, esAdmin, obtenerCumpleanos);

router.get('/excel', verificarToken, esAdmin, exportarExcelCumpleanos);

export default router;