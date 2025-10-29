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
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
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

// Função de utilidade para criar um atraso (delay)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Função de inicialização robusta com retry para o banco de dados
const startServer = async () => {
    const maxRetries = 6;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sequelize.authenticate();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');

            await sequelize.sync(); 
            console.log('Banco de dados sincronizado.');

            await seedAdminUser();

            app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });
            
            return; // Sai da função se tudo ocorreu bem
        } catch (error) {
            console.error(`Falha ao conectar ou sincronizar o banco de dados (tentativa ${attempt}/${maxRetries}):`, error.message);
            if (attempt < maxRetries) {
                console.log('Tentando novamente em 5 segundos...');
                await delay(5000);
            } else {
                console.error('Número máximo de tentativas de conexão com o banco de dados excedido. A API não será iniciada.');
            }
        }
    }
};

startServer();