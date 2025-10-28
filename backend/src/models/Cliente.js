// FIX: This file had invalid content. Created the Sequelize model for Cliente to define the database schema.
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj_cpf: {
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
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'empresas',
        key: 'id'
    }
  }
}, {
  tableName: 'clientes',
  timestamps: true,
});

export default Cliente;
