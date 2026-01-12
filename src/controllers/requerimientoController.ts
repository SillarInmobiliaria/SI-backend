import { Request, Response } from 'express';
import Requerimiento from '../models/Requerimiento';
import Cliente from '../models/Cliente';

// Crear Requerimiento
export const crearRequerimiento = async (req: Request, res: Response) => {
  try {
    const nuevo = await Requerimiento.create(req.body);
    res.status(201).json({ message: 'Requerimiento creado', data: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear', error: error.message });
  }
};

// Obtener Todos
export const obtenerRequerimientos = async (req: Request, res: Response) => {
  try {
    const lista = await Requerimiento.findAll({
      include: [Cliente],
      order: [['fecha', 'DESC']]
    });
    res.json(lista);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// Actualizar Estado (Atendido / Descartado)
export const actualizarEstadoReq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const reqDb = await Requerimiento.findByPk(id);
    if (!reqDb) return res.status(404).json({ message: 'No encontrado' });

    await reqDb.update({ estado });
    res.json({ message: 'Estado actualizado', data: reqDb });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};