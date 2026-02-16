import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const enviarFeedback = async (req: Request, res: Response) => {
  try {
    const { tipo, asunto, descripcion } = req.body;
    const usuarioId = (req as any).usuario?.id; 

    if (!usuarioId) {
      return res.status(401).json({ message: 'Usuario no identificado' });
    }

    const nuevoFeedback = await Feedback.create({
      tipo,
      asunto,
      descripcion,
      usuarioId,
      estado: 'PENDIENTE'
    });

    return res.status(201).json({ message: '✅ Feedback recibido', nuevoFeedback });
  } catch (error: any) {
    console.error('ERROR EN FEEDBACK:', error);
    return res.status(500).json({ message: 'Error al procesar el envío' });
  }
};

export const obtenerFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json(feedbacks);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los datos' });
  }
};