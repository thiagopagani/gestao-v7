// O VERDADEIRO "MAESTRO" DA INICIALIZAÇÃO

import app from './app.js';
import sequelize from './config/database.js';
import { seedAdminUser } from './models/seed.js';
import './models/index.js'; // Importa para registrar as associações dos modelos

const PORT = process.env.BACKEND_PORT || 3001;

const startServer = async () => {
  try {
    console.log('[SERVER] Iniciando o servidor...');
    
    // 1. Tenta conectar ao banco de dados
    console.log('[DB] Tentando conectar ao banco de dados...');
    await sequelize.authenticate();
    console.log('[DB] Conexão com o banco de dados estabelecida com sucesso.');

    // 2. Sincroniza o banco de dados (reseta e recria as tabelas)
    console.log('[DB] Sincronizando o banco de dados (force: true)...');
    // ATENÇÃO: `force: true` apaga todas as tabelas e as recria.
    // Isso garante um estado limpo para resolver o problema de uma vez por todas.
    await sequelize.sync({ force: true });
    console.log('[DB] Banco de dados sincronizado com sucesso.');

    // 3. Cria o usuário administrador padrão, se necessário
    await seedAdminUser();

    // 4. Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`[SERVER] Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('*** FALHA FATAL AO INICIAR O SERVIDOR ***');
    console.error('----------------------------------------------------');
    console.error('Ocorreu um erro durante a inicialização:');
    console.error(error); // Loga o erro completo
    console.error('----------------------------------------------------');
    console.error('Verifique as credenciais do banco de dados no arquivo .env e a disponibilidade do serviço de banco de dados.');
    console.error('----------------------------------------------------');
    process.exit(1); // Encerra o processo com código de erro
  }
};

startServer();
