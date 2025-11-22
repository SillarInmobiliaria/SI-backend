import { Router } from 'express';
import { crearPropietario, obtenerPropietarios } from '../controllers/propietarioController';

const router = Router();

// POST http://localhost:4000/api/propietarios
router.post('/', crearPropietario);

// GET http://localhost:4000/api/propietarios
router.get('/', obtenerPropietarios);

export default router;