import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

export const crearPropiedad = async (req: Request, res: Response) => {
  try {
    // Los datos de texto vienen en req.body
    // Los archivos vienen en req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Obtener las rutas de los archivos subidos
    const fotoPrincipal = files['fotoPrincipal'] ? files['fotoPrincipal'][0].path : null;
    const pdfUrl = files['pdf'] ? files['pdf'][0].path : null;
    
    // Para la galería, mapeamos todos los archivos a sus rutas
    const galeria = files['galeria'] ? files['galeria'].map(f => f.path) : [];

    const nuevaPropiedad = await Propiedad.create({
      ...req.body,
      fotoPrincipal,
      galeria,
      pdfUrl
    });

    res.status(201).json({ message: 'Propiedad creada', data: nuevaPropiedad });
  } catch (error: any) {
    console.error(error);
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