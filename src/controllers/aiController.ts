import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos la API Key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

// Usamos el modelo estable y potente para redacción (como al principio)
const MODEL_NAME = "gemini-2.5-flash"; 

// ==========================================
// 1. GENERAR DESCRIPCIÓN (MARKETING) - ✅ ACTIVO
// ==========================================
export const generarDescripcion = async (req: Request, res: Response) => {
  try {
    const { tipo, modalidad, ubicacion, direccion, habitaciones, banos, area, precio } = req.body;
    
    // Configuración del modelo
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Actúa como un experto agente inmobiliario de "Sillar Inmobiliaria".
      Redacta una descripción atractiva y profesional para vender/alquilar esta propiedad (máximo 120 palabras):
      
      - ${tipo} en ${modalidad}
      - Ubicación: ${ubicacion} (${direccion || ''})
      - Precio: ${precio}
      - Características: ${habitaciones} habitaciones, ${banos} baños, ${area} m2.
      
      Usa emojis estratégicos (🏠, 📍, ✨) y un tono persuasivo de venta.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return res.status(200).json({ descripcion: response.text() });

  } catch (error: any) {
    console.error("Error Gemini Marketing:", error);
    return res.status(500).json({ message: "Error al generar la descripción. Inténtalo de nuevo." });
  }
};

// 2. CHAT ARI - 🚧 EN MANTENIMIENTO

export const chatAri = async (req: Request, res: Response) => {
    
    return res.json({ 
        respuesta: "🦁 ¡Hola! Soy Ari. En este momento estoy pasando por una actualización de sistema para servirte mejor. 🚧\n\nPor ahora, esta función está en **mantenimiento**, pero muy pronto podré ayudarte a buscarte todo lo que necesites. ¡Gracias por tu paciencia!" 
    });
};