import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cliente extends Model {
  public tipo!: 'PROSPECTO' | 'CLIENTE';
}

Cliente.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Define si es un interesado (Prospecto) o ya formal (Cliente)
    tipo: {
      type: DataTypes.ENUM('PROSPECTO', 'CLIENTE'),
      defaultValue: 'PROSPECTO',
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Datos Opcionales para prospectos
    dni: {
      type: DataTypes.STRING(20),
      allowNull: true, 
      unique: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    telefono2: {
      type: DataTypes.STRING(20),
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
    // Origen / Medio de Captación
    origen: { 
      type: DataTypes.STRING, 
      allowNull: true 
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