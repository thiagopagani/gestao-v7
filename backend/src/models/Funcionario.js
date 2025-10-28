import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Funcionario = sequelize.define('funcionario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
      unique: true,
      validate: {
          isEmail: true,
      }
  },
  telefone: {
    type: DataTypes.STRING,
  },
  tipo: {
    type: DataTypes.ENUM('Autônomo', 'Treinamento'),
    defaultValue: 'Treinamento',
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
  tableName: 'funcionarios',
});

export default Funcionario;
