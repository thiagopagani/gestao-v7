import { Sequelize } from 'sequelize';

// Este arquivo assume que as variáveis de ambiente já foram carregadas
// pelo 'env.js' no ponto de entrada da aplicação (`index.js`).

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, // Mude para `console.log` para depurar queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
    },
  }
);

export default sequelize;
