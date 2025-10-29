import bcrypt from 'bcryptjs';
import User from './User.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Verifica se um usuário administrador padrão existe e, se não, o cria.
 * Isso garante que sempre haja um ponto de entrada no sistema.
 */
export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@gestao.com' } });

    if (!adminExists) {
      logInfo('Usuário administrador padrão não encontrado. Criando...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        nome: 'Administrador Padrão',
        email: 'admin@gestao.com',
        password: hashedPassword,
        papel: 'Admin',
        status: 'Ativo',
      });
      logInfo('Usuário administrador padrão criado com sucesso.');
    } else {
      logInfo('Usuário administrador padrão já existe.');
    }
  } catch (error) {
    logError('Erro ao tentar criar o usuário administrador padrão.', error);
    // Não encerra o processo, pois a aplicação pode funcionar sem o seed.
    // A falha será registrada no log para depuração.
  }
};
