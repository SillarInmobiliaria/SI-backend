import { Router } from 'express';
import { getDashboardStats, exportarReporteExcel } from '../controllers/dashboardController';

// Importamos TU middleware y el nuevo de admin
import { authMiddleware, esAdmin } from '../middleware/authMiddleware'; 

const router = Router();

// 1. Estadísticas JSON (Protegido: Login + Admin)
router.get('/stats', [authMiddleware, esAdmin], getDashboardStats);

// 2. Exportar Excel (Protegido: Login + Admin)
router.get('/exportar', [authMiddleware, esAdmin], exportarReporteExcel);

export default router;