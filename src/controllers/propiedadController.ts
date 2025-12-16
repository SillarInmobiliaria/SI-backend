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

// 🟢 MEJORA: Ahora soporta 'null' para los estados del Checklist Legal (Amarillo/Pendiente)
const parseBoolean = (valor: any) => {
    if (valor === 'null' || valor === null) return null; // Permite el estado intermedio
    if (valor === undefined) return undefined;
    
    if (typeof valor === 'boolean') return valor;
    if (typeof valor === 'number') return valor !== 0;
    
    if (typeof valor === 'string') {
        const v = valor.trim().toLowerCase();
        if (['true', '1', 'on'].includes(v)) return true;
        if (['false', '0', 'off'].includes(v)) return false;
        if (v === 'null') return null;
    }
    return false; // Default si no se reconoce
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
    
    // IMPORTANTE: Mapeamos 'observaciones' a 'comentarios' por compatibilidad
    data.comentarios = data.observaciones; 
    return data;
};

// 1. CREAR PROPIEDAD
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

        // Booleanos (Checklist Legal)
        const bools = ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'revision'];
        bools.forEach(f => datosPropiedad[f] = parseBoolean(resto[f] ?? rawBody[f]));

        if (galeria.length === 0 && typeof resto.galeria === 'string') {
            try { const p = JSON.parse(resto.galeria); if (Array.isArray(p)) galeria = p; } catch (e) {}
        }

        // Gestión del Propietario (Busca o Crea)
        let propId = null;
        if (dni) {
             const existe = await Propietario.findOne({ where: { dni }, transaction: t });
             if (existe) propId = existe.getDataValue('id');
             else {
                 const nuevo = await Propietario.create({
                     nombre, dni, celular1, 
                     fechaNacimiento: limpiarFecha(fechaNacimiento), 
                     celular2: rawBody.celular2, 
                     email: rawBody.email, 
                     direccion: rawBody.direccion
                 }, { transaction: t });
                 propId = nuevo.getDataValue('id');
             }
        }

        const nueva = await Propiedad.create({
            ...datosPropiedad, 
            fotoPrincipal, 
            galeria, 
            pdfUrl, 
            usuarioId: usuario.id, 
            activo: true, 
            propietarioId: propId
        }, { transaction: t });

        // Vinculación Many-to-Many si usas esa relación, o campo directo si es One-to-Many
        if (propId && (nueva as any).addPropietario) {
            await (nueva as any).addPropietario(propId, { transaction: t });
        }
        
        await t.commit();
        res.status(201).json({ message: 'Creada exitosamente', data: nueva });

    } catch (e: any) {
        await t.rollback();
        console.error("Error Crear:", e);
        res.status(500).json({ message: 'Error al crear propiedad', error: e.message });
    }
};

// 2. OBTENER PROPIEDADES (LISTA)
export const obtenerPropiedades = async (req: Request, res: Response) => {
    try {
        const usuario = (req as any).user;
        let whereClause: any = {};
        
        // Si no es ADMIN, solo ve sus propiedades
        if (usuario && usuario.rol !== 'ADMIN') {
            whereClause = { usuarioId: usuario.id };
        }

        const propiedades = await Propiedad.findAll({ 
            where: whereClause, 
            // Incluimos Propietario para que salga el nombre en la tabla
            include: [{ model: Propietario }], 
            order: [['createdAt', 'DESC']] 
        });

        const respuesta = propiedades.map(p => parseObservaciones(p));
        res.json(respuesta);

    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Error al obtener propiedades' }); 
    }
};

// 3. OBTENER UNA PROPIEDAD (DETALLE)
export const getPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // 🟢 CLAVE: El include aquí es vital para el botón "Contactar Dueño"
        const propiedad = await Propiedad.findByPk(id, { 
            include: [{ model: Propietario }] 
        });

        if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada' });
        
        res.json(parseObservaciones(propiedad));

    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Error al obtener detalle' }); 
    }
};

// 4. ACTUALIZAR PROPIEDAD
export const updatePropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });

        const raw = req.body;
        console.log("➡️ Update Payload:", JSON.stringify(raw, null, 2));

        const updates: any = {};

        // Números
        ['precio', 'area', 'areaConstruida', 'habitaciones', 'banos', 'cocheras', 'comision']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarNumero(raw[f]); });
        
        // Si precio viene null explícitamente, lo dejamos (o lo borramos si prefieres no nulls)
        if (updates.precio === null) delete updates.precio; 

        // Booleanos (Checklist Legal) - Usa el nuevo parseBoolean que acepta nulls
        ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'revision']
            .forEach(f => { 
                if (raw[f] !== undefined) updates[f] = parseBoolean(raw[f]); 
            });

        // Fechas
        ['fechaCaptacion', 'inicioContrato', 'finContrato']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarFecha(raw[f]); });

        // Textos y URLs
        ['tipo', 'modalidad', 'ubicacion', 'direccion', 'moneda', 'descripcion', 
         'detalles', 'videoUrl', 'mapaUrl', 'pdfUrl', 'tipoContrato', 'asesor',
         'partidaRegistral', 'partidaAdicional', 'partidaCochera', 'partidaDeposito',
         'link1', 'link2', 'link3', 'link4', 'link5'].forEach(f => { 
             if (raw[f] !== undefined) updates[f] = raw[f]; 
         });

        // Manejo especial de Observaciones (JSON String)
        // El frontend envía el objeto entero de observaciones en 'observaciones'
        let obs = raw.observaciones;
        if (obs !== undefined) {
            updates.observaciones = typeof obs === 'object' ? JSON.stringify(obs) : String(obs);
        }

        await propiedad.update(updates);
        
        // Devolvemos el objeto actualizado y parseado
        const propiedadActualizada = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        res.json({ message: 'Actualizada correctamente', propiedad: parseObservaciones(propiedadActualizada) });

    } catch (e: any) {
        console.error("❌ Error Update:", e);
        res.status(500).json({ message: 'Error al actualizar', error: e.message });
    }
};

// 5. CAMBIAR ESTADO (ACTIVO/SUSPENDIDO)
export const toggleEstadoPropiedad = async (req: Request, res: Response) => {
    try {
        const p = await Propiedad.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'No existe' });
        
        await p.update({ activo: req.body.activo });
        res.json({ message: 'Estado actualizado' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};

// 6. ELIMINAR PROPIEDAD
export const eliminarPropiedad = async (req: Request, res: Response) => {
    try {
        const p = await Propiedad.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'No existe' });
        
        await p.destroy();
        res.json({ message: 'Propiedad eliminada' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};