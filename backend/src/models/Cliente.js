import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
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