import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Diaria = sequelize.define('Diaria', {
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Aprovado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendente',
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  funcionarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'funcionarios',
      key: 'id'
    }
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    }
  }
}, {
  tableName: 'diarias',
  timestamps: true,
});

export default Diaria;
