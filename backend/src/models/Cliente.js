import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('cliente', {
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
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
  },
   cidade: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.STRING,
  },
  telefone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo',
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id',
    },
  },
}, {
  tableName: 'clientes',
});

export default Cliente;
