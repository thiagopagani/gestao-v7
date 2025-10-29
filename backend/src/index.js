// PONTO DE ENTRADA DA APLICAÇÃO - O MAIS SIMPLES POSSÍVEL

// 1. Garante que o ambiente (credenciais, etc.) seja carregado ANTES de qualquer outra coisa.
import './config/env.js';

// 2. Só depois que o ambiente está carregado, importa e inicia o resto da aplicação.
// O uso de import() dinâmico garante a ordem de execução.
import('./server.js').catch(err => {
  console.error('Falha crítica ao carregar o módulo do servidor:', err);
  process.exit(1);
});
