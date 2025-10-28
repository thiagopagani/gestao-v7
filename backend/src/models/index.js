
import User from './User.js';
import Empresa from './Empresa.js';
import Cliente from './Cliente.js';
import Funcionario from './Funcionario.js';
import Diaria from './Diaria.js';

// Define associations

// Uma Empresa tem muitos Clientes
Empresa.hasMany(Cliente, { foreignKey: 'empresaId', as: 'clientes' });
Cliente.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Uma Empresa tem muitos Funcionários
Empresa.hasMany(Funcionario, { foreignKey: 'empresaId', as: 'funcionarios' });
Funcionario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Um Funcionário pode ter muitas Diárias
Funcionario.hasMany(Diaria, { foreignKey: 'funcionarioId', as: 'diarias' });
Diaria.belongsTo(Funcionario, { foreignKey: 'funcionarioId', as: 'funcionario' });

// Um Cliente pode ter muitas Diárias
Cliente.hasMany(Diaria, { foreignKey: 'clienteId', as: 'diarias' });
Diaria.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });


export { User, Empresa, Cliente, Funcionario, Diaria };
