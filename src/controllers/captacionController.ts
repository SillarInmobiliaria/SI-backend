import { Request, Response } from 'express';
import Captacion from '../models/Captacion';

// Obtener todas (Ordenadas por Fecha de Captación DESC)
export const getCaptaciones = async (req: Request, res: Response) => {
    try {
        const captaciones = await Captacion.findAll({ 
            order: [
                ['fechaCaptacion', 'DESC'], // <--- CAMBIO IMPORTANTE: Ordenar por fecha real
                ['createdAt', 'DESC']       // En caso de empate, por fecha de creación
            ] 
        });
        res.json(captaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener captaciones' });
    }
};

// Crear una
export const createCaptacion = async (req: Request, res: Response) => {
    try {
        const captacion = await Captacion.create(req.body);
        res.status(201).json(captacion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear captación' });
    }
};

// Carga Masiva (Excel)
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