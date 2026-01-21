import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cierre extends Model {
    public id!: string;
    public tipoOperacion!: 'VENTA' | 'ALQUILER';
    public fechaCierre!: string;
    
    // Relaciones
    public propiedadId!: string; 
    public clienteId!: string;   
    public asesorId!: string;    

    // Datos Comunes
    public notaria!: string;
    public ubicacionNotaria!: string;
    public observaciones!: string;
    public estado!: 'PENDIENTE' | 'CERRADO' | 'CAIDO';
    public partidaRegistral!: string;

    // Alquiler
    public tipoFirma!: string;
    public moneda!: string;
    public montoRenta!: number;
    public fechaInicio!: string;
    public fechaTermino!: string;
    public plazoContrato!: string;
    public diasGracia!: number;
    public diasTolerancia!: number;
    public moraDiaria!: number;
    public penalidadResolucion!: number;
    public garantia!: number;
    public mesAdelantado!: number;
    public banco!: string;
    public numeroCuenta!: string;
    public cci!: string;
    public titularCuenta!: string;
    public tieneInventario!: boolean;
    public permiteMascotas!: boolean;
    public incluyeCochera!: boolean;
    public mantenimientoIncluido!: boolean;
    public direccionClienteContrato!: string;
    public datosRepresentante!: string;

    // Venta
    public numeroEscritura!: string;
    public gastosNotariales!: number;
    public gastosRegistrales!: number;
    public fechaEntrega!: string;
    public montoVenta!: number;
    public impuestoAlcabala!: number;
    public impuestoRenta!: number;
    public formaPago!: string;
    public etapaVenta!: string;
    public montoArras!: number;
    public bancoFinanciamiento!: string;
    public cuotaInicial!: number;
}

Cierre.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tipoOperacion: { type: DataTypes.ENUM('VENTA', 'ALQUILER'), allowNull: false },
    fechaCierre: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    
    propiedadId: { type: DataTypes.STRING, allowNull: true },
    clienteId: { type: DataTypes.STRING, allowNull: true },
    asesorId: { type: DataTypes.STRING, allowNull: true },

    notaria: { type: DataTypes.STRING, allowNull: true },
    ubicacionNotaria: { type: DataTypes.STRING, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('PENDIENTE', 'CERRADO', 'CAIDO'), defaultValue: 'PENDIENTE' },
    partidaRegistral: { type: DataTypes.STRING, allowNull: true },

    // ALQUILER
    tipoFirma: { type: DataTypes.STRING, allowNull: true },
    moneda: { type: DataTypes.ENUM('USD', 'PEN'), defaultValue: 'PEN' },
    montoRenta: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    
    // FECHAS CRÍTICAS
    fechaInicio: { type: DataTypes.DATEONLY, allowNull: true }, 
    fechaTermino: { type: DataTypes.DATEONLY, allowNull: true },
    
    plazoContrato: { type: DataTypes.STRING, allowNull: true },
    diasGracia: { type: DataTypes.INTEGER, defaultValue: 0 },
    diasTolerancia: { type: DataTypes.INTEGER, defaultValue: 0 },
    moraDiaria: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    penalidadResolucion: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    garantia: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    mesAdelantado: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    
    banco: { type: DataTypes.STRING, allowNull: true },
    numeroCuenta: { type: DataTypes.STRING, allowNull: true },
    cci: { type: DataTypes.STRING, allowNull: true },
    titularCuenta: { type: DataTypes.STRING, allowNull: true },
    
    tieneInventario: { type: DataTypes.BOOLEAN, defaultValue: false },
    permiteMascotas: { type: DataTypes.BOOLEAN, defaultValue: false },
    incluyeCochera: { type: DataTypes.BOOLEAN, defaultValue: false },
    mantenimientoIncluido: { type: DataTypes.BOOLEAN, defaultValue: false },
    direccionClienteContrato: { type: DataTypes.STRING, allowNull: true },
    datosRepresentante: { type: DataTypes.TEXT, allowNull: true },

    // VENTA
    numeroEscritura: { type: DataTypes.STRING, allowNull: true },
    gastosNotariales: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    gastosRegistrales: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    
    fechaEntrega: { type: DataTypes.DATEONLY, allowNull: true },
    
    montoVenta: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    impuestoAlcabala: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    impuestoRenta: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    formaPago: { type: DataTypes.STRING, allowNull: true },
    etapaVenta: { type: DataTypes.STRING, allowNull: true },
    montoArras: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    bancoFinanciamiento: { type: DataTypes.STRING, allowNull: true },
    cuotaInicial: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },

}, {
    sequelize: db,
    modelName: 'Cierre',
    tableName: 'cierres',
});

export default Cierre;