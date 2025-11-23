import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Operacion extends Model {}

Operacion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tipoGestion: { // Venta, Alquiler, Anticresis
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: { // Alta (Vendido) o Baja (Cancelado)
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaOperacion: { // La fecha de alta o baja
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaContrato: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    precioFinal: { // A cuánto se cerró el trato
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    honorarios: { // El porcentaje de comisión (ej: 5%)
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    asesor: { // Nombre del asesor
      type: DataTypes.STRING,
      allowNull: false,
    },
    propiedadId: { // Qué casa se vendió
      type: DataTypes.UUID,
      allowNull: false,
    },
    clienteId: { // Quién la compró (Opcional si fue baja)
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Operacion',
    tableName: 'operaciones',
  }
);

export default Operacion;