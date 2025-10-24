/**
 * 🚀 SERVIDOR EXPRESS COMPLETO - VERSÃO COLA
 *
 * API REST completa com CRUD:
 * - GET /produtos - Lista todos os produtos
 * - GET /produtos/:id - Busca produto por ID
 * - POST /produtos - Cria um novo produto
 * - PUT /produtos/:id - Edita produto existente
 * - DELETE /produtos/:id - Exclui produto
 *
 * 👨‍🏫 ARQUIVO COMPLETO PARA OS ALUNOS COPIAREM
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

// ========== ENDPOINT 3: BUSCAR PRODUTO POR ID ==========
app.get("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  console.log(`🔍 GET /produtos/${id} - Buscando produto`);

  // Buscar produto no array
  const produto = mock.produtos.find((p) => p.id === id);

  // Verificar se produto existe
  if (!produto) {
    console.log(`❌ Produto ${id} não encontrado`);
    return res.status(404).json({
      erro: `Produto com ID ${id} não encontrado`,
    });
  }

  console.log(`✅ Produto ${id} encontrado:`, produto);
  res.json(produto);
});

// ========== ENDPOINT 4: EDITAR PRODUTO ==========
app.put("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, categoria } = req.body;

  console.log(`📝 PUT /produtos/${id} - Editando produto`);

  // Buscar índice do produto no array
  const index = mock.produtos.findIndex((p) => p.id === id);

  // Verificar se produto existe
  if (index === -1) {
    console.log(`❌ Produto ${id} não encontrado`);
    return res.status(404).json({
      erro: `Produto com ID ${id} não encontrado`,
    });
  }

  // Atualizar apenas os campos fornecidos (merge)
  // Se campo não vier no body, mantém o valor atual
  const produtoAtualizado = {
    ...mock.produtos[index], // Mantém dados atuais
    ...(nome && { nome }), // Atualiza nome se fornecido
    ...(preco && { preco: parseFloat(preco) }), // Atualiza preço se fornecido
    ...(categoria && { categoria }), // Atualiza categoria se fornecida
  };

  // Substituir produto no array
  mock.produtos[index] = produtoAtualizado;

  console.log(`✅ Produto ${id} atualizado:`, produtoAtualizado);
  res.json(produtoAtualizado);
});

// ========== ENDPOINT 5: EXCLUIR PRODUTO ==========
app.delete("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  console.log(`🗑️  DELETE /produtos/${id} - Excluindo produto`);

  // Buscar índice do produto no array
  const index = mock.produtos.findIndex((p) => p.id === id);

  // Verificar se produto existe
  if (index === -1) {
    console.log(`❌ Produto ${id} não encontrado`);
    return res.status(404).json({
      erro: `Produto com ID ${id} não encontrado`,
    });
  }

  // Guardar dados do produto antes de remover (para log)
  const produtoRemovido = mock.produtos[index];

  // Remover produto do array
  mock.produtos.splice(index, 1);

  console.log(`✅ Produto ${id} removido:`, produtoRemovido);

  // Retornar sucesso com dados do produto removido
  res.json({
    mensagem: "Produto removido com sucesso",
    produto: produtoRemovido,
  });
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
  console.log("  GET  http://localhost:3001/produtos/:id");
  console.log("  POST http://localhost:3001/produtos");
  console.log("  PUT  http://localhost:3001/produtos/:id");
  console.log("  DELETE http://localhost:3001/produtos/:id");
  console.log("");
});
