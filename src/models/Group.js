import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js'
import { Report } from './Report.js';


export const Group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    icono: {
        type: DataTypes.STRING
    }
});

Group.hasMany(Report, {
    foreignKey: 'groupId',
    sourceKey: 'id'
});

Report.belongsTo(Group, {
    foreignKey: 'groupId',
    sourceKey: 'id'
});

