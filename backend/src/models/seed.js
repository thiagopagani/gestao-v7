import bcrypt from 'bcryptjs';
import User from './User.js';

export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@gestao.com' } });

    if (!adminExists) {
      console.log('[SEED] Criando usuário administrador padrão...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        nome: 'Administrador',
        email: 'admin@gestao.com',
        password: hashedPassword,
        papel: 'Admin',
        status: 'Ativo',
      });
      console.log('[SEED] Usuário administrador criado com sucesso.');
    } else {
      console.log('[SEED] Usuário administrador já existente.');
    }
  } catch (error) {
    console.error('[SEED] ERRO ao criar usuário administrador:', error);
    // Lança o erro para interromper a inicialização, pois este é um passo crítico
    throw error;
  }
};
