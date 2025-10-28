import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importar todos os modelos para garantir que sejam registrados no Sequelize
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

// --- Lógica de Conexão Robusta ---
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 segundos

const connectWithRetry = (retries = MAX_RETRIES) => {
  sequelize.sync({ alter: true }) // Usa alter: true para fazer alterações não destrutivas
    .then(() => {
      console.log('Banco de dados conectado e sincronizado.');
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(`Falha ao sincronizar o banco de dados (tentativa ${MAX_RETRIES - retries + 1}):`, error.message);
      if (retries > 0) {
        console.log(`Tentando novamente em ${RETRY_DELAY / 1000} segundos...`);
        setTimeout(() => connectWithRetry(retries - 1), RETRY_DELAY);
      } else {
        console.error('Número máximo de tentativas de conexão com o banco de dados excedido. A API não será iniciada.');
        process.exit(1); // Encerra o processo se não conseguir conectar
      }
    });
};

// Iniciar o processo de conexão
connectWithRetry();
