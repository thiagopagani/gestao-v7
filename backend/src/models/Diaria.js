import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Diaria = sequelize.define('diaria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Aprovado', 'Cancelado'),
    defaultValue: 'Pendente',
  },
  observacao: {
    type: DataTypes.TEXT,
  },
  funcionarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'funcionarios',
      key: 'id',
    },
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id',
    },
  },
}, {
  tableName: 'diarias',
});

export default Diaria;
