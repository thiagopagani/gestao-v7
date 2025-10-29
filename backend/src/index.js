// 1. Carrega as variáveis de ambiente ANTES de qualquer outra coisa.
import './config/env.js';

import app from './app.js';
import sequelize from './config/database.js';
import { seedAdminUser } from './models/seed.js';
import './models/index.js'; // Importa para registrar as associações dos modelos

const PORT = process.env.BACKEND_PORT || 3001;

const startServer = async () => {
  try {
    // 2. Tenta conectar ao banco de dados
    console.log('Tentando conectar ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // 3. Sincroniza o banco de dados (reseta e recria as tabelas)
    console.log('Sincronizando o banco de dados (force: true)...');
    // ATENÇÃO: `force: true` apaga todas as tabelas e as recria.
    // Isso é útil para garantir um estado limpo durante a correção.
    // Após o sucesso, isso pode ser alterado para `{ alter: true }` para evitar perda de dados.
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso.');

    // 4. Cria o usuário administrador padrão, se necessário
    await seedAdminUser();

    // 5. Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Frontend servido a partir de: ${app.get('distPath')}`);
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
