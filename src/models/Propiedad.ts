import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Propiedad extends Model {}

Propiedad.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    moneda: {
      type: DataTypes.STRING, // "USD" o "PEN"
      defaultValue: 'USD',
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modalidad: {
      type: DataTypes.STRING, // "Venta" o "Alquiler"
      defaultValue: 'Venta',
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 👇 Campos de Área (con valor por defecto 0 para evitar errores)
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0, 
    },
    areaConstruida: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    propietarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Propiedad',
    tableName: 'propiedades',
  }
);

export default Propiedad;