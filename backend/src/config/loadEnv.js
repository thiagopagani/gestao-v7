import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '..', '.env');

// 1. Verificar se o arquivo .env existe
if (!fs.existsSync(envPath)) {
  console.error(`
    ---------------------------------------------------------------
    ERRO FATAL: Arquivo de configuração não encontrado!
    Crie um arquivo chamado ".env" na pasta "backend" do projeto.
    Caminho esperado: ${envPath}
    ---------------------------------------------------------------
  `);
  process.exit(1); // Encerra o processo com código de erro
}

// 2. Carregar as variáveis de ambiente
dotenv.config({ path: envPath });

// 3. Validar se as variáveis essenciais foram carregadas
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'BACKEND_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`
    ---------------------------------------------------------------
    ERRO FATAL: Variáveis de ambiente ausentes no arquivo .env!
    Por favor, adicione as seguintes variáveis ao arquivo:
    ${missingVars.join(', ')}
    Caminho do arquivo: ${envPath}
    ---------------------------------------------------------------
  `);
  process.exit(1); // Encerra o processo com código de erro
}

console.log('Variáveis de ambiente carregadas com sucesso.');
