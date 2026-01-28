import { Request, Response } from 'express';
import Captacion from '../models/Captacion';

// Obtener todas
export const getCaptaciones = async (req: Request, res: Response) => {
    try {
        const captaciones = await Captacion.findAll({ 
            order: [
                ['fechaCaptacion', 'DESC'], 
                ['createdAt', 'DESC']
            ] 
        });
        res.json(captaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener captaciones' });
    }
};

export const createCaptacion = async (req: Request, res: Response) => {
    try {
        const captacion = await Captacion.create(req.body);
        res.status(201).json(captacion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear captación' });
    }
};

// Editar
export const updateCaptacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Captacion.update(req.body, { where: { id } });
        res.json({ message: 'Captación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar captación' });
    }
};

// Carga Masiva
export const cargaMasivaCaptaciones = async (req: Request, res: Response) => {
    try {
        const datos = req.body;
        if (!Array.isArray(datos)) {
            res.status(400).json({ message: 'Formato inválido' });
            return;
        }
        await Captacion.bulkCreate(datos);
        res.json({ message: `Importadas ${datos.length} propiedades` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en carga masiva' });
    }
};

// Eliminar
export const deleteCaptacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Captacion.destroy({ where: { id } });
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};