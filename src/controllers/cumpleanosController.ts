import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../config/db'; // Tu conexión a BD
import Cliente from '../models/Cliente';
import Propietario from '../models/Propietario';
import ExcelJS from 'exceljs';

// --- HELPER PARA OBTENER MES ACTUAL SI NO SE ENVÍA ---
const getMesActual = () => new Date().getMonth() + 1; // Enero es 0 en JS, por eso +1

// 1. OBTENER CUMPLEAÑEROS (POR MES)
export const obtenerCumpleanos = async (req: Request, res: Response) => {
    try {
        // Recibimos el mes por query (1 = Enero, 12 = Diciembre)
        const mes = req.query.mes ? Number(req.query.mes) : getMesActual();

        // VALIDACIÓN BÁSICA
        if (isNaN(mes) || mes < 1 || mes > 12) {
            return res.status(400).json({ message: 'Mes inválido (1-12)' });
        }

        // 🧠 LÓGICA SQL: "EXTRACT(MONTH FROM fecha)"
        // Esto ignora el año y solo compara el mes. Funciona en Postgres.
        const whereCumple = db.where(
            db.fn('EXTRACT', db.literal('MONTH FROM "fechaNacimiento"')),
            mes
        );

        // BUSCAMOS EN PARALELO
        const [clientes, propietarios] = await Promise.all([
            Cliente.findAll({ 
                where: { 
                    [Op.and]: [
                        whereCumple,
                        { activo: true } // Opcional: Solo activos
                    ]
                },
                attributes: ['id', 'nombre', 'dni', 'fechaNacimiento', 'telefono1', 'email'] // Solo lo necesario
            }),
            Propietario.findAll({ 
                where: whereCumple, // Los propietarios no suelen tener flag 'activo', pero ajusta si lo tienen
                attributes: ['id', 'nombre', 'dni', 'fechaNacimiento', 'celular1', 'email']
            })
        ]);

        res.json({
            mes,
            total: clientes.length + propietarios.length,
            clientes,
            propietarios
        });

    } catch (error) {
        console.error("❌ Error Cumpleaños:", error);
        res.status(500).json({ message: 'Error al obtener cumpleaños' });
    }
};

// 2. EXPORTAR EXCEL COMBINADO
export const exportarExcelCumpleanos = async (req: Request, res: Response) => {
    try {
        const mes = req.query.mes ? Number(req.query.mes) : getMesActual();
        const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const whereCumple = db.where(
            db.fn('EXTRACT', db.literal('MONTH FROM "fechaNacimiento"')),
            mes
        );

        // Traemos todo
        const [clientes, propietarios] = await Promise.all([
            Cliente.findAll({ where: { [Op.and]: [whereCumple, { activo: true }] } }),
            Propietario.findAll({ where: whereCumple })
        ]);

        // PREPARAMOS EL EXCEL
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(`Cumpleañeros ${nombresMeses[mes-1]}`);

        sheet.columns = [
            { header: 'Día', key: 'dia', width: 8 },
            { header: 'Tipo', key: 'tipo', width: 12 }, // Cliente o Propietario
            { header: 'Nombre Completo', key: 'nombre', width: 30 },
            { header: 'Celular', key: 'celular', width: 15 },
            { header: 'Edad a Cumplir', key: 'edad', width: 15 }, // Calculado
            { header: 'Email', key: 'email', width: 25 },
        ];

        // Función para procesar y añadir filas
        const procesarDatos = (lista: any[], tipo: string) => {
            lista.forEach(persona => {
                const nac = new Date(persona.fechaNacimiento);
                const hoy = new Date();
                const edad = hoy.getFullYear() - nac.getFullYear(); // Edad aproximada que cumplirán este año
                
                // Ajuste visual para el día (sumamos 1 porque a veces UTC lo mueve)
                // O mejor usamos getUTCDate() para ser exactos con lo guardado
                const dia = nac.getUTCDate(); 

                sheet.addRow({
                    dia: dia,
                    tipo: tipo,
                    nombre: persona.nombre,
                    celular: tipo === 'Cliente' ? persona.telefono1 : persona.celular1,
                    edad: edad,
                    email: persona.email || '-'
                });
            });
        };

        procesarDatos(clientes, 'Cliente');
        procesarDatos(propietarios, 'Propietario');

        // Ordenar por día (Columna 1)
        // ExcelJS no tiene sort nativo fácil, pero como es reporte, así está bien.
        // Si quieres ordenarlos, habría que unir los arrays antes de recorrerlos.

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Cumpleanos_${nombresMeses[mes-1]}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar Excel' });
    }
};