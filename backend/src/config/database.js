// Este arquivo não deve carregar o .env. Ele assume que já foi carregado.
import { Sequelize } from 'sequelize';

let sequelize;

try {
  // Verificação de segurança para garantir que as variáveis existem
  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    throw new Error('As variáveis de ambiente do banco de dados não estão definidas. O servidor não pode iniciar.');
  }

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mariadb',
      logging: false, // Em produção, o logging pode ser desativado ou direcionado
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} catch (error) {
    console.error('---------------------------------------------------------------');
    console.error('ERRO FATAL AO INICIALIZAR O SEQUELIZE (CONEXÃO COM O BANCO):');
    console.error(error);
    console.error('---------------------------------------------------------------');
    process.exit(1);
}


export default sequelize;
