import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';
import Cliente from '../models/Cliente';
import Visita from '../models/Visita';

// --- HELPER GENÉRICO PARA CONTAR ---
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

// 1. OBTENER ESTADÍSTICAS AVANZADAS (DINÁMICO)
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const yearQuery = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        const mode = req.query.mode ? (req.query.mode as string).toUpperCase() : 'ANUAL';

        // --- A. TOTALES (Siempre mostramos el acumulado del AÑO seleccionado) ---
        const inicioAnio = new Date(yearQuery, 0, 1);
        const finAnio = new Date(yearQuery, 11, 31, 23, 59, 59);
        const whereAnio = { createdAt: { [Op.between]: [inicioAnio, finAnio] } };

        const totalPropiedades = await Propiedad.count({ where: whereAnio });
        const totalPropietarios = await Propietario.count({ where: whereAnio });
        const totalClientes = await Cliente.count({ where: whereAnio });
        const totalVisitas = await Visita.count({ where: { ...whereAnio, estado: 'COMPLETADA' } });

        // --- B. LÓGICA DE LA GRÁFICA (SEGÚN EL MODO) ---
        // CORRECCIÓN AQUÍ: Definimos el tipo explícito para evitar el error "implicitly has an 'any[]' type"
        let rangos: { label: string, start: Date, end: Date }[] = [];
        const hoy = new Date();

        // MODO 1: ANUAL (12 Meses)
        if (mode === 'ANUAL') {
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            rangos = meses.map((nombreMes, i) => ({
                label: nombreMes,
                start: new Date(yearQuery, i, 1, 0, 0, 0),
                end: new Date(yearQuery, i + 1, 0, 23, 59, 59)
            }));
        } 
        
        // MODO 2: MENSUAL (Días del mes actual)
        else if (mode === 'MENSUAL') {
            const mesActual = hoy.getMonth(); 
            const diasEnMes = new Date(yearQuery, mesActual + 1, 0).getDate(); 

            for (let d = 1; d <= diasEnMes; d++) {
                rangos.push({
                    label: `${d}`, 
                    start: new Date(yearQuery, mesActual, d, 0, 0, 0),
                    end: new Date(yearQuery, mesActual, d, 23, 59, 59)
                });
            }
        } 
        
        // MODO 3: SEMANAL (Lun-Dom de la semana actual)
        else if (mode === 'SEMANAL') {
            const diaSemana = hoy.getDay(); // 0 (Dom) - 6 (Sab)
            const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1); // Ajuste para Lunes
            const lunes = new Date(hoy.setDate(diff));
            lunes.setHours(0,0,0,0);

            const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

            rangos = diasSemana.map((nombreDia, i) => {
                const diaInicio = new Date(lunes);
                diaInicio.setDate(lunes.getDate() + i);
                
                const diaFin = new Date(diaInicio);
                diaFin.setHours(23, 59, 59, 999);

                return {
                    label: nombreDia,
                    start: diaInicio,
                    end: diaFin
                };
            });
        }

        // Ejecutar la consulta con los rangos calculados
        const datosGrafica = await obtenerDataGrafica(rangos);

        res.json({
            anio: yearQuery,
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
        console.error("Error Dashboard:", error);
        res.status(500).json({ message: 'Error al calcular estadísticas' });
    }
};

// 2. EXPORTAR REPORTE EXCEL
export const exportarReporteExcel = async (req: Request, res: Response) => {
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sillar Inmobiliaria';
        workbook.created = new Date();
        
        const sheet = workbook.addWorksheet('Reporte General');
        
        sheet.columns = [
            { header: 'Fecha Registro', key: 'fecha', width: 20 },
            { header: 'Tipo Inmueble', key: 'tipo', width: 15 },
            { header: 'Ubicación', key: 'ubicacion', width: 25 },
            { header: 'Precio', key: 'precio', width: 15 },
            { header: 'Asesor', key: 'asesor', width: 20 },
        ];

        const propiedades = await Propiedad.findAll({ 
            order: [['createdAt', 'DESC']] 
        });

        propiedades.forEach(p => {
            const d = p.toJSON();
            sheet.addRow({
                fecha: d.createdAt ? new Date(d.createdAt).toLocaleString('es-PE', { timeZone: 'America/Lima' }) : '-',
                tipo: d.tipo,
                ubicacion: d.ubicacion,
                precio: d.precio,
                asesor: d.asesor || 'N/A'
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Sillar.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar Excel' });
    }
};