#!/usr/bin/env node

/**
 * 🤖 SERVIDOR MCP ULTRA-SIMPLES
 *
 * O QUE É ESTE ARQUIVO?
 * - Servidor que implementa o protocolo MCP (Model Context Protocol)
 * - Expõe ferramentas (tools) e recursos (resources) para IAs
 * - Usa comunicação stdio (stdin/stdout) com o cliente
 *
 * FERRAMENTAS vs RECURSOS:
 * - TOOLS (Ferramentas): Executam AÇÕES (criar, atualizar, deletar)
 * - RESOURCES (Recursos): Fornecem INFORMAÇÕES (docs, dados estáticos)
 *
 * POR QUE MCP?
 * - Padrão aberto para conectar IAs com sistemas
 * - Permite IAs acessarem dados reais sem alucinação
 * - Desenvolvido por Anthropic (criadores do Claude)
 * - Funciona com qualquer IA (Claude, GPT, Groq, etc)
 */

/**
 * 📦 IMPORTAÇÕES
 *
 * @modelcontextprotocol/sdk - SDK oficial do MCP
 *   - Server: Classe principal do servidor MCP
 *   - StdioServerTransport: Comunicação via stdin/stdout
 *   - *RequestSchema: Validação de requisições MCP
 *
 * axios - Cliente HTTP para chamar nosso backend Express
 * config - Definições das ferramentas e recursos (editável)
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema, // Schema para executar ferramenta
  ListToolsRequestSchema, // Schema para listar ferramentas
  ListResourcesRequestSchema, // Schema para listar recursos
  ReadResourceRequestSchema, // Schema para ler recurso
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import config from "./config.js";
import express from "express";
import cors from "cors";

/**
 * 🏗️ CRIAR SERVIDOR MCP
 *
 * Server() inicializa o servidor MCP com metadados.
 * - name: Identificador único do servidor
 * - version: Versão do servidor (útil para debugging)
 *
 * Este objeto vai registrar handlers (manipuladores) para:
 * - ListTools: Listar ferramentas disponíveis
 * - CallTool: Executar uma ferramenta
 * - ListResources: Listar recursos disponíveis
 * - ReadResource: Ler um recurso específico
 */
const server = new Server({
  name: "mcp-produtos-simples",
  version: "1.0.0",
});

