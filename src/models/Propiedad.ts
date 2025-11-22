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
      type: DataTypes.DECIMAL(10, 2), // Permite precios con centavos
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING, // "Venta" o "Alquiler"
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT, // Texto largo
      allowNull: true,
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