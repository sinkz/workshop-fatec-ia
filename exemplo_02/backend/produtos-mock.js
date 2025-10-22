/**
 * 📦 MOCK DE PRODUTOS - ARRAY EM MEMÓRIA
 *
 * IMPORTANTE: Os dados NÃO são salvos em arquivo!
 * Ao reiniciar o servidor, volta para este estado inicial.
 *

 */

let produtos = [];

// Contador para gerar IDs únicos
let proximoId = 0;

// Exportar para usar no server.js
module.exports = {
  produtos,
  proximoId,
};
