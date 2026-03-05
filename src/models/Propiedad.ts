import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Propiedad extends Model {}

Propiedad.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tipo: { type: DataTypes.STRING, allowNull: false },
    modalidad: { type: DataTypes.STRING, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: true },
    precio: { type: DataTypes.DECIMAL(15, 2), allowNull: true }, 
    moneda: { type: DataTypes.STRING, defaultValue: 'USD' },
    
    mantenimiento: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    monedaMantenimiento: { type: DataTypes.STRING, defaultValue: 'PEN' },
    vigilancia: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    monedaVigilancia: { type: DataTypes.STRING, defaultValue: 'PEN' },

    area: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    areaConstruida: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
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
    
    documentosUrls: { type: DataTypes.JSONB, defaultValue: {} },
    documentosurls: { type: DataTypes.JSONB, defaultValue: {} }, 

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
    
    incluyeIgv: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    exclusiva: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    renovable: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },

    testimonio: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    hr: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    pu: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    impuestoPredial: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    arbitrios: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    copiaLiteral: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    cri: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    reciboAguaLuz: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    
    planos: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    certificadoParametros: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    certificadoZonificacion: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    otros: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
  
    revision: { type: DataTypes.BOOLEAN, defaultValue: false },
    asesor: { type: DataTypes.STRING, allowNull: true },
    usuarioId: { type: DataTypes.UUID, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },

    fechaInicioProyecto: { type: DataTypes.DATEONLY, allowNull: true },
    tiempoEjecucion: { type: DataTypes.STRING, allowNull: true },
    fechaEntrega: { type: DataTypes.STRING, allowNull: true },
    tipologias: { type: DataTypes.JSONB, allowNull: true },

    propiedadCompartida: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    agenteExterno: { type: DataTypes.STRING, allowNull: true },
    porcentajeAgenteExterno: { type: DataTypes.DECIMAL(5, 2), allowNull: true }
  },
  { sequelize: db, modelName: 'Propiedad', tableName: 'propiedades' }
);

export default Propiedad;