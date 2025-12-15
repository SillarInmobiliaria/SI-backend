import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

// --- HELPERS ---
const limpiarNumero = (valor: any) => {
    if (valor === '' || valor === null || valor === undefined || isNaN(Number(valor))) return null;
    return Number(valor);
};

const limpiarFecha = (valor: any) => {
    if (!valor || valor === '' || valor === 'Invalid date' || valor === 'null') return null;
    return valor;
};

const parseBoolean = (valor: any) => {
    if (valor === null || valor === undefined) return false;
    if (typeof valor === 'boolean') return valor;
    if (typeof valor === 'number') return valor !== 0;
    if (typeof valor === 'string') {
        const v = valor.trim().toLowerCase();
        if (['true', '1', 'on'].includes(v)) return true;
        if (['false', '0', 'off', ''].includes(v)) return false;
    }
    return false;
};

// Helper para enviar el JSON de comentarios correctamente al frontend
const parseObservaciones = (propiedad: any) => {
    const data = propiedad.toJSON ? propiedad.toJSON() : propiedad;
    // Si observaciones es un string que parece JSON, lo convertimos a objeto
    if (data.observaciones && typeof data.observaciones === 'string') {
        try {
            data.observaciones = JSON.parse(data.observaciones);
        } catch (e) {
            // Si no es JSON válido, lo dejamos como texto normal
        }
    }
    // IMPORTANTE: Mapeamos 'observaciones' a 'comentarios' también por si el front lo busca así
    data.comentarios = data.observaciones; 
    return data;
};

// 1. CREAR
export const crearPropiedad = async (req: Request, res: Response) => {
    const t = await Propiedad.sequelize!.transaction();
    try {
        const usuario = (req as any).user;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const fotoPrincipal = files['fotoPrincipal'] ? files['fotoPrincipal'][0].path : null;
        const pdfUrl = files['pdf'] ? files['pdf'][0].path : null;
        let galeria: string[] = files['galeria'] ? files['galeria'].map(f => f.path) : [];

        const rawBody = req.body;
        const { nombre, dni, celular1, fechaNacimiento, propietarios, ...resto } = rawBody;

        let datosPropiedad = {
            ...resto,
            precio: limpiarNumero(rawBody.precio),
            area: limpiarNumero(rawBody.area),
            areaConstruida: limpiarNumero(rawBody.areaConstruida),
            habitaciones: limpiarNumero(rawBody.habitaciones),
            banos: limpiarNumero(rawBody.banos),
            cocheras: limpiarNumero(rawBody.cocheras),
            comision: limpiarNumero(rawBody.comision),
            fechaCaptacion: limpiarFecha(rawBody.fechaCaptacion),
            inicioContrato: limpiarFecha(rawBody.inicioContrato),
            finContrato: limpiarFecha(rawBody.finContrato),
            // Guardamos comentarios como STRING JSON
            observaciones: typeof rawBody.observaciones === 'object' ? JSON.stringify(rawBody.observaciones) : (rawBody.observaciones || '')
        };

        // Booleanos (Incluyendo revision)
        const bools = ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'revision'];
        bools.forEach(f => datosPropiedad[f] = parseBoolean(resto[f] ?? rawBody[f]));

        if (galeria.length === 0 && typeof resto.galeria === 'string') {
            try { const p = JSON.parse(resto.galeria); if (Array.isArray(p)) galeria = p; } catch (e) {}
        }

        let propId = null;
        if (dni) {
             const existe = await Propietario.findOne({ where: { dni }, transaction: t });
             if (existe) propId = existe.getDataValue('id');
             else {
                 const nuevo = await Propietario.create({
                     nombre, dni, celular1, fechaNacimiento: limpiarFecha(fechaNacimiento), 
                     celular2: rawBody.celular2, email: rawBody.email, direccion: rawBody.direccion
                 }, { transaction: t });
                 propId = nuevo.getDataValue('id');
             }
        }

        const nueva = await Propiedad.create({
            ...datosPropiedad, fotoPrincipal, galeria, pdfUrl, usuarioId: usuario.id, activo: true, propietarioId: propId
        }, { transaction: t });

        if (propId && (nueva as any).addPropietario) await (nueva as any).addPropietario(propId, { transaction: t });
        
        await t.commit();
        res.status(201).json({ message: 'Creada', data: nueva });
    } catch (e: any) {
        await t.rollback();
        res.status(500).json({ message: 'Error', error: e.message });
    }
};

