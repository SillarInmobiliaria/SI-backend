import Cliente from './Cliente';
import Propiedad from './Propiedad';
import Interes from './Interes';
import Propietario from './Propietario';
import Usuario from './Usuario';
import Visita from './Visita';

export const definirAsociaciones = () => {
    // 1. Relación Cliente <-> Interés (Uno a Muchos)
    Cliente.hasMany(Interes, { foreignKey: 'clienteId' });
    Interes.belongsTo(Cliente, { foreignKey: 'clienteId' });

    // 2. Relación Propiedad <-> Interés
    Propiedad.hasMany(Interes, { foreignKey: 'propiedadId' });
    Interes.belongsTo(Propiedad, { foreignKey: 'propiedadId' });

    // 3. Relación Propiedad <-> Propietario (Muchos a Muchos)
    Propiedad.belongsToMany(Propietario, { through: 'PropiedadPropietario' });
    Propietario.belongsToMany(Propiedad, { through: 'PropiedadPropietario' });

    // 4. Relación Visitas
    Cliente.hasMany(Visita, { foreignKey: 'clienteId', as: 'visitas' });
    Visita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

    Propiedad.hasMany(Visita, { foreignKey: 'propiedadId', as: 'visitas' });
    Visita.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });

    Usuario.hasMany(Visita, { foreignKey: 'asesorId', as: 'visitas' });
    Visita.belongsTo(Usuario, { foreignKey: 'asesorId', as: 'asesor' });
};