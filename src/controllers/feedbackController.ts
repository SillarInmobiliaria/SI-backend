import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const enviarFeedback = async (req: Request, res: Response) => {
  try {
    const { tipo, asunto, descripcion } = req.body;
    
    const usuarioId = (req as any).usuario?.id;

    if (!usuarioId) {
      console.error("DEBUG: Token válido pero no se encontró usuarioId en la request");
      return res.status(401).json({ message: 'Usuario no identificado en el sistema' });
    }

    const nuevoFeedback = await Feedback.create({
      tipo: tipo || 'BUG',
      asunto: asunto || 'Sin asunto',
      descripcion: descripcion || 'Sin descripción',
      usuarioId: usuarioId,
      estado: 'PENDIENTE'
    });

    return res.status(201).json({ message: '✅ Recibido', id: nuevoFeedback.id });
  } catch (error: any) {
    console.error('ERROR CRÍTICO BACKEND:', error.message);
    return res.status(500).json({ message: 'Error interno guardando reporte' });
  }
};

export const obtenerFeedbacks = async (_req: Request, res: Response) => {
  try {
    const data = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error al leer la DB' });
  }
};