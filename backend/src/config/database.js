import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente ANTES de qualquer outra coisa.
// Isso é crucial para garantir que as credenciais do banco estejam disponíveis.
try {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const envPath = path.resolve(__dirname, '..', '..', '.env');
  dotenv.config({ path: envPath });
} catch (e) {
    console.error('Erro ao carregar o arquivo .env. Certifique-se de que ele existe em backend/.env', e);
    process.exit(1);
}

// Validação das variáveis de ambiente
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`ERRO FATAL: Variáveis de ambiente obrigatórias ausentes: ${missingVars.join(', ')}`);
    console.error('Verifique seu arquivo backend/.env');
    process.exit(1);
}

let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mariadb',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} catch (error) {
    console.error('---------------------------------------------------------------');
    console.error('ERRO FATAL AO CRIAR A INSTÂNCIA DO SEQUELIZE:');
    console.error(error);
    console.error('---------------------------------------------------------------');
    process.exit(1);
}

export default sequelize;
