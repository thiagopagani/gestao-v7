import { Sequelize } from 'sequelize';

// Este arquivo é agora muito mais simples. Ele assume que as variáveis
// de ambiente já foram carregadas pelo ponto de entrada da aplicação (`index.js`).

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, // Defina como `console.log` para ver as queries SQL durante o desenvolvimento
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true, // Impede que o Sequelize pluralize os nomes das tabelas
    },
  }
);

export default sequelize;
