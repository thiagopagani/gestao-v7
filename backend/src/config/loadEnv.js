import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Garante que as variáveis de ambiente sejam carregadas
// antes de qualquer outro módulo tentar acessá-las.

const __filename = fileURLToPath(import.meta.url);
// __dirname aqui será /backend/src/config
const __dirname = path.dirname(__filename); 

// Resolve o caminho para o arquivo .env que está na raiz do diretório 'backend'
const envPath = path.resolve(__dirname, '..', '..', '.env');

dotenv.config({ path: envPath });
