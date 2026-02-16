import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import Usuario from '../models/Usuario';

export const enviarFeedback = async (req: Request, res: Response) => {
  try {
    const { tipo, asunto, descripcion } = req.body;
    const usuarioId = (req as any).usuario?.id; // Ajusta según cómo manejes el auth

    const nuevoFeedback = await Feedback.create({
      tipo,
      asunto,
      descripcion,
      usuarioId
    });

    res.status(201).json({ message: '¡Gracias! Tu mensaje ha sido enviado.', nuevoFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el feedback' });
  }
};

export const obtenerFeedbacks = async (req: Request, res: Response) => {
  try {
    const lista = await Feedback.findAll({
      include: [{ model: Usuario, attributes: ['nombre', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener feedbacks' });
  }
};