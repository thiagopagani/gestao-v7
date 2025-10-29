import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O caminho correto para a pasta 'backend' é dois níveis acima de 'utils'
const backendDir = path.resolve(__dirname, '..', '..');
const logDir = path.join(backendDir, 'logs');
const logFilePath = path.join(logDir, 'error.log');

// Garante que o diretório de logs exista
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  console.error('Falha crítica ao criar o diretório de logs:', err);
  // Se não for possível nem criar o diretório de log, não há muito o que fazer.
  // O processo provavelmente irá falhar na próxima tentativa de escrita.
}


const logToFile = (level, message, error = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  if (error) {
    // Inclui a pilha de erros para um diagnóstico completo
    logMessage += `\n${error.stack || JSON.stringify(error, null, 2)}\n`;
  }
  
  logMessage += '\n';

  try {
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
  } catch (err) {
    // Se o logger falhar, loga no console como último recurso
    console.error('Falha ao escrever no arquivo de log:', err);
    console.error('Mensagem original:', logMessage);
  }
};

export const logInfo = (message) => {
  console.log(`[INFO] ${message}`);
  logToFile('info', message);
};

export const logError = (message, error) => {
  console.error(`[ERROR] ${message}`, error || '');
  logToFile('error', message, error);
};
