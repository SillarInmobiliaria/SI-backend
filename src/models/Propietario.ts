import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Propietario extends Model {}

Propietario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tipoPersona: {
      type: DataTypes.ENUM('PN', 'PJ'),
      defaultValue: 'PN',
      allowNull: false,
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ruc: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    rolRepresentante: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partidaElectronica: {
      type: DataTypes.STRING,
      allowNull: true,
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
    celular1: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    celular2: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaAlta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cuenta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cci: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cuentasBancarias: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ocupacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estadoCivil: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Propietario',
    tableName: 'propietarios',
  }
);

export default Propietario;