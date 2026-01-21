import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../config/db'; 
import Cliente from '../models/Cliente';
import Propietario from '../models/Propietario';
import Cartera from '../models/Cartera';
import ExcelJS from 'exceljs';

const getMesActual = () => new Date().getMonth() + 1; 

// 1. OBTENER CUMPLEAÑEROS
export const obtenerCumpleanos = async (req: Request, res: Response) => {
    try {
        const mes = req.query.mes ? Number(req.query.mes) : getMesActual();

        if (isNaN(mes) || mes < 1 || mes > 12) {
            return res.status(400).json({ message: 'Mes inválido (1-12)' });
        }

        // LÓGICA SQL
        const whereCumple = db.where(
            db.fn('EXTRACT', db.literal('MONTH FROM "fechaNacimiento"')),
            mes
        );

        const [clientesViejos, carteraNuevos, propietarios] = await Promise.all([
            Cliente.findAll({ 
                where: { 
                    [Op.and]: [ whereCumple, { activo: true } ]
                },
                attributes: ['id', 'nombre', 'dni', 'fechaNacimiento', 'telefono1', 'email']
            }),
            
            // 2. Cartera de Clientes
            Cartera.findAll({
                where: whereCumple,
                attributes: [
                    'id', 
                    ['nombreCompleto', 'nombre'],
                    'documento',
                    'fechaNacimiento', 
                    ['telefono', 'telefono1'],    
                    'email'
                ]
            }),

            // 3. Propietarios
            Propietario.findAll({ 
                where: whereCumple,
                attributes: ['id', 'nombre', 'dni', 'fechaNacimiento', 'celular1', 'email']
            })
        ]);

        const todosLosClientes = [...clientesViejos, ...carteraNuevos];

        res.json({
            mes,
            total: todosLosClientes.length + propietarios.length,
            clientes: todosLosClientes, // Enviamos la lista combinada
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

        const [clientes, cartera, propietarios] = await Promise.all([
            Cliente.findAll({ where: { [Op.and]: [whereCumple, { activo: true }] } }),
            Cartera.findAll({ where: whereCumple }),
            Propietario.findAll({ where: whereCumple })
        ]);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(`Cumpleañeros ${nombresMeses[mes-1]}`);

        sheet.columns = [
            { header: 'Día', key: 'dia', width: 8 },
            { header: 'Tipo', key: 'tipo', width: 12 },
            { header: 'Nombre Completo', key: 'nombre', width: 30 },
            { header: 'Celular', key: 'celular', width: 15 },
            { header: 'Edad a Cumplir', key: 'edad', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
        ];

        const procesarDatos = (lista: any[], tipo: string) => {
            lista.forEach(persona => {
                const nac = new Date(persona.fechaNacimiento);
                const hoy = new Date();
                const edad = hoy.getFullYear() - nac.getFullYear(); 
                const dia = nac.getUTCDate(); 
                let nombre = persona.nombre;
                let telefono = persona.telefono1 || persona.celular1;

                if (tipo === 'Cartera (Cliente)') {
                    nombre = persona.nombreCompleto;
                    telefono = persona.telefono;
                }

                sheet.addRow({
                    dia: dia,
                    tipo: tipo,
                    nombre: nombre,
                    celular: telefono,
                    edad: edad,
                    email: persona.email || '-'
                });
            });
        };

        procesarDatos(clientes, 'Cliente');
        procesarDatos(cartera, 'Cartera (Cliente)');
        procesarDatos(propietarios, 'Propietario');

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Cumpleanos_${nombresMeses[mes-1]}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar Excel' });
    }
};