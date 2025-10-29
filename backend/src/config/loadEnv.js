import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { logInfo, logError } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
// __dirname aqui é backend/src/config
const __dirname = path.dirname(__filename); 
// Sobe dois níveis para chegar na pasta 'backend'
const envPath = path.join(__dirname, '..', '..', '.env');

logInfo(`Procurando arquivo .env em: ${envPath}`);

// 1. Verificar se o arquivo .env existe
if (!fs.existsSync(envPath)) {
  const errorMessage = `
    ---------------------------------------------------------------
    ERRO FATAL: Arquivo de configuração não encontrado!
    Crie um arquivo chamado ".env" na pasta "backend" do projeto.
    Caminho esperado: ${envPath}
    ---------------------------------------------------------------
  `;
  logError(errorMessage, null);
  process.exit(1); // Encerra o processo com código de erro
}

// 2. Carregar as variáveis de ambiente
dotenv.config({ path: envPath });
logInfo('Arquivo .env encontrado. Carregando variáveis.');

// 3. Validar se as variáveis essenciais foram carregadas
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'BACKEND_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  const errorMessage = `
    ---------------------------------------------------------------
    ERRO FATAL: Variáveis de ambiente ausentes no arquivo .env!
    Por favor, adicione as seguintes variáveis ao arquivo:
    ${missingVars.join(', ')}
    Caminho do arquivo: ${envPath}
    ---------------------------------------------------------------
  `;
  logError(errorMessage, null);
  process.exit(1); // Encerra o processo com código de erro
}

logInfo('Variáveis de ambiente carregadas e validadas com sucesso.');
