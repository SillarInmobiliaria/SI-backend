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
        if (['true', '1', 'on', 'si', 'sí'].includes(v)) return true;
        if (['false', '0', 'off', 'no'].includes(v)) return false;
    }
    return false;
};

const obtenerUrlImagen = (file: Express.Multer.File | undefined) => {
    if (!file) return null;
    if (file.path.startsWith('http')) return file.path;
    const path = file.path.replace(/\\/g, '/');
    return path.startsWith('/') ? path : `/${path}`;
};


// 1. CREAR PROPIEDAD
export const crearPropiedad = async (req: Request, res: Response) => {
    const t = await Propiedad.sequelize!.transaction();
    try {
        const usuario = (req as any).user;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        const fotoPrincipal = obtenerUrlImagen(files['fotoPrincipal']?.[0]);
        let galeria: string[] = files['galeria'] ? files['galeria'].map(f => obtenerUrlImagen(f) as string) : [];

        const documentosUrls: any = {};
        const posiblesPDFs = [
            'testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'cri', 'reciboAguaLuz',
            'planos', 'certificadoParametros', 'certificadoZonificacion', 'otros'
        ];
        
        posiblesPDFs.forEach(doc => {
            const fileKey = `file_${doc}`;
            if (files[fileKey]) {
                documentosUrls[doc] = files[fileKey].map((file: any) => obtenerUrlImagen(file));
            }
        });

        const rawBody = req.body;
        const { nombre, dni, celular1, fechaNacimiento, tipologias, ...resto } = rawBody;

        const esProyecto = rawBody.tipo && String(rawBody.tipo).toLowerCase().includes('proyecto');

        let datosPropiedad: any = {
            ...resto,
            precio: esProyecto ? null : limpiarNumero(rawBody.precio),
            moneda: rawBody.moneda || 'USD',
            
            mantenimiento: limpiarNumero(rawBody.mantenimiento),
            monedaMantenimiento: rawBody.monedaMantenimiento || 'PEN',
            
            vigilancia: (esProyecto && rawBody.modalidad !== 'Alquiler') ? null : limpiarNumero(rawBody.vigilancia),
            monedaVigilancia: rawBody.monedaVigilancia || 'PEN',

            area: esProyecto ? null : limpiarNumero(rawBody.area),
            areaConstruida: limpiarNumero(rawBody.areaConstruida),
            habitaciones: limpiarNumero(rawBody.habitaciones),
            banos: limpiarNumero(rawBody.banos),
            cocheras: limpiarNumero(rawBody.cocheras),
            
            comision: limpiarNumero(rawBody.comision),
            fechaCaptacion: limpiarFecha(rawBody.fechaCaptacion),
            inicioContrato: limpiarFecha(rawBody.inicioContrato),
            finContrato: limpiarFecha(rawBody.finContrato),

            fechaInicioProyecto: limpiarFecha(rawBody.fechaInicioProyecto),
            tiempoEjecucion: rawBody.tiempoEjecucion || null,
            fechaEntrega: rawBody.fechaEntrega || null,
            tipologias: tipologias ? (typeof tipologias === 'string' ? JSON.parse(tipologias) : tipologias) : null,

            documentosurls: documentosUrls,
            documentosUrls: documentosUrls,
            observaciones: rawBody.observaciones || ''
        };

        if (datosPropiedad.tipo && String(datosPropiedad.tipo).toLowerCase().includes('terreno')) {
            datosPropiedad.habitaciones = null;
            datosPropiedad.banos = null;
            datosPropiedad.cocheras = null;
        }

        const bools = [
            'testimonio', 'hr', 'pu', 'impuestoPredial', 'arbitrios', 'copiaLiteral', 'cri', 'reciboAguaLuz', 'revision', 
            'exclusiva', 'renovable', 'incluyeIgv',
            'planos', 'certificadoParametros', 'certificadoZonificacion', 'otros'
        ];
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
                     celular2: rawBody.celular2, email: rawBody.email, direccion: rawBody.direccion
                 }, { transaction: t });
                 propId = nuevo.getDataValue('id');
             }
        }

        const nueva = await Propiedad.create({
            ...datosPropiedad, 
            fotoPrincipal, 
            galeria, 
            pdfUrl: obtenerUrlImagen(files['pdf']?.[0]), 
            usuarioId: usuario.id, 
            activo: true
        }, { transaction: t });

        const ids = rawBody.propietariosIds ?? rawBody['propietariosIds[]'];
        const propietariosIds = Array.isArray(ids) ? ids.filter(Boolean) : (ids ? [String(ids)] : []);
        
        if (propietariosIds.length > 0) {
            await (nueva as any).setPropietarios(propietariosIds, { transaction: t });
        } else if (propId && (nueva as any).addPropietario) {
            await (nueva as any).addPropietario(propId, { transaction: t });
        }
        
        await t.commit();
        res.status(201).json({ message: 'Creada exitosamente', data: nueva });
    } catch (e: any) {
        if (t) await t.rollback();
        console.error("❌ ERROR CRÍTICO EN BACKEND (Crear):", e);
        res.status(500).json({ message: 'Error al crear la propiedad', error: e.message });
    }
};

