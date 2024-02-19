import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js'


export const Report  = sequelize.define('report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    link: {
        type: DataTypes.STRING
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

