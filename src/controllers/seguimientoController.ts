import { Request, Response } from 'express';
import Seguimiento from '../models/Seguimiento';
import Cliente from '../models/Cliente';
import Propiedad from '../models/Propiedad';

// Crear nuevo seguimiento
export const crearSeguimiento = async (req: Request, res: Response) => {
  try {
    const nuevo = await Seguimiento.create(req.body);
    res.status(201).json({ message: 'Seguimiento registrado', data: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

// Obtener lista de seguimientos
export const obtenerSeguimientos = async (req: Request, res: Response) => {
  try {
    const lista = await Seguimiento.findAll({
      include: [Cliente, Propiedad],
      order: [['fecha', 'DESC']]
    });
    res.json(lista);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// (Pendiente <-> Finalizado)
export const actualizarSeguimiento = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const seguimiento = await Seguimiento.findByPk(id);
    
    if (!seguimiento) {
      return res.status(404).json({ message: 'Seguimiento no encontrado' });
    }

    // Actualizamos con los datos que lleguen (ej: estado: 'FINALIZADO')
    await seguimiento.update(req.body);
    
    res.json({ message: 'Seguimiento actualizado correctamente', data: seguimiento });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};