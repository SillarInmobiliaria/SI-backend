import { Request, Response } from 'express';
import Cierre from '../models/Cierre';

// Crear un nuevo cierre
export const createCierre = async (req: Request, res: Response) => {
    try {
        const dataToSave = { ...req.body };
        
        if (dataToSave.tipoFirmaAlquiler !== undefined) {
            dataToSave.tipoFirma = dataToSave.tipoFirmaAlquiler;
        }
        
        if (dataToSave.plazo !== undefined) {
            dataToSave.plazoContrato = dataToSave.plazo;
        }
        
        if (dataToSave.mascotas !== undefined) {
            dataToSave.permiteMascotas = dataToSave.mascotas;
        }
        
        if (dataToSave.cochera !== undefined) {
            dataToSave.incluyeCochera = dataToSave.cochera;
        }

        if (dataToSave.clienteNombre && !dataToSave.clienteId) {
            dataToSave.clienteId = dataToSave.clienteNombre; 
        }

        const nuevoCierre = await Cierre.create(dataToSave);
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