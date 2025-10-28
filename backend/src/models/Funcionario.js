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
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('Treinamento', 'Autonomo'),
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
