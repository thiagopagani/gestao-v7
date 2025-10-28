import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Empresa = sequelize.define('empresa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    allowNull: false,
    defaultValue: 'Ativo',
  },
}, {
  tableName: 'empresas',
});

export default Empresa;
