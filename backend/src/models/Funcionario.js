
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Funcionario = sequelize.define('Funcionario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('Autônomo', 'Treinamento'),
    allowNull: false,
    defaultValue: 'Treinamento',
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
  tableName: 'funcionarios',
  timestamps: true,
});

export default Funcionario;