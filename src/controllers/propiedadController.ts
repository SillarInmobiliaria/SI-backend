import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

export const crearPropiedad = async (req: Request, res: Response) => {
  try {
    const { direccion, precio, moneda, tipo, modalidad, descripcion, propietarioId, area, areaConstruida } = req.body;

    // Verificar que el propietario exista
    const propietario = await Propietario.findByPk(propietarioId);
    if (!propietario) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }

    const nuevaPropiedad = await Propiedad.create({
      direccion,
      precio,
      moneda,
      tipo,
      modalidad,
      descripcion,
      propietarioId,
      area,
      areaConstruida
    });

    res.status(201).json({ message: 'Propiedad creada', data: nuevaPropiedad });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear propiedad', error: error.message });
  }
};

export const obtenerPropiedades = async (req: Request, res: Response) => {
  try {
    const propiedades = await Propiedad.findAll({ include: Propietario });
    res.json(propiedades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};