// 2. OBTENER PROPIEDADES
export const obtenerPropiedades = async (req: Request, res: Response) => {
    try {
        const usuario = (req as any).user;
        let whereClause: any = {};
        if (usuario && usuario.rol !== 'ADMIN') whereClause = { usuarioId: usuario.id };
        const propiedades = await Propiedad.findAll({ 
            where: whereClause, include: [{ model: Propietario }], order: [['createdAt', 'DESC']] 
        });
        res.json(propiedades);
    } catch (e) { res.status(500).json({ message: 'Error al obtener propiedades' }); }
};

// 3. OBTENER DETALLE
export const getPropiedad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });
        res.json(propiedad);
    } catch (e) { res.status(500).json({ message: 'Error al obtener detalle' }); }
};

// 4. ACTUALIZAR PROPIEDAD
export const updatePropiedad = async (req: Request, res: Response) => {
    const t = await Propiedad.sequelize!.transaction();
    try {
        const { id } = req.params;
        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) {
            await t.rollback();
            return res.status(404).json({ message: 'No encontrada' });
        }

        const raw = req.body;
        const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
        const updates: any = {};

        ['precio', 'mantenimiento', 'vigilancia', 'area', 'areaConstruida', 'habitaciones', 'banos', 'cocheras', 'comision']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarNumero(raw[f]); });

        ['exclusiva', 'renovable', 'incluyeIgv'].forEach(f => { if (raw[f] !== undefined) updates[f] = parseBoolean(raw[f]); });

        ['fechaCaptacion', 'inicioContrato', 'finContrato', 'fechaInicioProyecto']
            .forEach(f => { if (raw[f] !== undefined) updates[f] = limpiarFecha(raw[f]); });

        ['tipo', 'modalidad', 'ubicacion', 'direccion', 'moneda', 'monedaMantenimiento', 'monedaVigilancia', 'descripcion', 
         'detalles', 'videoUrl', 'mapaUrl', 'asesor', 'partidaRegistral', 'partidaCochera', 
         'partidaDeposito', 'link1', 'link2', 'link3', 'link4', 'link5', 'tiempoEjecucion', 'fechaEntrega', 'documentosUrls', 'documentosurls'].forEach(f => { 
             if (raw[f] !== undefined) updates[f] = raw[f]; 
         });

        if (raw.tipologias) {
            updates.tipologias = typeof raw.tipologias === 'string' ? JSON.parse(raw.tipologias) : raw.tipologias;
        }

        const tipoFinal = updates.tipo || propiedad.getDataValue('tipo');
        if (tipoFinal && String(tipoFinal).toLowerCase().includes('terreno')) {
            updates.habitaciones = null;
            updates.banos = null;
            updates.cocheras = null;
        }

        if (files['fotoPrincipal']) {
            updates.fotoPrincipal = obtenerUrlImagen(files['fotoPrincipal'][0]);
        } else if (raw.existingMainPhoto) {
            updates.fotoPrincipal = raw.existingMainPhoto;
        }

        let galeriaFinal: string[] = [];
        if (raw.existingGallery) {
            try { galeriaFinal = JSON.parse(raw.existingGallery); } catch (e) {}
        }
        if (files['galeria']) {
            const nuevasFotos = files['galeria'].map(f => obtenerUrlImagen(f) as string);
            galeriaFinal = [...galeriaFinal, ...nuevasFotos];
        }
        if (raw.existingGallery || files['galeria']) {
            updates.galeria = galeriaFinal;
        }

        await propiedad.update(updates, { transaction: t });

        const ids = raw.propietariosIds ?? raw['propietariosIds[]'];
        const propietariosIds = Array.isArray(ids) ? ids.filter(Boolean) : (ids ? [String(ids)] : []);
        
        if (propietariosIds.length > 0) {
            await (propiedad as any).setPropietarios(propietariosIds, { transaction: t });
        }

        await t.commit();
        
        const actualizada = await Propiedad.findByPk(id, { include: [{ model: Propietario }] });
        res.json({ message: 'Actualizada correctamente', propiedad: actualizada });

    } catch (e: any) {
        if (t) await t.rollback();
        console.error("❌ ERROR EN UPDATE:", e);
        res.status(500).json({ message: 'Error de base de datos', error: e.message });
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
        res.json({ message: 'Eliminada' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
};

// 7. SUBIR PDF DOCUMENTO MÚLTIPLE
export const subirPdfDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { documentKey } = req.body; 
        
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) return res.status(400).json({ message: 'No se recibieron archivos' });

        const propiedad = await Propiedad.findByPk(id);
        if (!propiedad) return res.status(404).json({ message: 'No encontrada' });

        const fileUrls = files.map(f => obtenerUrlImagen(f));
        
        let actuales = (propiedad as any).documentosurls || (propiedad as any).documentosUrls || {};
        if (typeof actuales === 'string') {
            try { actuales = JSON.parse(actuales); } catch (e) { actuales = {}; }
        }

        let docsExistentes = actuales[documentKey] || [];
        if (!Array.isArray(docsExistentes)) {
            docsExistentes = [docsExistentes];
        }

        const nuevosDocumentos = { ...actuales, [documentKey]: [...docsExistentes, ...fileUrls] };
        
        await propiedad.update({ 
            documentosurls: nuevosDocumentos,
            documentosUrls: nuevosDocumentos 
        });

        res.json({ message: 'PDFs adjuntados con éxito', urls: nuevosDocumentos[documentKey], documentosUrls: nuevosDocumentos });
    } catch (e: any) {
        res.status(500).json({ message: 'Error en el servidor al subir PDFs', error: e.message });
    }
};