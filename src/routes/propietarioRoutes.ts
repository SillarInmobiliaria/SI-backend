import { Router } from 'express';
import { createPropietario, getPropietarios } from '../controllers/propietarioController';

const router = Router();

// Obtener todos los propietarios
router.get('/', getPropietarios);

// Crear un nuevo propietario
router.post('/', createPropietario);

export default router;