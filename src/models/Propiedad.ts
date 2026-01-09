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
    // --- DATOS BÁSICOS ---
    tipo: { type: DataTypes.STRING, allowNull: false },
    modalidad: { type: DataTypes.STRING, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: true },
    precio: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    moneda: { type: DataTypes.STRING, defaultValue: 'USD' },
    
    // Mantenimiento (Para departamentos)
    mantenimiento: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    area: { type: DataTypes.FLOAT, allowNull: true },
    areaConstruida: { type: DataTypes.FLOAT, allowNull: true },
    habitaciones: { type: DataTypes.INTEGER, allowNull: true },
    banos: { type: DataTypes.INTEGER, allowNull: true },
    cocheras: { type: DataTypes.INTEGER, allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    detalles: { type: DataTypes.TEXT, allowNull: true },

    fotoPrincipal: { type: DataTypes.STRING, allowNull: true },
    galeria: { type: DataTypes.JSON, allowNull: true },
    videoUrl: { type: DataTypes.STRING, allowNull: true },
    mapaUrl: { type: DataTypes.TEXT, allowNull: true },
    pdfUrl: { type: DataTypes.STRING, allowNull: true },

    link1: { type: DataTypes.STRING, allowNull: true },
    link2: { type: DataTypes.STRING, allowNull: true },
    link3: { type: DataTypes.STRING, allowNull: true },
    link4: { type: DataTypes.STRING, allowNull: true },
    link5: { type: DataTypes.STRING, allowNull: true },

    partidaRegistral: { type: DataTypes.STRING, allowNull: true },
    partidaAdicional: { type: DataTypes.STRING, allowNull: true },
    partidaCochera: { type: DataTypes.STRING, allowNull: true },
    partidaDeposito: { type: DataTypes.STRING, allowNull: true },
    
    fechaCaptacion: { type: DataTypes.DATEONLY, allowNull: true },
    inicioContrato: { type: DataTypes.DATEONLY, allowNull: true },
    finContrato: { type: DataTypes.DATEONLY, allowNull: true },
    tipoContrato: { type: DataTypes.STRING, allowNull: true },
    comision: { type: DataTypes.FLOAT, allowNull: true },

    testimonio: { type: DataTypes.BOOLEAN, defaultValue: false },
    hr: { type: DataTypes.BOOLEAN, defaultValue: false },
    pu: { type: DataTypes.BOOLEAN, defaultValue: false },
    impuestoPredial: { type: DataTypes.BOOLEAN, defaultValue: false },
    arbitrios: { type: DataTypes.BOOLEAN, defaultValue: false },
    copiaLiteral: { type: DataTypes.BOOLEAN, defaultValue: false },

    revision: { type: DataTypes.BOOLEAN, defaultValue: false },

    asesor: { type: DataTypes.STRING, allowNull: true },
    usuarioId: { type: DataTypes.UUID, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    sequelize: db,
    modelName: 'Propiedad',
    tableName: 'propiedades',
  }
);

export default Propiedad;