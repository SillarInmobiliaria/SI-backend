import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const MODEL_NAME = "gemini-2.0-flash-lite-001"; 

// --- HERRAMIENTAS ---
function capitalizar(texto: string) {
    if (!texto) return "";
    return texto.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

async function buscarPropiedadesUniversal(whereClause: any) {
    // Probamos todos los nombres posibles de la tabla
    // @ts-ignore
    if (prisma.propiedades) return await prisma.propiedades.findMany({ where: whereClause, take: 5, orderBy: { createdAt: 'desc' } });
    // @ts-ignore
    if (prisma.propiedad) return await prisma.propiedad.findMany({ where: whereClause, take: 5, orderBy: { createdAt: 'desc' } });
    // @ts-ignore
    if (prisma.Propiedades) return await prisma.Propiedades.findMany({ where: whereClause, take: 5, orderBy: { createdAt: 'desc' } });
    // @ts-ignore
    if (prisma.Propiedad) return await prisma.Propiedad.findMany({ where: whereClause, take: 5, orderBy: { createdAt: 'desc' } });
    return [];
}

async function contarRegistros(entidad: string, filtrosFecha: any) {
    if (entidad.toLowerCase().includes('asesor') || entidad.toLowerCase().includes('admin')) {
        // @ts-ignore
        if (prisma.usuario) return await prisma.usuario.count();
        // @ts-ignore 
        if (prisma.users) return await prisma.users.count();
    }

    const nombres = [entidad, entidad.toLowerCase(), entidad + 's', entidad.toLowerCase() + 's'];
    for (const nombre of nombres) {
        // @ts-ignore
        if (prisma[nombre]) return await prisma[nombre].count({ where: filtrosFecha });
    }
    return -1;
}

async function obtenerUltimo(entidad: string) {
    const nombres = [entidad, entidad.toLowerCase(), entidad + 's', entidad.toLowerCase() + 's'];
    for (const nombre of nombres) {
        // @ts-ignore
        if (prisma[nombre]) return await prisma[nombre].findFirst({ orderBy: { createdAt: 'desc' } });
    }
    return null;
}

// CONTROLADOR CHAT ARI

export const chatAri = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        if (!apiKey) return res.status(500).json({ message: "Falta API Key" });

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // INTERPRETACIÓN
        const interpPrompt = `
            Eres Ari. Identifica la intención del usuario.
            Pregunta: "${prompt}"
            
            1. "list_properties": Buscar inmuebles.
            2. "count_stats": CONTAR datos (asesores, clientes, visitas).
            3. "get_latest": OBTENER ÚLTIMO dato.

            Responde JSON: { "intent": "...", "filters": { ... } }
        `;

        const resultInterp = await model.generateContent(interpPrompt);
        const jsonString = resultInterp.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        let interpretation = { intent: "general_chat", filters: {} as any };

        try { interpretation = JSON.parse(jsonString); } catch (e) { }
        console.log("🤖 Ari interpreta:", interpretation);

        // CONSULTA BD
        let contextMessage = "No se consultó BD.";
        const { intent, filters } = interpretation;

        if (intent === 'list_properties') {
            const whereClause: any = { activo: true }; 
            if (filters.location) whereClause.ubicacion = { contains: capitalizar(filters.location) };
            
            const props = await buscarPropiedadesUniversal(whereClause);
            
            // Preparamos el mensaje para que la IA entienda qué encontró
            contextMessage = props.length > 0 
                ? `Encontré ${props.length} propiedades. Aquí están los datos crudos: ${JSON.stringify(props)}` 
                : "Cero propiedades encontradas con esos filtros.";
        } 
        else if (intent === 'count_stats') {
            const count = await contarRegistros(filters.entity, {});
            contextMessage = count >= 0 ? `Total registros de ${filters.entity}: ${count}` : "No encontré esa tabla.";
        }
        else if (intent === 'get_latest') {
            const ultimo = await obtenerUltimo(filters.entity);
            contextMessage = ultimo ? `Último registro real: ${JSON.stringify(ultimo)}` : "Ningún registro encontrado.";
        }

        // RESPUESTA FINAL (FORMATO VERTICAL OBLIGATORIO)
        const finalPrompt = `
            Eres Ari de Sillar Inmobiliaria 🦁.
            
            DATOS DE LA BD: "${contextMessage}"

            INSTRUCCIONES DE FORMATO (ESTRICTAS):
            1. Empieza diciendo: "Aquí tienes lo que encontré:" (o algo similar amable).
            2. IMPORTANTE: Presenta cada propiedad SEPARADA por espacios y líneas.
            3. Usa esta estructura para cada una:

            🏡 [TIPO] en [MODALIDAD]
            📍 [Dirección o Ubicación]
            💰 [Precio] [Moneda]
            📐 [Area] m2
            🛏️ [Habs] habs | 🚿 [Baños] baños
            __________________________________
            (Salto de línea obligatorio aquí)

            4. NO escribas todo seguido en un párrafo. Quiero una lista vertical.
            5. Si no hay datos de habitaciones o baños, simplemente no pongas esa línea.

            Pregunta usuario: "${prompt}"
        `;

        const finalResult = await model.generateContent(finalPrompt);
        return res.json({ respuesta: finalResult.response.text() });

    } catch (error) {
        console.error("Error Ari:", error);
        // Mensaje de emergencia si Google nos bloquea otra vez
        return res.status(500).json({ respuesta: "¡Uy! Estoy recibiendo muchas consultas a la vez y me mareé un poquito. 😵 Dame 30 segundos y pregúntame de nuevo." });
    }
};

export const generarDescripcion = async (req: Request, res: Response) => {
    return res.json({ ok: true });
};