import './loadEnv.js'; // FORÇA O CARREGAMENTO DAS VARIÁVEIS DE AMBIENTE PRIMEIRO
import { Sequelize } from 'sequelize';

// As variáveis de ambiente agora são carregadas pelo 'loadEnv.js'
// que é importado no topo do 'index.js'.
// Este arquivo apenas consome as variáveis que já devem existir.

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, // Desativar logging de queries SQL no console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;