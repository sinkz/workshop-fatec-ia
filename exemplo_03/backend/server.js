#!/usr/bin/env node

/**
 * 🌉 BACKEND PROXY MCP - Receitas
 *
 * O QUE É ESTE ARQUIVO?
 * - Backend Express que faz ponte entre Frontend (HTTP) e Neon MCP Server (stdio)
 * - Conecta ao Neon MCP Server oficial via stdin/stdout
 * - Expõe endpoints HTTP para o frontend consumir
 *
 * ARQUITETURA:
 * Frontend → HTTP → Backend (este) → stdio → Neon MCP → Neon Database
 *
 * POR QUE PROXY?
 * - Frontend (browser) não consegue usar stdio
 * - Connection string do Neon fica segura no backend (.env)
 * - Traduz HTTP (familiar) para stdio (protocolo MCP)
 */

import express from "express";
import cors from "cors";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Cliente MCP global
let mcpClient = null;

/**
 * 🔌 CONECTAR AO NEON MCP SERVER
 *
 * COMO FUNCIONA:
 * - Usa StdioClientTransport para iniciar processo filho
 * - Comando: npx -y @neondatabase/mcp-server-neon start <API_KEY>
 * - API key é passada como argumento do comando
 * - Comunicação via stdin/stdout (JSON-RPC)
 *
 * O NEON MCP SERVER:
 * - É um servidor MCP oficial mantido pelo Neon
 * - Conecta diretamente ao Neon Database
 * - Fornece tools: run_sql, create_branch, list_projects, etc
 * - Fornece resources: schema info, connection strings, etc
 *
 * Referência: https://neon.com/docs/ai/neon-mcp-server
 */
async function conectarNeonMCP() {
  console.log("🔌 Conectando ao Neon MCP Server...");

  // Validar variáveis de ambiente
  if (!process.env.NEON_API_KEY) {
    throw new Error(
      "❌ NEON_API_KEY não configurada! Configure o arquivo .env com sua API key do Neon"
    );
  }

  // Criar transporte stdio
  // Comando: npx -y @neondatabase/mcp-server-neon start <API_KEY>
  const isWindows = process.platform === "win32";

  const transport = new StdioClientTransport({
    command: isWindows ? "cmd.exe" : "npx",
    args: isWindows
      ? [
          "/c",
          "npx",
          "-y",
          "@neondatabase/mcp-server-neon",
          "start",
          process.env.NEON_API_KEY,
        ]
      : [
          "-y",
          "@neondatabase/mcp-server-neon",
          "start",
          process.env.NEON_API_KEY,
        ],
    env: {
      ...process.env,
    },
  });

  // Criar cliente MCP
  mcpClient = new Client(
    {
      name: "receitas-backend-proxy",
      version: "1.0.0",
    },
    {
      capabilities: {}, // Cliente básico
    }
  );

  // Conectar
  await mcpClient.connect(transport);
  console.log("✅ Conectado ao Neon MCP Server!");
}

/**
 * 📋 ENDPOINT: LISTAR FERRAMENTAS
 *
 * GET /tools
 * Retorna lista de ferramentas disponíveis no Neon MCP Server
 */
app.get("/tools", async (req, res) => {
  console.log("📋 GET /tools - Listando ferramentas do Neon MCP");

  try {
    if (!mcpClient) {
      return res
        .status(503)
        .json({ error: "MCP Client não conectado. Reinicie o servidor." });
    }

    const result = await mcpClient.listTools();
    console.log(`✅ ${result.tools.length} ferramentas disponíveis`);

    res.json({ tools: result.tools });
  } catch (error) {
    console.error("❌ Erro ao listar tools:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📚 ENDPOINT: LISTAR RECURSOS
 *
 * GET /resources
 * Retorna lista de recursos disponíveis no Neon MCP Server
 */
app.get("/resources", async (req, res) => {
  console.log("📚 GET /resources - Listando recursos do Neon MCP");

  try {
    if (!mcpClient) {
      return res.status(503).json({ error: "MCP Client não conectado" });
    }

    const result = await mcpClient.listResources();
    console.log(`✅ ${result.resources.length} recursos disponíveis`);

    res.json({ resources: result.resources });
  } catch (error) {
    console.error("❌ Erro ao listar resources:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔧 ENDPOINT: EXECUTAR FERRAMENTA
 *
 * POST /tools/call
 * Body: { name: string, arguments: object }
 *
 * Executa uma ferramenta do Neon MCP Server.
 * Exemplo: execute_sql para queries SQL
 */
app.post("/tools/call", async (req, res) => {
  const { name, arguments: args } = req.body;

  console.log(`🔧 POST /tools/call - Ferramenta: ${name}`);
  console.log(`   Argumentos:`, JSON.stringify(args).slice(0, 200));

  try {
    if (!mcpClient) {
      return res.status(503).json({ error: "MCP Client não conectado" });
    }

    const result = await mcpClient.callTool({
      name: name,
      arguments: args,
    });

    console.log(`✅ Ferramenta ${name} executada com sucesso`);

    res.json({ result: result.content });
  } catch (error) {
    console.error(`❌ Erro ao executar ${name}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🏥 ENDPOINT: HEALTH CHECK
 *
 * GET /health
 * Verifica se o backend está rodando e conectado ao Neon MCP
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    neonMCP: mcpClient ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🚀 INICIAR SERVIDOR
 *
 * 1. Conecta ao Neon MCP Server (stdio)
 * 2. Inicia servidor HTTP Express
 */
async function iniciar() {
  try {
    // Conectar ao Neon MCP primeiro
    await conectarNeonMCP();

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log("");
      console.log("╔═══════════════════════════════════════╗");
      console.log("║  🌉 Backend Proxy MCP Iniciado       ║");
      console.log("╚═══════════════════════════════════════╝");
      console.log("");
      console.log(`Porta: ${PORT}`);
      console.log("Endpoints:");
      console.log("  GET  http://localhost:3001/tools");
      console.log("  GET  http://localhost:3001/resources");
      console.log("  POST http://localhost:3001/tools/call");
      console.log("  GET  http://localhost:3001/health");
      console.log("");
      console.log("🔗 Conectado ao Neon MCP Server via stdio");
      console.log("🗄️  Database: Neon PostgreSQL (cloud)");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("❌ ERRO AO INICIAR BACKEND:");
    console.error(error.message);
    console.error("");
    console.error("💡 VERIFIQUE:");
    console.error("   1. Arquivo .env existe e está configurado?");
    console.error("   2. NEON_API_KEY está correto?");
    console.error("   3. Node.js >= v18.0.0 está instalado?");
    console.error("");
    console.error("📚 Documentação: https://neon.com/docs/ai/neon-mcp-server");
    console.error("");
    process.exit(1);
  }
}

// Iniciar
iniciar();
