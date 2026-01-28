import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import Visita from '../models/Visita';
import Usuario from '../models/Usuario';
import Propiedad from '../models/Propiedad';
import Cliente from '../models/Cliente';

// 1. CREAR VISITA
export const crearVisita = async (req: Request, res: Response) => {
    try {
        let { fechaProgramada, comentariosPrevios, clienteId, propiedadId, asesorId } = req.body;
        
        // Asignar usuario logueado si no se especifica
        if (!asesorId) {
            const usuario = (req as any).user;
            if (usuario) asesorId = usuario.id;
        }

        const nuevaVisita = await Visita.create({
            fechaProgramada,
            comentariosPrevios,
            clienteId,
            propiedadId,
            asesorId,
            estado: 'PENDIENTE'
        });

        res.status(201).json(nuevaVisita);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agendar visita' });
    }
};

// 2. OBTENER VISITAS
export const obtenerVisitas = async (req: Request, res: Response) => {
    try {
        const usuario = (req as any).user;

        // PROTECCIÓN CONTRA CAÍDAS (Fix del Error 500)
        if (!usuario) {
            return res.status(401).json({ message: 'No autorizado. Token inválido o sesión expirada.' });
        }

        let whereClause = {};

        // Si no es ADMIN, solo ve sus propias visitas
        if (usuario.rol !== 'ADMIN') {
            whereClause = { asesorId: usuario.id };
        }

        const visitas = await Visita.findAll({
            where: whereClause,
            include: [
                { 
                    model: Cliente, 
                    as: 'cliente', 
                    attributes: ['id', 'nombre', 'email', 'telefono1', 'tipo', 'dni', 'direccion', 'ocupacion', 'estadoCivil'] 
                },
                { 
                    model: Propiedad, 
                    as: 'propiedad', 
                    attributes: ['tipo', 'ubicacion', 'precio', 'direccion'] 
                },
                { 
                    model: Usuario, 
                    as: 'asesor', 
                    attributes: ['nombre'] 
                }
            ],
            order: [['fechaProgramada', 'ASC']]
        });

        res.json(visitas);
    } catch (error) {
        console.error("Error en obtenerVisitas:", error);
        res.status(500).json({ message: 'Error al obtener visitas' });
    }
};

// 3. VISITA (Finalizar o Reprogramar)
export const actualizarVisita = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            estado, 
            resultadoSeguimiento,
            fechaProgramada,
            comentariosPrevios,
            dni, 
            email, 
            direccion, 
            fechaNacimiento, 
            ocupacion 
        } = req.body;

        const visita = await Visita.findByPk(id);
        if (!visita) return res.status(404).json({ message: 'Visita no encontrada' });

        // Si se está completando la visita (Acción de Finalizar)
        if (estado === 'COMPLETADA') {
            const cliente = await Cliente.findByPk(visita.clienteId);
            
            if (cliente) {
                // Si sigue siendo PROSPECTO, validamos que vengan los datos obligatorios
                if (cliente.getDataValue('tipo') === 'PROSPECTO') {
                    if (!dni || !email) {
                        return res.status(400).json({ 
                            message: '⚠️ Acción Bloqueada: Para finalizar la visita de un Prospecto, debe ingresar DNI y Email obligatoriamente.' 
                        });
                    }

                    // De Prospecto a Cliente
                    console.log(`🚀 Actualizando Prospecto ${cliente.getDataValue('nombre')} a CLIENTE...`);
                    await cliente.update({
                        dni, email, direccion, fechaNacimiento, ocupacion, tipo: 'CLIENTE'
                    });
                } else {
                    // Si ya es CLIENTE, igual permitimos actualizar datos si enviaron algo nuevo
                    if (dni || email || direccion) {
                        await cliente.update({ dni, email, direccion, fechaNacimiento, ocupacion });
                    }
                }
            }
        }

        // Actualizar datos de la visita
        if (estado) visita.estado = estado;
        if (resultadoSeguimiento) visita.resultadoSeguimiento = resultadoSeguimiento;
        
        // Lógica de Reprogramación
        if (fechaProgramada) visita.fechaProgramada = fechaProgramada;
        if (comentariosPrevios) visita.comentariosPrevios = comentariosPrevios;

        await visita.save();
        res.json({ message: 'Visita actualizada correctamente', visita });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar visita' });
    }
};

// 4. CANCELAR VISITA
export const cancelarVisita = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body; 

        const visita = await Visita.findByPk(id);
        if (!visita) return res.status(404).json({ message: 'Visita no encontrada' });

        await visita.update({ 
            estado: 'CANCELADA',
            resultadoSeguimiento: `[CANCELADA]: ${motivo}` 
        });

        res.json({ message: 'Visita cancelada correctamente' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al cancelar', error: error.message });
    }
};

// 5. EXPORTAR EXCEL
export const exportarSeguimientoExcel = async (req: Request, res: Response) => {
    try {
        const { mes, anio, estado } = req.query;
        let whereClause: any = {};
        
        if (mes && anio) {
            const fechaInicio = new Date(Number(anio), Number(mes) - 1, 1);
            const fechaFin = new Date(Number(anio), Number(mes), 0, 23, 59, 59);
            whereClause.fechaProgramada = { [Op.between]: [fechaInicio, fechaFin] };
        } else if (anio) {
            const fechaInicio = new Date(Number(anio), 0, 1);
            const fechaFin = new Date(Number(anio), 11, 31, 23, 59, 59);
            whereClause.fechaProgramada = { [Op.between]: [fechaInicio, fechaFin] };
        }

        if (estado && estado !== 'TODOS') {
            whereClause.estado = estado;
        } else {
            whereClause.estado = { [Op.in]: ['COMPLETADA', 'CANCELADA'] };
        }

        const visitas = await Visita.findAll({
            where: whereClause,
            include: ['cliente', 'propiedad', 'asesor'],
            order: [['fechaProgramada', 'ASC']]
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Seguimiento');
        
        sheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Hora', key: 'hora', width: 10 },
            { header: 'Cliente', key: 'cliente', width: 25 },
            { header: 'Propiedad', key: 'propiedad', width: 30 },
            { header: 'Asesor', key: 'asesor', width: 20 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Resultado', key: 'resultado', width: 50 },
        ];

        visitas.forEach((v: any) => {
            const fechaObj = new Date(v.fechaProgramada);
            sheet.addRow({
                fecha: fechaObj.toLocaleDateString(),
                hora: fechaObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                cliente: v.cliente?.nombre || 'N/A',
                propiedad: v.propiedad ? `${v.propiedad.tipo} - ${v.propiedad.ubicacion}` : 'N/A',
                asesor: v.asesor?.nombre || 'N/A',
                estado: v.estado,
                resultado: v.resultadoSeguimiento || 'Sin informe'
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Seguimiento.xlsx`);
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al exportar Excel' });
    }
};