/**
 * 📦 MOCK DE PRODUTOS - ARRAY EM MEMÓRIA
 *
 * IMPORTANTE: Os dados NÃO são salvos em arquivo!
 * Ao reiniciar o servidor, volta para este estado inicial.
 *
 * 👨‍🏫 EDITAR COM OS ALUNOS NO PROJETOR
 */

let produtos = [
  {
    id: 1,
    nome: "Notebook Dell",
    preco: 3000,
    categoria: "Informática",
  },
  {
    id: 2,
    nome: "Mouse Logitech",
    preco: 50,
    categoria: "Periféricos",
  },
  {
    id: 3,
    nome: "Teclado Mecânico",
    preco: 150,
    categoria: "Periféricos",
  },
  {
    id: 4,
    nome: "Teclado Mecânico Razer",
    preco: 450,
    categoria: "Periféricos",
  },
];

// Contador para gerar IDs únicos
let proximoId = 4;

// Exportar para usar no server.js
module.exports = {
  produtos,
  proximoId,
};
