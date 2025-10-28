import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Empresa = sequelize.define('empresa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
  telefone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo',
  },
}, {
  tableName: 'empresas',
});

export default Empresa;
