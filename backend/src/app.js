import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa as rotas
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(helmet());
app.use(express.json());

// Configuração para servir os arquivos estáticos do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '..', '..', 'dist');

console.log(`[STATIC] Servindo arquivos estáticos de: ${frontendDistPath}`);
app.use(express.static(frontendDistPath));

// Rotas da API
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota de verificação de "saúde"
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Rota "catch-all" para o frontend (deve vir depois das rotas da API)
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  } else {
    // Se for uma rota de API não encontrada, retorna 404
    res.status(404).json({ message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}` });
  }
});

export default app;
