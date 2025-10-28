import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  papel: {
    type: DataTypes.ENUM('Admin', 'Operador'),
    defaultValue: 'Operador',
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo',
  },
}, {
  tableName: 'users',
});

export default User;
