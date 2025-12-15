import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';
import Usuario from '../models/Usuario'; // Asumo que tus clientes son Usuarios

// --- HELPERS DE FECHAS ---
const getRangoHoy = () => {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);
    return { inicio, fin };
};

const getRangoMesActual = () => {
    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0); // Último día del mes
    fin.setHours(23, 59, 59, 999);
    return { inicio, fin };
};

const getRangoMesAnterior = () => {
    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth() - 1, 1);
    const fin = new Date(fecha.getFullYear(), fecha.getMonth(), 0); // Último día del mes anterior
    fin.setHours(23, 59, 59, 999);
    return { inicio, fin };
};

// --- LOGICA DE ESTADÍSTICAS ---
async function calcularEstadisticas(Modelo: any) {
    const hoy = getRangoHoy();
    const esteMes = getRangoMesActual();
    const mesAnterior = getRangoMesAnterior();

    const countHoy = await Modelo.count({ 
        where: { createdAt: { [Op.between]: [hoy.inicio, hoy.fin] } } 
    });

    const countEsteMes = await Modelo.count({ 
        where: { createdAt: { [Op.between]: [esteMes.inicio, esteMes.fin] } } 
    });

    const countMesAnterior = await Modelo.count({ 
        where: { createdAt: { [Op.between]: [mesAnterior.inicio, mesAnterior.fin] } } 
    });

    // Calcular crecimiento
    let crecimiento = 0;
    if (countMesAnterior > 0) {
        crecimiento = ((countEsteMes - countMesAnterior) / countMesAnterior) * 100;
    } else if (countEsteMes > 0) {
        crecimiento = 100; // Si antes era 0 y ahora hay algo, creció 100% (o infinito)
    }

    return {
        hoy: countHoy,
        esteMes: countEsteMes,
        mesAnterior: countMesAnterior,
        crecimiento: parseFloat(crecimiento.toFixed(1)) // Redondear a 1 decimal
    };
}

// 1. OBTENER DATOS PARA EL DASHBOARD (JSON)
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Ejecutamos las consultas en paralelo para ser más rápidos
        const [statsPropiedades, statsPropietarios, statsUsuarios] = await Promise.all([
            calcularEstadisticas(Propiedad),
            calcularEstadisticas(Propietario),
            calcularEstadisticas(Usuario)
        ]);

        res.json({
            propiedades: statsPropiedades,
            propietarios: statsPropietarios,
            clientes: statsUsuarios
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error al calcular estadísticas' });
    }
};

// 2. EXPORTAR REPORTE EXCEL
export const exportarReporteExcel = async (req: Request, res: Response) => {
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sillar Inmobiliaria';
        workbook.created = new Date();

        // --- HOJA 1: RESUMEN EJECUTIVO ---
        const sheetResumen = workbook.addWorksheet('Resumen Ejecutivo');
        
        // Estilos de columnas
        sheetResumen.columns = [
            { header: 'Concepto', key: 'concepto', width: 30 },
            { header: 'Hoy', key: 'hoy', width: 15 },
            { header: 'Este Mes', key: 'esteMes', width: 15 },
            { header: 'Mes Anterior', key: 'mesAnterior', width: 15 },
            { header: 'Crecimiento %', key: 'crecimiento', width: 15 },
        ];

        // Obtenemos datos
        const statsPropiedades = await calcularEstadisticas(Propiedad);
        const statsPropietarios = await calcularEstadisticas(Propietario);
        const statsUsuarios = await calcularEstadisticas(Usuario);

        // Agregamos filas
        sheetResumen.addRow({
            concepto: 'Propiedades Nuevas',
            ...statsPropiedades,
            crecimiento: statsPropiedades.crecimiento + '%'
        });
        sheetResumen.addRow({
            concepto: 'Propietarios Registrados',
            ...statsPropietarios,
            crecimiento: statsPropietarios.crecimiento + '%'
        });
        sheetResumen.addRow({
            concepto: 'Usuarios/Clientes Nuevos',
            ...statsUsuarios,
            crecimiento: statsUsuarios.crecimiento + '%'
        });

        // Estilizar encabezados
        sheetResumen.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheetResumen.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF000080' } // Azul oscuro
        };

        // --- HOJA 2: DETALLE PROPIEDADES MES ACTUAL ---
        const sheetDetalle = workbook.addWorksheet('Detalle Mes Actual');
        sheetDetalle.columns = [
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Tipo', key: 'tipo', width: 15 },
            { header: 'Ubicación', key: 'ubicacion', width: 25 },
            { header: 'Precio', key: 'precio', width: 15 },
            { header: 'Asesor', key: 'asesor', width: 20 },
        ];

        const rangoMes = getRangoMesActual();
        const propiedadesMes = await Propiedad.findAll({
            where: { createdAt: { [Op.between]: [rangoMes.inicio, rangoMes.fin] } },
            order: [['createdAt', 'DESC']]
        });

        propiedadesMes.forEach(p => {
            const data = p.toJSON();
            sheetDetalle.addRow({
                fecha: data.createdAt.toISOString().split('T')[0],
                tipo: data.tipo,
                ubicacion: data.ubicacion,
                precio: `${data.moneda} ${data.precio}`,
                asesor: data.asesor || 'N/A'
            });
        });

        // --- RESPUESTA DEL ARCHIVO ---
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'Reporte_Sillar_' + Date.now() + '.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar Excel' });
    }
};