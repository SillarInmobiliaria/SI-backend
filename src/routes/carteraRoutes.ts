import { Router } from 'express';
import { getCartera, createClienteCartera, deleteClienteCartera, buscarParaAutocompletar } from '../controllers/carteraController';

const router = Router();

router.get('/buscar', buscarParaAutocompletar); 

router.get('/', getCartera);
router.post('/', createClienteCartera);
router.delete('/:id', deleteClienteCartera);

export default router;