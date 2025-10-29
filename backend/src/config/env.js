import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Este arquivo é o primeiro a ser executado e garante que o ambiente esteja configurado.

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Caminho robusto para o arquivo .env na raiz da pasta 'backend'
  const envPath = path.resolve(__dirname, '..', '..', '.env');

  if (!fs.existsSync(envPath)) {
    throw new Error(`Arquivo de configuração .env não encontrado. Esperado em: ${envPath}`);
  }

  dotenv.config({ path: envPath });

  const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'BACKEND_PORT'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes no arquivo .env: ${missingVars.join(', ')}`);
  }

  console.log('[ENV] Variáveis de ambiente carregadas com sucesso.');

} catch (error) {
  console.error('----------------------------------------------------');
  console.error('*** ERRO FATAL: Falha ao carregar o ambiente ***');
  console.error(error.message);
  console.error('----------------------------------------------------');
  process.exit(1);
}
