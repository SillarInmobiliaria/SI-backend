import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Seguimiento extends Model {}

Seguimiento.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATE, // Cambiado a DATE para aceptar hora si llega
      allowNull: false,
    },
    // 👇 NUEVOS CAMPOS QUE ENVÍA TU FRONTEND
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: { 
      type: DataTypes.STRING, // "PENDIENTE", "FINALIZADO"
      allowNull: true,
    },
    fechaProxima: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: true, // El usuario que registró el seguimiento
    },
    // RELACIONES (Las hacemos opcionales para que no falle si falta una)
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false, // Este sí es obligatorio, siempre hay cliente
    },
    propiedadId: {
      type: DataTypes.UUID,
      allowNull: true, // Opcional (a veces el seguimiento es general)
    },
    // Campos viejos (los dejamos opcionales o los quitamos si no se usan)
    tipoAccion: { 
      type: DataTypes.STRING,
      allowNull: true, 
    },
    respuesta: { 
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Seguimiento',
    tableName: 'seguimientos',
  }
);

export default Seguimiento;