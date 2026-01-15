import { Request, Response } from 'express';
import Agente from '../models/Agente';

// Obtener todos
export const getAgentes = async (req: Request, res: Response) => {
    try {
        const agentes = await Agente.findAll({ order: [['createdAt', 'DESC']] });
        res.json(agentes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener agentes' });
    }
};

// Crear uno nuevo
export const createAgente = async (req: Request, res: Response) => {
    try {
        const agente = await Agente.create(req.body);
        res.status(201).json(agente);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear agente' });
    }
};

// CARGA MASIVA DESDE EXCEL (NUEVO)
export const cargaMasivaAgentes = async (req: Request, res: Response) => {
    try {
        const agentes = req.body; // Recibimos un ARRAY de agentes
        
        if (!Array.isArray(agentes)) {
            res.status(400).json({ message: 'El formato debe ser una lista de agentes' });
            return;
        }

        // bulkCreate inserta todo de una sola vez (es muy rápido)
        await Agente.bulkCreate(agentes);

        res.json({ message: `Se importaron ${agentes.length} agentes correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en la carga masiva' });
    }
};

// Cambiar estado (El botón de tachar/rojo)
export const toggleEstadoAgente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const agente = await Agente.findByPk(id);
        if (!agente) {
             res.status(404).json({ message: 'Agente no encontrado' });
             return; 
        }

        // Si es ALIADO pasa a OBSERVADO, y viceversa
        agente.estado = agente.estado === 'ALIADO' ? 'OBSERVADO' : 'ALIADO';
        await agente.save();

        res.json(agente);
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar estado' });
    }
};

// Eliminar
export const deleteAgente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Agente.destroy({ where: { id } });
        res.json({ message: 'Agente eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};