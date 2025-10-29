import bcrypt from 'bcryptjs';
import User from './User.js';

export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@gestao.com' } });

    if (!adminExists) {
      console.log('[SEED] Usuário administrador não encontrado, criando...');
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
      console.log('[SEED] Usuário administrador já existe.');
    }
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('*** ERRO AO CRIAR O USUÁRIO ADMINISTRADOR (SEED) ***');
    console.error(error);
    console.error('----------------------------------------------------');
    // Não encerra o processo, mas deixa um log claro do erro.
  }
};
