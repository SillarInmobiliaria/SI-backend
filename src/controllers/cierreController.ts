import { Request, Response } from 'express';
import Cierre from '../models/Cierre';

// Crear un nuevo cierre
export const createCierre = async (req: Request, res: Response) => {
    try {
        const nuevoCierre = await Cierre.create(req.body);
        res.status(201).json(nuevoCierre);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el cierre' });
    }
};

// Obtener todos los cierres
export const getCierres = async (req: Request, res: Response) => {
    try {
        const cierres = await Cierre.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(cierres);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cierres' });
    }
};