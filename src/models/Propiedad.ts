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
      defaultValue: 'Arequipa',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    moneda: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modalidad: {
      type: DataTypes.STRING,
      defaultValue: 'Venta',
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    mapaUrl: {
      type: DataTypes.TEXT, // TEXT porque los iframes son largos
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    propietarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    distribucion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fotoPrincipal: {
      type: DataTypes.STRING,
      allowNull: true, // Guardaremos la ruta ej: "uploads/foto1.jpg"
    },
    galeria: {
      type: DataTypes.JSON, // Guardaremos un array: ["uploads/f2.jpg", "uploads/f3.jpg"]
      allowNull: true,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    asesor: {
      type: DataTypes.STRING,
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