import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importa todas as rotas da aplicação
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa a aplicação Express
const app = express();

// Middlewares essenciais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Define as rotas da API
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/relatorios', relatorioRoutes);

const PORT = process.env.BACKEND_PORT || 3001;
const MAX_RETRIES = 6;
const RETRY_DELAY = 5000; // 5 segundos

// Função para conectar ao banco de dados com tentativas de reconexão
const connectWithRetry = async (retries = 0) => {
  try {
    // Apenas autentica a conexão para ser mais rápido e seguro em produção
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincroniza os modelos com o banco de dados.
    // { alter: true } ajusta as tabelas sem apagar os dados.
    await sequelize.sync({ alter: true });
    console.log('Banco de dados conectado e sincronizado.');

    // Inicia o servidor apenas após a conexão bem-sucedida
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error(`Falha ao conectar ou sincronizar o banco de dados (tentativa ${retries + 1}):`, error.message);
    if (retries < MAX_RETRIES) {
      console.log(`Tentando novamente em ${RETRY_DELAY / 1000} segundos...`);
      setTimeout(() => connectWithRetry(retries + 1), RETRY_DELAY);
    } else {
      console.error('Número máximo de tentativas de conexão com o banco de dados excedido. A API não será iniciada.');
    }
  }
};

// Inicia o processo de conexão
connectWithRetry();
