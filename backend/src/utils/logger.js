import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta de logs, um nível acima de 'utils'
const logDir = path.resolve(__dirname, '..', 'logs');
const logFilePath = path.join(logDir, 'error.log');

// Garante que o diretório de logs exista
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logToFile = (level, message, error = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  if (error) {
    // Inclui a pilha de erros para um diagnóstico completo
    logMessage += `\n${error.stack || error}\n`;
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
  console.log(message);
  logToFile('info', message);
};

export const logError = (message, error) => {
  console.error(message, error);
  logToFile('error', message, error);
};
