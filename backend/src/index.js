import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// --- MODO DE DIAGNÓSTICO ---
// Este arquivo foi simplificado para testar se o processo Node.js/Express
// consegue iniciar no servidor. Ele não se conecta ao banco de dados.

console.log('[DIAGNÓSTICO] Iniciando servidor em modo de diagnóstico...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Rota de diagnóstico (Health Check)
app.get('/api/health', (req, res) => {
  console.log('[DIAGNÓSTICO] Rota /api/health acessada com sucesso.');
  res.status(200).json({ 
    status: 'ok', 
    message: 'O servidor de diagnóstico está no ar!', 
    timestamp: new Date() 
  });
});

// Servir arquivos estáticos do frontend buildado
const frontendDistPath = path.resolve(__dirname, '..', '..', 'dist');
app.use(express.static(frontendDistPath));
console.log(`[DIAGNÓSTICO] Servindo arquivos estáticos de: ${frontendDistPath}`);

// Rota catch-all para lidar com o roteamento do React (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[DIAGNÓSTICO] Servidor de diagnóstico rodando na porta ${PORT}`);
});
