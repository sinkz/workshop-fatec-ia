/**
 * 🚀 SERVIDOR EXPRESS
 *
 * Apenas 2 endpoints:
 * - GET /produtos - Lista todos os produtos
 * - POST /produtos - Cria um novo produto
 *
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

// ========== ENDPOINT 2: CRIAR PRODUTO ==========

// ========== HEALTH CHECK ==========

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
