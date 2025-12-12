import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

export const crearPropiedad = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user; // 👈 El usuario logueado
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const fotoPrincipal = files['fotoPrincipal'] ? files['fotoPrincipal'][0].path : null;
    const pdfUrl = files['pdf'] ? files['pdf'][0].path : null;
    const galeria = files['galeria'] ? files['galeria'].map(f => f.path) : [];

    const nuevaPropiedad = await Propiedad.create({
      ...req.body,
      fotoPrincipal,
      galeria,
      pdfUrl,
      usuarioId: usuario.id // 👈 ¡IMPORTANTÍSIMO!
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
    // ⚠️ OJO: Aquí depende de tu estrategia comercial.
    // Opción A: Los asesores SOLO ven sus propiedades (Privacidad total).
    // Opción B: Los asesores ven TODO el stock para poder vender (Venta cruzada).
    
    // Si quieres PRIVACIDAD TOTAL (como pediste):
    const usuario = (req as any).user; // Ojo: en rutas públicas (landing page) no hay usuario
    let whereClause = {};

    // Solo aplicamos filtro si hay un usuario logueado Y no es Admin
    if (usuario && usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const propiedades = await Propiedad.findAll({ 
      where: whereClause, // 👈 Filtro aplicado
      include: [ { model: Propietario } ] 
    });
    res.json(propiedades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};