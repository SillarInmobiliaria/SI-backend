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
    area: { type: DataTypes.FLOAT, allowNull: true },
    areaConstruida: { type: DataTypes.FLOAT, allowNull: true },
    
    // --- DETALLES ---
    habitaciones: { type: DataTypes.INTEGER, allowNull: true },
    banos: { type: DataTypes.INTEGER, allowNull: true },
    cocheras: { type: DataTypes.INTEGER, allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    detalles: { type: DataTypes.TEXT, allowNull: true }, // Distribución interna

    // --- MULTIMEDIA ---
    fotoPrincipal: { type: DataTypes.STRING, allowNull: true },
    galeria: { type: DataTypes.JSON, allowNull: true }, // Array de rutas de fotos
    videoUrl: { type: DataTypes.STRING, allowNull: true },
    mapaUrl: { type: DataTypes.TEXT, allowNull: true },
    pdfUrl: { type: DataTypes.STRING, allowNull: true },

    // --- LINKS EXTERNOS (NUEVO) ---
    link1: { type: DataTypes.STRING, allowNull: true },
    link2: { type: DataTypes.STRING, allowNull: true },
    link3: { type: DataTypes.STRING, allowNull: true },
    link4: { type: DataTypes.STRING, allowNull: true },
    link5: { type: DataTypes.STRING, allowNull: true },

    // --- DATOS LEGALES Y CONTRATO (NUEVO) ---
    partidaRegistral: { type: DataTypes.STRING, allowNull: true },
    partidaAdicional: { type: DataTypes.STRING, allowNull: true }, // Depas
    partidaCochera: { type: DataTypes.STRING, allowNull: true },   // Depas
    partidaDeposito: { type: DataTypes.STRING, allowNull: true },  // Depas
    
    fechaCaptacion: { type: DataTypes.DATEONLY, allowNull: true },
    inicioContrato: { type: DataTypes.DATEONLY, allowNull: true },
    finContrato: { type: DataTypes.DATEONLY, allowNull: true },
    tipoContrato: { type: DataTypes.STRING, allowNull: true }, // Exclusiva / Sin Exclusiva
    comision: { type: DataTypes.FLOAT, allowNull: true },

    // --- CHECKLIST DOCUMENTOS (True/False) ---
    testimonio: { type: DataTypes.BOOLEAN, defaultValue: false },
    hr: { type: DataTypes.BOOLEAN, defaultValue: false },
    pu: { type: DataTypes.BOOLEAN, defaultValue: false },
    impuestoPredial: { type: DataTypes.BOOLEAN, defaultValue: false },
    arbitrios: { type: DataTypes.BOOLEAN, defaultValue: false },
    copiaLiteral: { type: DataTypes.BOOLEAN, defaultValue: false },

    // --- GESTIÓN ---
    asesor: { type: DataTypes.STRING, allowNull: true }, // Nombre del asesor
    usuarioId: { type: DataTypes.UUID, allowNull: true }, // ID del asesor (Relación)
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    observaciones: { type: DataTypes.JSON, allowNull: true } // Para guardar notas del abogado
  },
  {
    sequelize: db,
    modelName: 'Propiedad',
    tableName: 'propiedades',
  }
);

export default Propiedad;