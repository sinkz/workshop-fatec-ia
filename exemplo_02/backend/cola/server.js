/**
 * 🚀 SERVIDOR EXPRESS ULTRA-SIMPLES
 *
 * Apenas 2 endpoints:
 * - GET /produtos - Lista todos os produtos
 * - POST /produtos - Cria um novo produto
 *
 * 👨‍🏫 CONSTRUIR COM OS ALUNOS
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
app.get("/produtos", (req, res) => {
  console.log("📦 GET /produtos - Listando", mock.produtos.length, "produtos");
  res.json(mock.produtos);
});

// ========== ENDPOINT 2: CRIAR PRODUTO ==========
app.post("/produtos", (req, res) => {
  const { nome, preco, categoria } = req.body;

  // Validação simples
  if (!nome || !preco || !categoria) {
    return res.status(400).json({
      erro: "Campos obrigatórios: nome, preco, categoria",
    });
  }

  // Criar novo produto
  const novoProduto = {
    id: mock.proximoId++,
    nome,
    preco: parseFloat(preco),
    categoria,
  };

  // Adicionar ao array
  mock.produtos.push(novoProduto);

  console.log("✅ POST /produtos - Produto criado:", novoProduto);
  res.status(201).json(novoProduto);
});

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
