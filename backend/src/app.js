import './config/env.js'; // Garante que as variáveis de ambiente sejam carregadas primeiro
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

// Middlewares de segurança e parse
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuração para servir os arquivos estáticos do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '..', '..', 'dist');

app.use(express.static(frontendDistPath));


// Define as rotas da API
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota de verificação de "saúde" da API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Rota "catch-all" para servir o index.html do frontend para qualquer rota que não seja da API
app.get('*', (req, res) => {
  // Se a requisição não for para a API, serve o frontend
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  } else {
    // Se for uma rota de API não encontrada, retorna 404
    res.status(404).json({ message: 'Endpoint não encontrado.' });
  }
});


export default app;
