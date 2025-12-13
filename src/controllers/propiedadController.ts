import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

// 1. CREAR
export const crearPropiedad = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fotoPrincipal = files['fotoPrincipal'] ? files['fotoPrincipal'][0].path : null;
    const pdfUrl = files['pdf'] ? files['pdf'][0].path : null;
    const galeria = files['galeria'] ? files['galeria'].map(f => f.path) : [];

    const nuevaPropiedad = await Propiedad.create({
      ...req.body,
      fotoPrincipal, galeria, pdfUrl,
      usuarioId: usuario.id,
      activo: true
    });

    if (req.body.propietarios) {
      const propietariosIds = JSON.parse(req.body.propietarios);
      if (Array.isArray(propietariosIds)) await (nuevaPropiedad as any).setPropietarios(propietariosIds);
    }
    res.status(201).json({ message: 'Propiedad creada', data: nuevaPropiedad });
  } catch (error: any) { res.status(500).json({ message: 'Error al crear', error: error.message }); }
};

// 2. OBTENER (CORREGIDO: Sin filtro de activo)
export const obtenerPropiedades = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause: any = {};

    if (usuario && usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const propiedades = await Propiedad.findAll({ 
      where: whereClause, 
      include: [ { model: Propietario } ] 
    });
    res.json(propiedades);
  } catch (error) { res.status(500).json({ message: 'Error al obtener' }); }
};

// 3. OBTENER UNO
export const getPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        res.json(propiedad);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

// 4. ACTUALIZAR
export const updatePropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        await propiedad.update(req.body);
        res.json({ message: 'Actualizada', propiedad });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

// 5. SUSPENDER
export const toggleEstadoPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        await propiedad.update({ activo });
        res.json({ message: `Estado actualizado` });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

// 6. ELIMINAR
export const eliminarPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        await propiedad.destroy();
        res.json({ message: 'Eliminado' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};