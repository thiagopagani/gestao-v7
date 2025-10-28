import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importar todos os modelos para garantir que o Sequelize os conheça
import './models/index.js';

// Importar rotas
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/relatorios', relatorioRoutes);

const PORT = process.env.BACKEND_PORT || 3001;
const MAX_RETRIES = 6;
const RETRY_DELAY = 5000; // 5 segundos

const connectWithRetry = async (retries = MAX_RETRIES) => {
  try {
    // Testa a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincroniza os modelos com o banco de dados
    // { alter: true } ajusta as tabelas para corresponder ao modelo, sem apagar dados.
    await sequelize.sync({ alter: true });
    console.log('Banco de dados conectado e sincronizado.');

    // Inicia o servidor apenas após a conexão e sincronização bem-sucedidas
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error(`Falha ao sincronizar o banco de dados (tentativa ${MAX_RETRIES - retries + 1}):`, error.message);
    if (retries > 1) {
      console.log(`Tentando novamente em ${RETRY_DELAY / 1000} segundos...`);
      setTimeout(() => connectWithRetry(retries - 1), RETRY_DELAY);
    } else {
      console.error('Número máximo de tentativas de conexão com o banco de dados excedido. A API não será iniciada.');
    }
  }
};

// Inicia o processo de conexão
connectWithRetry();
