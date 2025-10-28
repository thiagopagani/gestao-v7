import Empresa from './Empresa.js';
import Cliente from './Cliente.js';
import Funcionario from './Funcionario.js';
import Diaria from './Diaria.js';
import User from './User.js';

// Relação: Empresa pode ter muitos Clientes
Empresa.hasMany(Cliente, { foreignKey: 'empresaId', as: 'clientes' });
Cliente.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Relação: Empresa pode ter muitos Funcionários
Empresa.hasMany(Funcionario, { foreignKey: 'empresaId', as: 'funcionarios' });
Funcionario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Relação: Funcionário pode ter muitas Diárias
Funcionario.hasMany(Diaria, { foreignKey: 'funcionarioId', as: 'diarias' });
Diaria.belongsTo(Funcionario, { foreignKey: 'funcionarioId', as: 'funcionario' });

// Relação: Cliente pode ter muitas Diárias
Cliente.hasMany(Diaria, { foreignKey: 'clienteId', as: 'diarias' });
Diaria.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

// Exporta todos os modelos para fácil acesso
export { Empresa, Cliente, Funcionario, Diaria, User };
