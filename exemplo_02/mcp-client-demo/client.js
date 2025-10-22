#!/usr/bin/env node

/**
 * 🔌 CLIENTE MCP SIMPLES - DEMONSTRAÇÃO EDUCACIONAL
 *
 * O QUE É ESTE ARQUIVO?
 * - Cliente que se conecta ao MCP Server via stdio (stdin/stdout)
 * - Demonstra o ciclo completo do protocolo MCP
 * - Executa ferramentas e lista recursos
 *
 * DIFERENÇA DO FRONTEND:
 * - Frontend chama Groq diretamente (HTTP) + Function Calling
 * - Este cliente usa o protocolo MCP oficial (stdin/stdout)
 * - Mostra como aplicações reais (Claude Desktop) funcionam
 *
 * ARQUITETURA:
 * Cliente MCP ←stdin/stdout→ MCP Server ←HTTP→ Backend Express
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// ========== CONFIGURAÇÃO ==========
const CONFIG = {
  mcpServerCommand: "node",
  mcpServerArgs: ["../mcp-server/index.js"],
};

// ========== CONECTAR AO SERVIDOR MCP ==========
/**
 * 🔌 CONECTAR AO MCP SERVER
 *
 * COMO FUNCIONA?
 * - Cria um transporte stdio (stdin/stdout)
 * - Inicia o processo do servidor MCP como child process
 * - Conecta o cliente ao servidor via pipes
 *
 * PROTOCOLO:
 * - Cliente envia JSON-RPC via stdin do servidor
 * - Servidor responde JSON-RPC via stdout
 * - Logs do servidor vão para stderr (não interferem)
 */
async function conectarMCPServer() {
  console.log("═══════════════════════════════════════");
  console.log("  🔌 CONECTANDO AO MCP SERVER");
  console.log("═══════════════════════════════════════\n");

  console.log(
    `📂 Comando: ${CONFIG.mcpServerCommand} ${CONFIG.mcpServerArgs.join(" ")}`
  );
  console.log("⏳ Aguardando conexão...\n");

  // Criar transporte stdio
  const transport = new StdioClientTransport({
    command: CONFIG.mcpServerCommand,
    args: CONFIG.mcpServerArgs,
  });

  // Criar cliente MCP
  const client = new Client(
    {
      name: "mcp-client-demo",
      version: "1.0.0",
    },
    {
      capabilities: {}, // Cliente básico sem capacidades especiais
    }
  );

  // Conectar
  await client.connect(transport);

  console.log("✅ Conectado ao MCP Server!\n");
  console.log("──────────────────────────────────────\n");

  return client;
}

// ========== LISTAR FERRAMENTAS ==========
/**
 * 📋 LISTAR FERRAMENTAS DISPONÍVEIS
 *
 * Envia requisição: tools/list
 * Recebe: Array de ferramentas com name, description, inputSchema
 */
async function listarFerramentas(client) {
  console.log("📋 Listando ferramentas disponíveis...\n");

  const result = await client.listTools();

  console.log(`🛠️  ${result.tools.length} ferramentas encontradas:\n`);
  result.tools.forEach((tool, index) => {
    console.log(`   ${index + 1}. ${tool.name}`);
    console.log(`      ↳ ${tool.description}`);

    if (tool.inputSchema && tool.inputSchema.properties) {
      const params = Object.keys(tool.inputSchema.properties);
      if (params.length > 0) {
        console.log(`      ↳ Parâmetros: ${params.join(", ")}`);
      }
    }
    console.log("");
  });

  return result.tools;
}

// ========== EXECUTAR FERRAMENTA ==========
/**
 * 🔧 EXECUTAR UMA FERRAMENTA
 *
 * Envia requisição: tools/call
 * Parâmetros: { name, arguments }
 * Recebe: { content: [{ type, text }] }
 *
 * FLUXO INTERNO:
 * 1. Cliente MCP → tools/call → MCP Server
 * 2. MCP Server → HTTP GET/POST → Backend Express
 * 3. Backend Express → responde JSON
 * 4. MCP Server → formata resposta MCP → Cliente MCP
 */
async function executarFerramenta(client, nome, argumentos = {}) {
  console.log(`🔧 Executando ferramenta: ${nome}`);

  if (Object.keys(argumentos).length > 0) {
    console.log(`   Argumentos:`, JSON.stringify(argumentos, null, 2));
  } else {
    console.log(`   Sem argumentos`);
  }

  console.log("   ⏳ Processando...\n");

  const result = await client.callTool({
    name: nome,
    arguments: argumentos,
  });

  console.log("✅ Resultado recebido:\n");

  // Processar conteúdo da resposta
  result.content.forEach((item) => {
    if (item.type === "text") {
      try {
        const dados = JSON.parse(item.text);

        // Se for array de produtos
        if (Array.isArray(dados)) {
          console.log(`   📦 ${dados.length} produto(s):\n`);
          dados.forEach((produto) => {
            console.log(`      • ${produto.nome}`);
            console.log(`        Preço: R$ ${produto.preco.toFixed(2)}`);
            console.log(`        Categoria: ${produto.categoria}`);
            console.log(`        ID: ${produto.id}`);
            console.log("");
          });
        }
        // Se for um único produto
        else if (dados.id && dados.nome) {
          console.log(`   ✅ Produto criado:\n`);
          console.log(`      Nome: ${dados.nome}`);
          console.log(`      Preço: R$ ${dados.preco.toFixed(2)}`);
          console.log(`      Categoria: ${dados.categoria}`);
          console.log(`      ID: ${dados.id}`);
          console.log("");
        }
        // Outro formato JSON
        else {
          console.log(JSON.stringify(dados, null, 2));
        }
      } catch (error) {
        // Se não for JSON, mostrar texto puro
        console.log(item.text);
      }
    }
  });

  return result;
}

