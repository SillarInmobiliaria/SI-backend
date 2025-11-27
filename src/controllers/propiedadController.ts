import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

export const crearPropiedad = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const fotoPrincipal = files['fotoPrincipal'] ? files['fotoPrincipal'][0].path : null;
    const pdfUrl = files['pdf'] ? files['pdf'][0].path : null;
    const galeria = files['galeria'] ? files['galeria'].map(f => f.path) : [];

    // Crear la propiedad
    const nuevaPropiedad = await Propiedad.create({
      ...req.body,
      fotoPrincipal,
      galeria,
      pdfUrl
    });

    if (req.body.propietarios) {
      const propietariosIds = JSON.parse(req.body.propietarios);
      if (Array.isArray(propietariosIds)) {
        await (nuevaPropiedad as any).setPropietarios(propietariosIds);
      }
    }

    res.status(201).json({ message: 'Propiedad creada', data: nuevaPropiedad });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear propiedad', error: error.message });
  }
};

export const obtenerPropiedades = async (req: Request, res: Response) => {
  try {
    // Incluir la lista de Propietarios asociados
    const propiedades = await Propiedad.findAll({ 
      include: [
        { model: Propietario } 
      ] 
    });
    res.json(propiedades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};