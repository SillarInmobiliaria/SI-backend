import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cliente extends Model {}

Cliente.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono1: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    telefono2: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    estadoCivil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ocupacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaAlta: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    activo: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  },
  {
    sequelize: db,
    modelName: 'Cliente',
    tableName: 'clientes',
  }
);

export default Cliente;