// ========== LISTAR RECURSOS ==========
/**
 * 📚 LISTAR RECURSOS DISPONÍVEIS
 *
 * Envia requisição: resources/list
 * Recebe: Array de recursos com uri, name, description, mimeType
 *
 * RECURSOS vs FERRAMENTAS:
 * - Recursos: Dados estáticos (documentação, configs)
 * - Ferramentas: Ações executáveis (criar, listar, deletar)
 */
async function listarRecursos(client) {
  console.log("📚 Listando recursos disponíveis...\n");

  const result = await client.listResources();

  console.log(`📖 ${result.resources.length} recurso(s) encontrado(s):\n`);
  result.resources.forEach((resource, index) => {
    console.log(`   ${index + 1}. ${resource.name}`);
    console.log(`      URI: ${resource.uri}`);
    console.log(`      Descrição: ${resource.description}`);
    console.log(`      Tipo: ${resource.mimeType || "text/plain"}`);
    console.log("");
  });

  return result.resources;
}

// ========== DEMONSTRAÇÃO COMPLETA ==========
/**
 * 🎓 DEMONSTRAÇÃO PASSO-A-PASSO
 *
 * Executa uma sequência de testes para mostrar:
 * 1. Conexão com MCP Server
 * 2. Listagem de ferramentas disponíveis
 * 3. Listagem de recursos
 * 4. Execução de ferramentas (listar, criar)
 * 5. Verificação de persistência
 */
async function demonstracao() {
  console.clear();
  console.log("\n");
  console.log("╔═══════════════════════════════════════╗");
  console.log("║                                       ║");
  console.log("║  🎓 DEMONSTRAÇÃO MCP CLIENT + SERVER ║");
  console.log("║     Protocolo MCP via stdio          ║");
  console.log("║                                       ║");
  console.log("╚═══════════════════════════════════════╝");
  console.log("\n");

  let client;

  try {
    // ===== PASSO 1: CONECTAR =====
    client = await conectarMCPServer();

    // ===== PASSO 2: LISTAR FERRAMENTAS =====
    await listarFerramentas(client);
    console.log("──────────────────────────────────────\n");

    // ===== PASSO 3: LISTAR RECURSOS =====
    await listarRecursos(client);
    console.log("──────────────────────────────────────\n");

    // ===== PASSO 4: TESTE 1 - LISTAR PRODUTOS EXISTENTES =====
    console.log("╔═══════════════════════════════════════╗");
    console.log("║  TESTE 1: Listar produtos existentes ║");
    console.log("╚═══════════════════════════════════════╝\n");
    await executarFerramenta(client, "listar_produtos");
    console.log("──────────────────────────────────────\n");

    // Aguardar 2 segundos antes do próximo teste
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // ===== PASSO 5: TESTE 2 - CRIAR NOVO PRODUTO =====
    console.log("╔═══════════════════════════════════════╗");
    console.log("║  TESTE 2: Criar novo produto         ║");
    console.log("╚═══════════════════════════════════════╝\n");
    await executarFerramenta(client, "criar_produto", {
      nome: "Webcam HD 1080p",
      preco: 299.9,
      categoria: "Periféricos",
    });
    console.log("──────────────────────────────────────\n");

    // Aguardar 2 segundos antes do próximo teste
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // ===== PASSO 6: TESTE 3 - VERIFICAR SE O PRODUTO FOI CRIADO =====
    console.log("╔═══════════════════════════════════════╗");
    console.log("║  TESTE 3: Verificar produto criado   ║");
    console.log("╚═══════════════════════════════════════╝\n");
    await executarFerramenta(client, "listar_produtos");
    console.log("──────────────────────────────────────\n");

    // ===== FINALIZAÇÃO =====
    console.log("╔═══════════════════════════════════════╗");
    console.log("║                                       ║");
    console.log("║  ✅ DEMONSTRAÇÃO CONCLUÍDA!          ║");
    console.log("║                                       ║");
    console.log("║  Conceitos demonstrados:             ║");
    console.log("║  • Conexão via stdio                 ║");
    console.log("║  • Listagem de ferramentas           ║");
    console.log("║  • Execução de tools                 ║");
    console.log("║  • Manipulação de dados reais        ║");
    console.log("║                                       ║");
    console.log("╚═══════════════════════════════════════╝\n");

    // Encerrar conexão
    await client.close();
    console.log("🔌 Conexão encerrada.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERRO NA DEMONSTRAÇÃO:\n");
    console.error(error.message);
    console.error("\n💡 VERIFIQUE:");
    console.error("   1. Backend Express está rodando? (porta 3001)");
    console.error("   2. MCP Server index.js existe em ../mcp-server/?");
    console.error("   3. Dependências instaladas? (npm install)\n");

    if (client) {
      await client.close();
    }

    process.exit(1);
  }
}

// ========== EXECUTAR DEMONSTRAÇÃO ==========
demonstracao();
