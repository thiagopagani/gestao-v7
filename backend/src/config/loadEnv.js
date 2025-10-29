import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Este arquivo deve ter o mínimo de dependências possível.

try {
    // Constrói o caminho de forma robusta, partindo do local deste arquivo
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const envPath = path.resolve(__dirname, '..', '..', '.env');

    if (!fs.existsSync(envPath)) {
        throw new Error(`Arquivo de configuração .env não encontrado no caminho: ${envPath}`);
    }

    dotenv.config({ path: envPath });

    const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'BACKEND_PORT'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente ausentes no arquivo .env: ${missingVars.join(', ')}`);
    }

    console.log('[loadEnv] Variáveis de ambiente carregadas com sucesso.');

} catch (error) {
    console.error('---------------------------------------------------------------');
    console.error('ERRO FATAL AO CARREGAR CONFIGURAÇÕES DE AMBIENTE:');
    console.error(error.message);
    console.error('---------------------------------------------------------------');
    process.exit(1);
}
