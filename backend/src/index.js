import './config/loadEnv.js'; // Garante que as variáveis de ambiente sejam carregadas primeiro
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import { logInfo, logError } from './utils/logger.js';

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

/**
 * Tenta conectar ao banco de dados com múltiplas tentativas.
 * Isso torna a aplicação mais resiliente a reinicializações onde o BD pode demorar a ficar online.
 */
const connectWithRetry = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 segundos
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await sequelize.authenticate();
      logInfo('Conexão com o banco de dados estabelecida com sucesso.');
      return; // Sucesso, sai da função
    } catch (error) {
      logError(`Tentativa de conexão ${i} falhou. Tentando novamente em ${retryDelay / 1000}s...`, error);
      if (i === maxRetries) {
        logError('Não foi possível conectar ao banco de dados após várias tentativas. Encerrando.', error);
        process.exit(1); // Encerra o processo se não conseguir conectar
      }
      // Espera antes de tentar novamente
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
};

/**
 * Função principal para iniciar o servidor.
 */
const startServer = async () => {
  try {
    // 1. Conectar e sincronizar o banco de dados
    await connectWithRetry();
    await sequelize.sync({ alter: true });
    logInfo('Modelos sincronizados com o banco de dados.');

    // 2. Criar usuário administrador padrão, se necessário
    await seedAdminUser();

    // 3. Configurar o servidor Express
    const app = express();
    const PORT = process.env.BACKEND_PORT || 3001;

    // Middlewares de segurança e parse
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Configuração das rotas da API
    app.use('/api/empresas', empresaRoutes);
    app.use('/api/clientes', clienteRoutes);
    app.use('/api/funcionarios', funcionarioRoutes);
    app.use('/api/diarias', diariaRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/relatorios', relatorioRoutes);
    
    // Rota de diagnóstico (Health Check)
    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok', message: 'API está no ar!', timestamp: new Date() });
    });

    // Servir arquivos estáticos do frontend
    const frontendDistPath = path.resolve(__dirname, '..', '..', 'dist');
    app.use(express.static(frontendDistPath));
    logInfo(`Servindo arquivos estáticos de: ${frontendDistPath}`);

    // Rota catch-all para servir o index.html para o roteamento do React
    app.get('*', (req, res) => {
      // Se a requisição não for para a API, serve o frontend
      if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      } else {
        // Se for uma rota de API não encontrada, retorna 404
        res.status(404).json({ message: 'Endpoint não encontrado.' });
      }
    });

    // 4. Iniciar o servidor
    app.listen(PORT, () => {
      logInfo(`Servidor rodando na porta ${PORT}`);
      console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
    });

  } catch (error) {
    logError('Erro fatal ao iniciar o servidor.', error);
    process.exit(1);
  }
};

// Inicia a aplicação
startServer();
