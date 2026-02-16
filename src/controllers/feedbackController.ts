import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const enviarFeedback = async (req: Request, res: Response) => {
  try {
    const { tipo, asunto, descripcion } = req.body;
    
    const usuarioId = (req as any).usuario?.id || (req as any).user?.id || (req as any).usuarioId;

    if (!usuarioId) {
      console.error("DEBUG: Token validado pero NO se encontró ID de usuario en la petición");
      return res.status(401).json({ message: 'Sesión inválida o ID no encontrado' });
    }

    const nuevoFeedback = await Feedback.create({
      tipo: tipo || 'BUG',
      asunto: asunto || 'Sin asunto',
      descripcion: descripcion || 'Sin descripción',
      usuarioId: usuarioId,
      estado: 'PENDIENTE'
    });

    return res.status(201).json({ message: '✅ Recibido con éxito', id: nuevoFeedback.id });
  } catch (error: any) {
    console.error('ERROR CRÍTICO BACKEND:', error.message);
    return res.status(500).json({ message: 'Error interno en la base de datos' });
  }
};

export const obtenerFeedbacks = async (_req: Request, res: Response) => {
  try {
    const data = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error al leer la base de datos' });
  }
};