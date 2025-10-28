
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
      timezone: 'Etc/GMT-3',
    },
  }
);

export default sequelize;
