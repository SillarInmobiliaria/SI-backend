import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generarDescripcion = async (req: Request, res: Response) => {
  try {
    const { tipo, modalidad, ubicacion, direccion, habitaciones, banos, area, precio } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Falta configurar la API Key en el servidor." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Actúa como un agente inmobiliario experto.
      Escribe una descripción de venta atractiva (máximo 100 palabras) para:
      - Propiedad: ${tipo} en ${modalidad}
      - Ubicación: ${ubicacion} (${direccion})
      - Precio: $${precio} USD
      - Detalles: ${habitaciones} habs, ${banos} baños, ${area} m2.
      
      Usa un tono profesional, persuasivo y usa algunos emojis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoGenerado = response.text();

    return res.status(200).json({ descripcion: textoGenerado });

  } catch (error: any) {
    console.error("Error Gemini:", error);
    return res.status(500).json({ message: "Error al conectar con la IA." });
  }
};