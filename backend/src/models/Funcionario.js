import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Funcionario = sequelize.define('funcionario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  funcao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('Treinamento', 'Autônomo'),
    allowNull: false,
    defaultValue: 'Treinamento',
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    allowNull: false,
    defaultValue: 'Ativo',
  },
}, {
  tableName: 'funcionarios',
});

export default Funcionario;
