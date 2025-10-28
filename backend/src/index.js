import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import sequelize from './config/database.js';

// Import routes
import empresaRoutes from './routes/empresaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import diariaRoutes from './routes/diariaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/empresas', empresaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/diarias', diariaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API Gestão de Terceiros está rodando...');
});


const PORT = process.env.BACKEND_PORT || 3001;

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Banco de dados conectado e sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });