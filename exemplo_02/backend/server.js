/**
 * 🚀 SERVIDOR EXPRESS - ESQUELETO PARA O WORKSHOP
 *
 * 👨‍🏫 CONSTRUIR COM OS ALUNOS
 *
 * Endpoints a implementar:
 * - GET /produtos - Lista todos os produtos
 * - POST /produtos - Cria um novo produto
 *
 * 💡 DICA: Veja o arquivo cola/server.js para a versão completa
 */

const express = require("express");
const cors = require("cors");
const mock = require("./produtos-mock");

const app = express();
const PORT = 3001;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// ========== ENDPOINT 1: LISTAR PRODUTOS ==========
// 👨‍🏫 IMPLEMENTAR COM OS ALUNOS
// TODO: GET /produtos - Retorna mock.produtos


// ========== ENDPOINT 2: CRIAR PRODUTO ==========
// 👨‍🏫 IMPLEMENTAR COM OS ALUNOS
// TODO: POST /produtos - Cria novo produto
// Validar: nome, preco, categoria
// Gerar ID: mock.proximoId++
// Adicionar ao array: mock.produtos.push(...)


// ========== HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    produtos: mock.produtos.length,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Backend rodando na porta", PORT);
  console.log("📦 Mock inicializado com", mock.produtos.length, "produtos");
  console.log("");
  console.log("Endpoints disponíveis:");
  console.log("  GET  http://localhost:3001/produtos");
  console.log("  POST http://localhost:3001/produtos");
  console.log("");
});
