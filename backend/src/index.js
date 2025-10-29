// backend/src/index.js - PONTO DE ENTRADA ÚNICO E ROBUSTO

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import app from './app.js';
import { seedAdminUser } from './models/seed.js';
import './models/index.js'; // Importa para registrar as associações

// 1. CARREGAR E VALIDAR O AMBIENTE (PRIMEIRA COISA A SER FEITA)
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.resolve(__dirname, '..', '..', '.env');

  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at ${envPath}`);
  }

  dotenv.config({ path: envPath });
  console.log('[ENV] Variáveis de ambiente carregadas.');

  const requiredVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'BACKEND_PORT'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
  }
} catch (error) {
  console.error('---------------------------------');
  console.error('ERRO FATAL NA CONFIGURAÇÃO DO AMBIENTE:');
  console.error(error.message);
  console.error('---------------------------------');
  process.exit(1);
}

const PORT = process.env.BACKEND_PORT || 3001;

// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
const start = async () => {
  try {
    // 2. CONECTAR AO BANCO DE DADOS
    console.log('[DB] Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('[DB] Conexão com o banco de dados bem-sucedida.');

    // 3. RESETAR E SINCRONIZAR O BANCO DE DADOS (force: true)
    console.log('[DB] Sincronizando e resetando o banco de dados (force: true)...');
    await sequelize.sync({ force: true });
    console.log('[DB] Banco de dados resetado e sincronizado.');

    // 4. CRIAR USUÁRIO ADMIN PADRÃO
    await seedAdminUser();

    // 5. INICIAR O SERVIDOR DA APLICAÇÃO
    app.listen(PORT, () => {
      console.log(`[SERVER] Servidor iniciado com sucesso na porta ${PORT}`);
    });

  } catch (error) {
    console.error('---------------------------------');
    console.error('ERRO FATAL AO INICIAR A APLICAÇÃO:');
    console.error(error);
    console.error('---------------------------------');
    process.exit(1);
  }
};

// EXECUTA A INICIALIZAÇÃO
start();
