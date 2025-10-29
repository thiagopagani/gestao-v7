import { Sequelize } from 'sequelize';

// Este arquivo assume que as variáveis de ambiente já foram carregadas
// pelo 'env.js' no ponto de entrada da aplicação.

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, // Desativa os logs de SQL no console. Mude para `console.log` para depurar.
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      // Evita que o Sequelize pluralize os nomes das tabelas automaticamente
      freezeTableName: true,
    },
  }
);

export default sequelize;
