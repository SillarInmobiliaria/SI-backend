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
    tipoAccion: { // "Llamada", "WhatsApp", "Correo", "Reunión"
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    respuesta: { // "Contestó", "Buzón", "Le gustó", "Pide rebaja"
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    propiedadId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Seguimiento',
    tableName: 'seguimientos',
  }
);

export default Seguimiento;