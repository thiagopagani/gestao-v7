import app from './app.js';
import sequelize from './config/database.js';
import { seedAdminUser } from './models/seed.js';

const PORT = process.env.BACKEND_PORT || 3001;

const startServer = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 segundos

  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`[DB] Tentativa de conexão ${i}/${maxRetries}...`);
      await sequelize.authenticate();
      console.log('[DB] Conexão com o banco de dados estabelecida com sucesso.');
      
      // Se a conexão for bem-sucedida, continua a inicialização
      console.log('[DB] Sincronizando modelos com o banco de dados...');
      await sequelize.sync({ alter: true });
      console.log('[DB] Modelos sincronizados com sucesso.');

      // Garante que o usuário admin exista
      await seedAdminUser();

      // Inicia o servidor
      app.listen(PORT, () => {
        console.log(`[Server] Servidor iniciado e rodando na porta ${PORT}`);
      });

      return; // Sai da função se tudo correu bem
    } catch (error) {
      console.error(`[DB] Tentativa de conexão ${i} falhou:`, error.name);
      if (i === maxRetries) {
        console.error('---------------------------------------------------------------');
        console.error('ERRO FATAL: Não foi possível conectar ao banco de dados após múltiplas tentativas.');
        console.error('Verifique as credenciais no arquivo .env e se o serviço de banco de dados está no ar.');
        console.error('Erro detalhado:', error);
        console.error('---------------------------------------------------------------');
        process.exit(1); // Encerra o processo se não conseguir conectar
      }
      // Espera antes de tentar novamente
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
};

startServer();
