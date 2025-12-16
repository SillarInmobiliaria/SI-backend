import { Request, Response } from 'express';
import Interes from '../models/Interes';
import Propiedad from '../models/Propiedad';
import Cliente from '../models/Cliente';

// 1. CREAR INTERÉS
export const crearInteres = async (req: Request, res: Response) => {
    try {
        const { clienteId, propiedadId, nota } = req.body;
        
        // Buscamos si ya existe ese interés para no duplicar
        const existente = await Interes.findOne({ 
            where: { clienteId, propiedadId } 
        });

        if (existente) {
            // Si ya existe, actualizamos la nota
            existente.nota = nota;
            await existente.save();
            return res.json(existente);
        }

        const nuevo = await Interes.create({
            clienteId,
            propiedadId,
            nota
        });

        res.status(201).json(nuevo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar interés' });
    }
};

// 2. OBTENER TODOS (AQUÍ ESTABA EL PROBLEMA)
export const obtenerIntereses = async (req: Request, res: Response) => {
    try {
        const intereses = await Interes.findAll({
            include: [
                { 
                    model: Propiedad,
                    attributes: ['id', 'direccion', 'ubicacion', 'precio', 'moneda', 'modalidad'] 
                },
                { 
                    model: Cliente,
                    attributes: ['id', 'nombre']
                }
            ]
        });
        res.json(intereses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener intereses' });
    }
};

// 3. ELIMINAR INTERÉS
export const eliminarInteres = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Interes.destroy({ where: { id } });
        res.json({ message: 'Interés eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar' });
    }
};