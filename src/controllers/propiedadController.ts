import { Request, Response } from 'express';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

const limpiarNumero = (valor: any) => {
    if (typeof valor === 'string') valor = valor.replace(',', '.');
    if (valor === '' || valor === null || valor === undefined || isNaN(Number(valor))) return null;
    return Number(valor);
};

const limpiarFecha = (valor: any) => {
    if (!valor || valor === '' || valor === 'Invalid date' || valor === 'null') return null;
    return valor;
};

const parseBoolean = (valor: any) => {
    if (valor === 'null' || valor === null) return null;
    if (valor === undefined) return undefined;
    if (typeof valor === 'boolean') return valor;
    if (typeof valor === 'number') return valor !== 0;
    if (typeof valor === 'string') {
        const v = valor.trim().toLowerCase();
        if (['true', '1', 'on'].includes(v)) return true;
        if (['false', '0', 'off'].includes(v)) return false;
    }
    return false;
};

const obtenerUrlImagen = (file: Express.Multer.File | undefined) => {
    if (!file) return null;
    return file.path.startsWith('http') ? file.path : file.path.replace(/\\/g, '/');
};

// 1. CREAR PROPIEDAD
export const crearPropiedad = async (req: Request, res: Response) => {
    const t = await Propiedad.sequelize!.transaction();
    try {
        const usuario = (req as any).user;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        const fotoPrincipal = obtenerUrlImagen(files['fotoPrincipal']?.[0]);
        const pdfUrl = obtenerUrlImagen(files['pdf']?.[0]);
        let galeria: string[] = files['galeria'] ? files['galeria'].map(f => obtenerUrlImagen(f) as string) : [];

        const rawBody = req.body;
        const { nombre, dni, celular1, fechaNacimiento, ...resto } = rawBody;

        let datosPropiedad = {
            ...resto,
            precio: limpiarNumero(rawBody.precio),
            moneda: rawBody.moneda || 'USD',
            mantenimiento: limpiarNumero(rawBody.mantenimiento),
            area: limpiarNumero(rawBody.area),
            areaConstruida: limpiarNumero(rawBody.areaConstruida),
            habitaciones: limpiarNumero(rawBody.habitaciones),
            banos: limpiarNumero(rawBody.banos),
            cocheras: limpiarNumero(rawBody.cocheras),
            comision: limpiarNumero(rawBody.comision),
            fechaCaptacion: limpiarFecha(rawBody.fechaCaptacion),
            inicioContrato: limpiarFecha(rawBody.inicioContrato),
            finContrato: limpiarFecha(rawBody.finContrato),
            observaciones: rawBody.observaciones || ''
        };

        const bools = ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'cri', 'reciboAguaLuz', 'revision'];
        bools.forEach(f => { datosPropiedad[f] = parseBoolean(rawBody[f]); });

        if (galeria.length === 0 && typeof resto.galeria === 'string') {
            try { const p = JSON.parse(resto.galeria); if (Array.isArray(p)) galeria = p; } catch (e) {}
        }

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

// 2. OBTENER PROPIEDADES
export const obtenerPropiedades = async (req: Request, res: Response) => {
    try {
        const usuario = (req as any).user;
        let whereClause: any = {};
        if (usuario && usuario.rol !== 'ADMIN') whereClause = { usuarioId: usuario.id };

        const propiedades = await Propiedad.findAll({ 
            where: whereClause, 
            include: [{ model: Propietario }], 
            order: [['createdAt', 'DESC']] 
        });
        res.json(propiedades);
    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Error al obtener propiedades' }); 
    }
};

// 3. OBTENER DETALLE
export const getPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada' });
        res.json(propiedad);
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
        const updates: any = {};

        ['precio', 'mantenimiento', 'area', 'areaConstruida', 'habitaciones', 'banos', 'cocheras', 'comision']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarNumero(raw[f]); });

        ['testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'cri', 'reciboAguaLuz', 'revision']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = parseBoolean(raw[f]); });

        ['fechaCaptacion', 'inicioContrato', 'finContrato']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarFecha(raw[f]); });

        ['tipo', 'modalidad', 'ubicacion', 'direccion', 'moneda', 'descripcion', 
         'detalles', 'videoUrl', 'mapaUrl', 'pdfUrl', 'tipoContrato', 'asesor',
         'partidaRegistral', 'partidaAdicional', 'partidaCochera', 'partidaDeposito',
         'link1', 'link2', 'link3', 'link4', 'link5', 'observaciones'].forEach(f => { 
             if (raw[f] !== undefined) updates[f] = raw[f]; 
         });

        await propiedad.update(updates);
        const propiedadActualizada = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        res.json({ message: 'Actualizada correctamente', propiedad: propiedadActualizada });

    } catch (e: any) {
        console.error("❌ Error Update:", e);
        res.status(500).json({ message: 'Error al actualizar', error: e.message });
    }
};

// 5. CAMBIAR ESTADO
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

// 7. SUBIR PDF DOCUMENTO (NUEVO)
export const subirPdfDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { documentKey } = req.body; 
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No se recibió archivo' });

        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada' });

        const fileUrl = file.path.startsWith('http') ? file.path : `/${file.path.replace(/\\/g, '/')}`;

        let documentosUrls = (propiedad as any).documentosUrls || {};
        if (typeof documentosUrls === 'string') {
            try { documentosUrls = JSON.parse(documentosUrls); } catch (e) { documentosUrls = {}; }
        }

        documentosUrls[documentKey] = fileUrl;
        await propiedad.update({ documentosUrls });

        res.json({ message: 'PDF adjuntado con éxito', url: fileUrl, documentosUrls });
    } catch (e: any) {
        console.error("❌ Error subida PDF:", e);
        res.status(500).json({ message: 'Error en el servidor al subir PDF', error: e.message });
    }
};