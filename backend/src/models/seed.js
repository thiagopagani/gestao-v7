import bcrypt from 'bcryptjs';
import User from './User.js';

export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@gestao.com' } });

    if (!adminExists) {
      console.log('[Seed] Criando usuário administrador padrão...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        nome: 'Administrador Padrão',
        email: 'admin@gestao.com',
        password: hashedPassword,
        papel: 'Admin',
        status: 'Ativo',
      });
      console.log('[Seed] Usuário administrador padrão criado com sucesso.');
    }
  } catch (error) {
    console.error('[Seed] Falha ao criar usuário administrador:', error);
  }
};