// ========== HANDLER: LISTAR FERRAMENTAS ==========
/**
 * 📋 LISTAR FERRAMENTAS DISPONÍVEIS
 *
 * QUANDO É CHAMADO?
 * - Quando o cliente (IA) quer saber quais ferramentas existem
 * - Normalmente na inicialização da conexão
 *
 * O QUE RETORNA?
 * - Array de ferramentas com: name, description, inputSchema
 * - Cliente usa isso para decidir qual ferramenta chamar
 *
 * POR QUE async?
 * - Todas as handlers MCP devem ser assíncronas
 * - Mesmo que não façam operações assíncronas
 *
 * POR QUE console.error?
 * - stdout é usado para comunicação MCP (formato JSON)
 * - stderr é usado para logs (não interfere no protocolo)
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("📋 Listando ferramentas disponíveis");
  return {
    tools: config.ferramentas, // Vem do config.js
  };
});

// ========== HANDLER: EXECUTAR FERRAMENTA ==========
/**
 * 🔧 EXECUTAR UMA FERRAMENTA
 *
 * QUANDO É CHAMADO?
 * - Quando o cliente (IA) decide EXECUTAR uma ferramenta
 * - Após analisar a mensagem do usuário
 *
 * O QUE RECEBE?
 * - request.params.name: Nome da ferramenta a executar
 * - request.params.arguments: Argumentos para a ferramenta (objeto)
 *
 * O QUE RETORNA?
 * - content: Array de conteúdos (text, image, resource)
 * - Formato MCP padronizado para qualquer tipo de resposta
 *
 * POR QUE AXIOS?
 * - MCP Server NÃO tem os dados, apenas ORQUESTRA
 * - Backend Express tem os dados reais (mock)
 * - Separação de responsabilidades: MCP ↔ Backend ↔ Dados
 *
 * FLUXO:
 * 1. Cliente MCP pede: "execute criar_produto com {nome, preco, categoria}"
 * 2. MCP Server recebe e valida
 * 3. MCP faz POST no backend Express
 * 4. Backend cria produto e retorna
 * 5. MCP formata resposta no padrão MCP
 * 6. Cliente recebe dados reais
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  console.error(`🔧 Executando ferramenta: ${name}`);
  console.error(`   Argumentos:`, JSON.stringify(args));

  try {
    // ===== FERRAMENTA 1: LISTAR PRODUTOS =====
    /**
     * GET /produtos do backend
     * Sem argumentos, retorna todos os produtos
     */
    if (name === "listar_produtos") {
      const response = await axios.get(`${config.backendUrl}/produtos`);

      // Formato MCP: content é um ARRAY de objetos
      return {
        content: [
          {
            type: "text", // Tipo do conteúdo (text, image, resource)
            text: JSON.stringify(response.data, null, 2), // Dados formatados
          },
        ],
      };
    }

    // ===== FERRAMENTA 2: CRIAR PRODUTO =====
    /**
     * POST /produtos do backend
     * Recebe argumentos: {nome, preco, categoria}
     * Retorna o produto criado com ID
     */
    if (name === "criar_produto") {
      const response = await axios.post(`${config.backendUrl}/produtos`, args);

      console.error(`✅ Produto criado com sucesso: ID ${response.data.id}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    }

    // ===== FERRAMENTA NÃO ENCONTRADA =====
    throw new Error(`Ferramenta "${name}" não existe`);
  } catch (error) {
    console.error(`❌ Erro na ferramenta ${name}:`, error.message);

    // Retornar erro no formato MCP
    return {
      content: [
        {
          type: "text",
          text: `Erro: ${error.message}`,
        },
      ],
      isError: true, // Flag MCP indicando erro
    };
  }
});

// ========== HANDLER: LISTAR RECURSOS ==========
/**
 * 📚 LISTAR RECURSOS DISPONÍVEIS
 *
 * O QUE SÃO RECURSOS?
 * - Dados ESTÁTICOS que a IA pode CONSULTAR (não executar)
 * - Exemplos: documentação, manuais, arquivos de configuração
 * - Diferente de ferramentas (que executam ações)
 *
 * QUANDO USAR RESOURCES vs TOOLS?
 * - RESOURCE: "Qual a política de devolução?" → Consulta doc
 * - TOOL: "Crie uma devolução para pedido #123" → Executa ação
 *
 * FORMATO MCP:
 * - uri: Identificador único (ex: "produtos://docs/guia")
 * - name: Nome amigável
 * - description: Quando a IA deve usar este recurso
 * - mimeType: Tipo do conteúdo (text/plain, application/json)
 *
 * POR QUE .map()?
 * - config.recursos tem campos em português (nome, descricao)
 * - Mapeamos para o formato MCP padrão em inglês
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  console.error("📚 Listando recursos disponíveis");
  return {
    resources: config.recursos.map((r) => ({
      uri: r.uri, // URI único do recurso
      name: r.nome, // Nome do recurso
      description: r.descricao, // Descrição para a IA
      mimeType: r.tipoMime, // Tipo MIME do conteúdo
    })),
  };
});

// ========== HANDLER: LER RECURSO ==========
/**
 * 📖 LER O CONTEÚDO DE UM RECURSO
 *
 * QUANDO É CHAMADO?
 * - Quando a IA decide que precisa CONSULTAR um recurso
 * - IA viu na lista de recursos e escolheu um pela URI
 *
 * O QUE RECEBE?
 * - request.params.uri: URI do recurso a ler (ex: "produtos://docs/guia")
 *
 * O QUE RETORNA?
 * - contents: Array com o conteúdo do recurso
 * - Pode retornar múltiplos conteúdos (chunks)
 *
 * DIFERENÇA contents vs content:
 * - Tool retorna "content" (singular)
 * - Resource retorna "contents" (plural)
 * - Padrão do protocolo MCP
 *
 * USO PRÁTICO:
 * IA: "Como funciona o sistema de produtos?"
 * → Lista recursos → Acha "produtos://docs/guia"
 * → Lê recurso → Recebe documentação
 * → Responde usuário com base na doc real
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  console.error(`📖 Lendo recurso: ${uri}`);

  // Buscar recurso na configuração
  const recurso = config.recursos.find((r) => r.uri === uri);

  if (!recurso) {
    throw new Error(`Recurso "${uri}" não encontrado`);
  }

  console.error(`✅ Recurso encontrado: ${recurso.nome}`);

  // Retornar conteúdo no formato MCP
  return {
    contents: [
      // ← Plural! (pode ter múltiplos chunks)
      {
        uri: recurso.uri,
        mimeType: recurso.tipoMime,
        text: recurso.conteudo, // Conteúdo do recurso
      },
    ],
  };
});

/**
 * 🌐 SERVIDOR HTTP (INTEGRAÇÃO COM FRONTEND)
 *
 * POR QUE HTTP ALÉM DE STDIO?
 * - Frontend (browser) não consegue usar stdin/stdout
 * - HTTP torna o MCP acessível para aplicações web
 * - Mantém stdio para compatibilidade (mcp-client-demo)
 *
 * ENDPOINTS:
 * - GET /tools - Lista ferramentas disponíveis
 * - GET /resources - Lista recursos disponíveis
 * - POST /tools/call - Executa uma ferramenta
 *
 * FLUXO:
 * Frontend → HTTP (3003) → MCP Server → HTTP (3001) → Backend Express
 */
const httpApp = express();
httpApp.use(cors());
httpApp.use(express.json());

// ========== ENDPOINT: LISTAR FERRAMENTAS ==========
httpApp.get("/tools", async (req, res) => {
  console.error("📋 HTTP GET /tools - Listando ferramentas");
  res.json({ tools: config.ferramentas });
});

// ========== ENDPOINT: LISTAR RECURSOS ==========
httpApp.get("/resources", async (req, res) => {
  console.error("📚 HTTP GET /resources - Listando recursos");
  res.json({
    resources: config.recursos.map((r) => ({
      uri: r.uri,
      name: r.nome,
      description: r.descricao,
      mimeType: r.tipoMime,
    })),
  });
});

// ========== ENDPOINT: EXECUTAR FERRAMENTA ==========
httpApp.post("/tools/call", async (req, res) => {
  const { name, arguments: args } = req.body;

  console.error(`🔧 HTTP POST /tools/call - Ferramenta: ${name}`);
  console.error(`   Argumentos:`, JSON.stringify(args));

  try {
    let result;

    // Executar ferramenta apropriada
    if (name === "listar_produtos") {
      const response = await axios.get(`${config.backendUrl}/produtos`);
      result = response.data;
      console.error(
        `✅ Ferramenta ${name} executada: ${result.length} produtos`
      );
    } else if (name === "criar_produto") {
      const response = await axios.post(`${config.backendUrl}/produtos`, args);
      result = response.data;
      console.error(`✅ Ferramenta ${name} executada: produto ID ${result.id}`);
    } else {
      console.error(`❌ Ferramenta ${name} não encontrada`);
      return res
        .status(404)
        .json({ error: `Ferramenta ${name} não encontrada` });
    }

    res.json({ result });
  } catch (error) {
    console.error(`❌ Erro ao executar ${name}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINT: LER CONTEÚDO DE UM RECURSO ==========
httpApp.get("/resources/:uri", async (req, res) => {
  const uri = decodeURIComponent(req.params.uri);

  console.error(`📖 HTTP GET /resources/${uri} - Lendo recurso`);

  try {
    // Buscar recurso na configuração
    const recurso = config.recursos.find((r) => r.uri === uri);

    if (!recurso) {
      console.error(`❌ Recurso ${uri} não encontrado`);
      return res.status(404).json({ error: `Recurso ${uri} não encontrado` });
    }

    console.error(`✅ Recurso ${recurso.nome} encontrado`);

    // Retornar conteúdo do recurso
    res.json({
      uri: recurso.uri,
      name: recurso.nome,
      mimeType: recurso.tipoMime,
      content: recurso.conteudo,
    });
  } catch (error) {
    console.error(`❌ Erro ao ler recurso ${uri}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========== HEALTH CHECK HTTP ==========
httpApp.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mode: "http",
    tools: config.ferramentas.length,
    resources: config.recursos.length,
  });
});

// Iniciar servidor HTTP na porta 3003
httpApp.listen(3003, () => {
  console.error("");
  console.error("╔═══════════════════════════════════════╗");
  console.error("║  🌐 MCP Server HTTP Iniciado         ║");
  console.error("╚═══════════════════════════════════════╝");
  console.error("");
  console.error("Porta: 3003");
  console.error("Endpoints:");
  console.error("  GET  http://localhost:3003/tools");
  console.error("  GET  http://localhost:3003/resources");
  console.error("  GET  http://localhost:3003/resources/:uri");
  console.error("  POST http://localhost:3003/tools/call");
  console.error("");
});

/**
 * 🚀 INICIAR SERVIDOR MCP STDIO
 *
 * POR QUE MANTER STDIO?
 * - Compatibilidade com mcp-client-demo
 * - Protocolo MCP oficial
 * - Demonstração educacional
 *
 * DUAL MODE:
 * - HTTP: Para frontend (browser)
 * - stdio: Para cliente MCP (terminal)
 *
 * Ambos funcionam simultaneamente!
 */
const transport = new StdioServerTransport();
server.connect(transport);

// Logs de inicialização (vão para stderr)
console.error("✅ MCP Server iniciado com sucesso");
console.error(`🛠️  ${config.ferramentas.length} ferramentas registradas`);
console.error(`📚 ${config.recursos.length} recursos disponíveis`);
console.error("");
console.error("📡 Aguardando requisições via stdin...");
console.error("   (Use Ctrl+C para parar)");