// 2. OBTENER PROPIEDADES
export const obtenerPropiedades = async (req: Request, res: Response) => {
    try {
        const usuario = (req as any).user;
        let whereClause: any = {};
        
        // Si hay usuario y NO es admin, filtra solo las suyas
        if (usuario && usuario.rol !== 'ADMIN') {
            whereClause = { usuarioId: usuario.id };
        }

        const propiedades = await Propiedad.findAll({ 
            where: whereClause, 
            // include: ... (lo que ya tengas)
            include: [{ model: Propietario }],
            
            order: [['createdAt', 'DESC']] 
        });

        // Parseamos los comentarios para que el front los entienda
        const respuesta = propiedades.map(p => parseObservaciones(p));

        res.json(respuesta);
    } catch (e) { res.status(500).json({ message: 'Error al obtener' }); }
};

// 3. OBTENER UNO (Modo Debug: Todo visible)
export const getPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        res.json(parseObservaciones(propiedad));
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};

// 4. ACTUALIZAR (Aquí está la clave)
export const updatePropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });

        const raw = req.body;
        console.log("➡️ Recibiendo Update:", JSON.stringify(raw, null, 2)); // DEBUG LOG

        const updates: any = {};

        // Números
        ['precio', 'area', 'areaConstruida', 'habitaciones', 'banos', 'cocheras', 'comision']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarNumero(raw[f]); });
        
        if (updates.precio === null) delete updates.precio; 

        // Booleanos (AQUÍ SE GUARDA REVISIÓN)
        ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'revision']
            .forEach(f => { 
                if (raw[f] !== undefined) updates[f] = parseBoolean(raw[f]); 
            });

        // Fechas
        ['fechaCaptacion', 'inicioContrato', 'finContrato']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarFecha(raw[f]); });

        // Textos
        ['tipo', 'modalidad', 'ubicacion', 'direccion', 'moneda', 'descripcion', 
         'detalles', 'videoUrl', 'mapaUrl', 'pdfUrl', 'tipoContrato', 'asesor',
         'partidaRegistral', 'partidaAdicional', 'partidaCochera', 'partidaDeposito',
         'link1', 'link2', 'link3', 'link4', 'link5'].forEach(f => { if (raw[f] !== undefined) updates[f] = raw[f]; });

        // Observaciones (Comentarios)
        let obs = raw.observaciones ?? raw.comentarios;
        if (obs !== undefined) {
            // Guardamos siempre como string en la BD
            updates.observaciones = typeof obs === 'object' ? JSON.stringify(obs) : String(obs);
        }

        await propiedad.update(updates);
        
        // Devolvemos el objeto parseado para que el front lo pinte bien
        res.json({ message: 'Actualizada', propiedad: parseObservaciones(propiedad) });

    } catch (e: any) {
        console.error("❌ Error Update:", e);
        res.status(500).json({ message: 'Error al actualizar', error: e.message });
    }
};

export const toggleEstadoPropiedad = async (req: Request, res: Response) => {
    try {
        const p = await Propiedad.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'No existe' });
        await p.update({ activo: req.body.activo });
        res.json({ message: 'Estado actualizado' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};

export const eliminarPropiedad = async (req: Request, res: Response) => {
    try {
        const p = await Propiedad.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'No existe' });
        await p.destroy();
        res.json({ message: 'Eliminado' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};