import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ExcelJS from 'exceljs';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';
import Cliente from '../models/Cliente';
import Visita from '../models/Visita';

// --- HELPERS ---
const getRangoAnio = (anio: number) => {
    const inicio = new Date(anio, 0, 1);
    const fin = new Date(anio, 11, 31, 23, 59, 59);
    return { inicio, fin };
};

// Función auxiliar para contar registros por mes
async function getConteoPorMeses(Modelo: any, anio: number, extraWhere: any = {}) {
    const datosMensuales = [];
    
    for (let mes = 0; mes < 12; mes++) {
        const inicio = new Date(anio, mes, 1);
        const fin = new Date(anio, mes + 1, 0, 23, 59, 59);

        const count = await Modelo.count({
            where: { 
                createdAt: { [Op.between]: [inicio, fin] },
                ...extraWhere 
            }
        });
        datosMensuales.push(count);
    }
    return datosMensuales;
}

// 1. OBTENER ESTADÍSTICAS AVANZADAS
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const yearQuery = req.query.year ? Number(req.query.year) : new Date().getFullYear();

        // A. Totales Anuales
        const rango = getRangoAnio(yearQuery);
        const whereAnio = { createdAt: { [Op.between]: [rango.inicio, rango.fin] } };

        const totalPropiedades = await Propiedad.count({ where: whereAnio });
        const totalPropietarios = await Propietario.count({ where: whereAnio });
        
        const totalClientes = await Cliente.count({ where: whereAnio });

        // Contamos solo las visitas REALIZADAS (COMPLETADA)
        const totalVisitas = await Visita.count({ 
            where: { 
                ...whereAnio, 
                estado: 'COMPLETADA' 
            } 
        });

        // B. Datos para la Gráfica (Mes a Mes)
        const [grafPropiedades, grafClientes, grafPropietarios, grafVisitas] = await Promise.all([
            getConteoPorMeses(Propiedad, yearQuery),
            getConteoPorMeses(Cliente, yearQuery),
            getConteoPorMeses(Propietario, yearQuery),
            getConteoPorMeses(Visita, yearQuery, { estado: 'COMPLETADA' })
        ]);

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        const datosGrafica = meses.map((mes, index) => ({
            name: mes,
            propiedades: grafPropiedades[index],
            clientes: grafClientes[index],
            propietarios: grafPropietarios[index],
            visitas: grafVisitas[index]
        }));

        res.json({
            anio: yearQuery,
            totales: {
                propiedades: totalPropiedades,
                propietarios: totalPropietarios,
                clientes: totalClientes,
                visitas: totalVisitas
            },
            grafica: datosGrafica
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
                fecha: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '-',
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