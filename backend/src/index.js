import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import sequelize from './config/database.js';

// Importar modelos para garantir que sejam registrados no Sequelize
import { User } from './models/index.js';

// Importar rotas
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Servir arquivos estáticos do frontend buildado
const frontendDistPath = path.resolve(__dirname, '..', '..', 'dist');
app.use(express.static(frontendDistPath));

// Rota catch-all para lidar com o roteamento do React (SPA)
// Qualquer requisição GET que não seja para a API e não seja um arquivo estático,
// será direcionada para o index.html, permitindo que o React Router funcione.
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
        // Se for uma rota de API não encontrada, retorna 404
        res.status(404).json({ message: 'Endpoint não encontrado.' });
    }
});

// Função para criar o usuário admin padrão se não existir
const seedAdminUser = async () => {
    try {
      const adminEmail = 'admin@gestao.com';
      const adminExists = await User.findOne({ where: { email: adminEmail } });
  
      if (!adminExists) {
        console.log('Criando usuário administrador padrão...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          nome: 'Administrador',
          email: adminEmail,
          password: hashedPassword,
          papel: 'Admin',
          status: 'Ativo',
        });
        console.log('Usuário administrador padrão criado com sucesso. Email: admin@gestao.com | Senha: admin123');
      }
    } catch (error) {
      console.error('Falha ao criar usuário administrador padrão:', error);
    }
};

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

            // Cria o usuário admin padrão após a sincronização
            await seedAdminUser();

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