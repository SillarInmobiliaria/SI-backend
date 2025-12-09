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
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    moneda: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modalidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    areaConstruida: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    habitaciones: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    banos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cocheras: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Este campo es opcional porque usamos N:M
    propietarioId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    distribucion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mapaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fotoPrincipal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    galeria: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partidaRegistral: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    numeroPartida: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaCaptacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fechaInicioContrato: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fechaVencimientoContrato: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    comision: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoContrato: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testimonio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hr: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    impuestoPredial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    arbitrios: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    copiaLiteral: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    plataforma: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Propiedad',
    tableName: 'propiedades',
  }
);

export default Propiedad;