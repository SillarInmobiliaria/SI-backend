    import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cierre extends Model {
    public id!: string;
    public tipoOperacion!: 'VENTA' | 'ALQUILER';
    public fechaCierre!: string; // Fecha de firma general
    
    // --- Relaciones ---
    public propiedadId!: string; // ID de la propiedad (se llenará desde el front)
    public clienteId!: string;   // ID del cliente
    public asesorId!: string;    // ID del usuario logueado

    // --- DATOS COMUNES ---
    public notaria!: string;
    public ubicacionNotaria!: string;
    public observaciones!: string;
    public estado!: 'PENDIENTE' | 'CERRADO' | 'CAIDO';

    // --- CAMPOS SOLO ALQUILER ---
    public tipoFirma!: 'LEGALIZACION' | 'ESCRITURA_PUBLICA';
    public moneda!: 'USD' | 'PEN';
    public montoRenta!: number;
    public fechaInicio!: string;
    public fechaTermino!: string;
    public plazoContrato!: string; // Ej: "1 año" o "12 meses"
    public diasGracia!: number;
    public garantia!: number; // Monto garantía (generalmente 2 meses)
    public mesAdelantado!: number;
    // Datos Bancarios del Propietario (para el contrato)
    public banco!: string;
    public numeroCuenta!: string;
    public cci!: string;
    public titularCuenta!: string;
    // Condiciones
    public permiteMascotas!: boolean;
    public incluyeCochera!: boolean;
    public mantenimientoIncluido!: boolean;

    // --- CAMPOS SOLO VENTA ---
    public numeroEscritura!: string;
    public gastosNotariales!: number;
    public gastosRegistrales!: number;
    public fechaEntrega!: string;
    public montoVenta!: number;
    public impuestoAlcabala!: number;
    public impuestoRenta!: number; // El que paga el vendedor
    public formaPago!: 'CONTADO' | 'FINANCIADO';
    // Etapa de la venta
    public etapaVenta!: 'RESERVA' | 'ARRAS' | 'MINUTA' | 'ESCRITURA';
    public montoArras!: number; // Si hubo separación
    public bancoFinanciamiento!: string;
    public cuotaInicial!: number;
}

Cierre.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tipoOperacion: { type: DataTypes.ENUM('VENTA', 'ALQUILER'), allowNull: false },
    fechaCierre: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    
    // Relaciones (IDs simples para la beta, luego hacemos asociaciones)
    propiedadId: { type: DataTypes.STRING, allowNull: true },
    clienteId: { type: DataTypes.STRING, allowNull: true },
    asesorId: { type: DataTypes.STRING, allowNull: true },

    // Comunes
    notaria: { type: DataTypes.STRING, allowNull: true },
    ubicacionNotaria: { type: DataTypes.STRING, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('PENDIENTE', 'CERRADO', 'CAIDO'), defaultValue: 'PENDIENTE' },

    // Alquiler
    tipoFirma: { type: DataTypes.STRING, allowNull: true },
    moneda: { type: DataTypes.ENUM('USD', 'PEN'), defaultValue: 'USD' },
    montoRenta: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    fechaInicio: { type: DataTypes.DATEONLY, allowNull: true },
    fechaTermino: { type: DataTypes.DATEONLY, allowNull: true },
    plazoContrato: { type: DataTypes.STRING, allowNull: true },
    diasGracia: { type: DataTypes.INTEGER, defaultValue: 0 },
    garantia: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    mesAdelantado: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    banco: { type: DataTypes.STRING, allowNull: true },
    numeroCuenta: { type: DataTypes.STRING, allowNull: true },
    cci: { type: DataTypes.STRING, allowNull: true },
    titularCuenta: { type: DataTypes.STRING, allowNull: true },
    permiteMascotas: { type: DataTypes.BOOLEAN, defaultValue: false },
    incluyeCochera: { type: DataTypes.BOOLEAN, defaultValue: false },
    mantenimientoIncluido: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Venta
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