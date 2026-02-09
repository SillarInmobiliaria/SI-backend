import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';

// ✅ IMPORTACIONES (SIN LLAVES)
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';
import Cliente from '../models/Cliente';
import Visita from '../models/Visita';
// import Usuario from '../models/Usuario'; 

// --- HELPER 1: RANGOS DE FECHAS PARA EXCEL ---
const obtenerRangoFechas = (mode: string, year: number) => {
    const hoy = new Date();
    let inicio = new Date(year, 0, 1);
    let fin = new Date(year, 11, 31, 23, 59, 59);

    if (mode === 'MENSUAL') {
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);
    } else if (mode === 'SEMANAL') {
        const diaSemana = hoy.getDay(); 
        const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1); 
        inicio = new Date(hoy.setDate(diff));
        inicio.setHours(0,0,0,0);
        fin = new Date(inicio);
        fin.setDate(inicio.getDate() + 6);
        fin.setHours(23,59,59,999);
    }
    return { inicio, fin };
};

// --- HELPER 2: LOGICA DE GRÁFICA ---
async function obtenerDataGrafica(rangos: { label: string, start: Date, end: Date }[]) {
    const datos = await Promise.all(
        rangos.map(async (rango) => {
            const whereRango = { 
                createdAt: { [Op.between]: [rango.start, rango.end] } 
            };

            const [props, clientes, propss, visitas] = await Promise.all([
                Propiedad.count({ where: whereRango }),
                Cliente.count({ where: whereRango }),
                Propietario.count({ where: whereRango }),
                Visita.count({ where: { ...whereRango, estado: 'COMPLETADA' } })
            ]);

            return {
                name: rango.label,
                propiedades: props,
                clientes: clientes,
                propietarios: propss,
                visitas: visitas
            };
        })
    );
    return datos;
}

// 1. OBTENER ESTADÍSTICAS (DASHBOARD)
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        const mode = req.query.mode ? (req.query.mode as string).toUpperCase() : 'ANUAL';
        
        // --- A. TOTALES (Siempre del AÑO seleccionado) ---
        const inicioAnio = new Date(year, 0, 1);
        const finAnio = new Date(year, 11, 31, 23, 59, 59);
        const whereAnio = { createdAt: { [Op.between]: [inicioAnio, finAnio] } };

        const [totalPropiedades, totalPropietarios, totalClientes, totalVisitas] = await Promise.all([
            Propiedad.count({ where: whereAnio }),
            Propietario.count({ where: whereAnio }),
            Cliente.count({ where: whereAnio }),
            Visita.count({ where: { ...whereAnio, estado: 'COMPLETADA' } })
        ]);

        // --- B. RANGOS GRÁFICA ---
        let rangos: { label: string, start: Date, end: Date }[] = [];
        const hoy = new Date();

        if (mode === 'ANUAL') {
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            rangos = meses.map((nombreMes, i) => ({
                label: nombreMes,
                start: new Date(year, i, 1, 0, 0, 0),
                end: new Date(year, i + 1, 0, 23, 59, 59)
            }));
        } 
        else if (mode === 'MENSUAL') {
            const mesActual = hoy.getMonth(); 
            const diasEnMes = new Date(year, mesActual + 1, 0).getDate(); 
            for (let d = 1; d <= diasEnMes; d++) {
                rangos.push({
                    label: `${d}`, 
                    start: new Date(year, mesActual, d, 0, 0, 0),
                    end: new Date(year, mesActual, d, 23, 59, 59)
                });
            }
        } 
        else if (mode === 'SEMANAL') {
            const diaSemana = hoy.getDay();
            const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
            const lunes = new Date(hoy);
            lunes.setDate(diff);
            lunes.setHours(0,0,0,0);

            const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            rangos = diasSemana.map((nombreDia, i) => {
                const diaInicio = new Date(lunes);
                diaInicio.setDate(lunes.getDate() + i);
                const diaFin = new Date(diaInicio);
                diaFin.setHours(23, 59, 59, 999);
                return { label: nombreDia, start: diaInicio, end: diaFin };
            });
        }

        // --- C. DATOS GRÁFICA ---
        const datosGrafica = await obtenerDataGrafica(rangos);

        res.json({
            anio: year,
            modo: mode,
            totales: {
                propiedades: totalPropiedades,
                propietarios: totalPropietarios,
                clientes: totalClientes,
                visitas: totalVisitas
            },
            grafica: datosGrafica
        });

    } catch (error: any) {
        console.error("❌ Error Dashboard:", error);
        res.status(500).json({ message: 'Error interno', detalle: error.message });
    }
};

// 2. EXPORTAR REPORTE EXCEL (4 PESTAÑAS)
export const exportarReporteExcel = async (req: Request, res: Response) => {
    try {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        const mode = req.query.mode ? (req.query.mode as string).toUpperCase() : 'ANUAL';
        
        const { inicio, fin } = obtenerRangoFechas(mode, year);
        const whereFecha = { createdAt: { [Op.between]: [inicio, fin] } };

        // Consultamos todo
        const [propiedades, clientes, visitas, propietarios] = await Promise.all([
            Propiedad.findAll({ where: whereFecha, order: [['createdAt', 'DESC']] }),
            Cliente.findAll({ where: whereFecha, order: [['createdAt', 'DESC']] }),
            Visita.findAll({ where: whereFecha, order: [['createdAt', 'DESC']] }), // Agrega include: [Propiedad] si tienes la relación
            Propietario.findAll({ where: whereFecha, order: [['createdAt', 'DESC']] })
        ]);

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sillar Inmobiliaria';
        
        // --- HOJA 1: PROPIEDADES ---
        const hojaProps = workbook.addWorksheet('Propiedades');
        hojaProps.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Tipo', key: 'tipo', width: 15 },
            { header: 'Ubicación', key: 'ubicacion', width: 25 },
            { header: 'Precio', key: 'precio', width: 15 }
        ];
        propiedades.forEach((p: any) => hojaProps.addRow({
            fecha: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
            tipo: p.tipo,
            ubicacion: p.ubicacion,
            precio: p.precio
        }));

        // --- HOJA 2: CLIENTES ---
        const hojaClientes = workbook.addWorksheet('Clientes');
        hojaClientes.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 25 },
            { header: 'Teléfono', key: 'telefono', width: 15 }
        ];
        clientes.forEach((c: any) => hojaClientes.addRow({
            fecha: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-',
            nombre: c.nombre,
            telefono: c.telefono
        }));

        // --- HOJA 3: PROPIETARIOS ---
        const hojaPropss = workbook.addWorksheet('Propietarios');
        hojaPropss.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 25 },
            { header: 'DNI', key: 'dni', width: 15 },
            { header: 'Teléfono', key: 'telefono', width: 15 }
        ];
        propietarios.forEach((p: any) => hojaPropss.addRow({
            fecha: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
            nombre: p.nombre,
            dni: p.dni,
            telefono: p.telefono
        }));

        // --- HOJA 4: VISITAS HECHAS ---
        const hojaVisitas = workbook.addWorksheet('Visitas Hechas');
        hojaVisitas.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Observación', key: 'obs', width: 30 }
        ];
        visitas.forEach((v: any) => hojaVisitas.addRow({
            fecha: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '-',
            estado: v.estado,
            obs: v.observacion || '-'
        }));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Reporte_Sillar_${mode}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("❌ Error Excel:", error);
        res.status(500).json({ message: 'Error al generar Excel' });
    }
};