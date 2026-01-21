import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Cartera from '../models/Cartera'; 
import Cliente from '../models/Cliente'; 

// 1. BUSCADOR INTELIGENTE (Autocompletado)
export const buscarParaAutocompletar = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const encontrados = await Cliente.findAll({
            where: {
                nombre: { [Op.iLike]: `%${query}%` } 
            },
            limit: 20, 
            order: [['nombre', 'ASC']], 
            attributes: ['id', 'nombre', ['telefono1', 'telefono'], 'email'] 
        });
        
        res.json(encontrados);

    } catch (error) {
        console.error("Error en el buscador:", error);
        res.status(500).json({ msg: 'Error al buscar en la base de datos' });
    }
};

// OBTENER CARTERA
export const getCartera = async (req: Request, res: Response) => {
    try {
        const lista = await Cartera.findAll({ order: [['nombreCompleto', 'ASC']] });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener cartera' });
    }
};

// CREAR CLIENTE EN CARTERA
export const createClienteCartera = async (req: Request, res: Response) => {
    try {
        const nuevo = await Cartera.create(req.body);
        res.json(nuevo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al guardar cliente' });
    }
};

// ELIMINAR DE CARTERA
export const deleteClienteCartera = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Cartera.destroy({ where: { id } });
        res.json({ msg: 'Eliminado de cartera' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar' });
    }
};