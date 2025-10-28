import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importar modelos para garantir que sejam registrados no Sequelize
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
const PORT = process.env.BACKEND_PORT || 3001;

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

// Função de inicialização com retry para o banco de dados
const startServer = async () => {
    const maxRetries = 6;
    let currentRetry = 1;

    const connectWithRetry = async () => {
        try {
            // Apenas autentica a conexão. É a prática mais segura para produção.
            await sequelize.authenticate();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');

            // Sincroniza o banco de dados, mas de forma segura, sem alterar ou forçar.
            // Isso garante que as tabelas sejam criadas se não existirem, mas não mexe nelas depois.
            await sequelize.sync(); 
            console.log('Banco de dados sincronizado.');


            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });

        } catch (error) {
            console.error(`Falha ao conectar ou sincronizar o banco de dados (tentativa ${currentRetry}):`, error.message);
            if (currentRetry < maxRetries) {
                currentRetry++;
                console.log(`Tentando novamente em 5 segundos...`);
                setTimeout(connectWithRetry, 5000);
            } else {
                console.error('Número máximo de tentativas de conexão com o banco de dados excedido. A API não será iniciada.');
            }
        }
    };

    await connectWithRetry();
};

startServer();
