import './config/loadEnv.js'; // MUST BE THE VERY FIRST IMPORT

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

// Importa todas as rotas
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

// Importa os modelos para garantir que as associações sejam criadas
import './models/index.js';
import { seedAdminUser } from './models/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectWithRetry = async () => {
  const maxRetries = 5;
  const retryDelay = 5000;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await sequelize.authenticate();
      console.log('[DB] Conexão com o banco de dados estabelecida com sucesso.');
      return;
    } catch (error) {
      console.error(`[DB] Tentativa de conexão ${i} falhou. Tentando novamente em ${retryDelay / 1000}s...`);
      if (i === maxRetries) {
        throw error; // Lança o erro final para ser pego pelo startServer
      }
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
};

const startServer = async () => {
  try {
    console.log('[Server] Iniciando o servidor...');
    
    await connectWithRetry();
    
    await sequelize.sync({ alter: true });
    console.log('[DB] Modelos sincronizados com o banco de dados.');

    await seedAdminUser();

    const app = express();
    const PORT = process.env.BACKEND_PORT || 3001;

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/empresas', empresaRoutes);
    app.use('/api/clientes', clienteRoutes);
    app.use('/api/funcionarios', funcionarioRoutes);
    app.use('/api/diarias', diariaRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/relatorios', relatorioRoutes);
    
    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok', message: 'API está no ar!', timestamp: new Date() });
    });

    const frontendDistPath = path.resolve(__dirname, '..', '..', 'dist');
    app.use(express.static(frontendDistPath));
    console.log(`[Server] Servindo arquivos estáticos de: ${frontendDistPath}`);

    app.get('*', (req, res) => {
      if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      } else {
        res.status(404).json({ message: 'Endpoint não encontrado.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`[Server] Servidor rodando na porta ${PORT}.`);
    });

  } catch (error) {
    console.error('---------------------------------------------------------------');
    console.error('ERRO FATAL AO INICIAR O SERVIDOR:');
    console.error(error);
    console.error('---------------------------------------------------------------');
    process.exit(1);
  }
};

startServer();
