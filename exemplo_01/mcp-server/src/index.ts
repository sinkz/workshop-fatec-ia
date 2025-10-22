#!/usr/bin/env node

/**
 * SERVIDOR MCP PARA SISTEMA DE VENDAS
 *
 * Este servidor demonstra como criar um servidor MCP (Model Context Protocol)
 * completo para integração com sistemas de chat inteligentes.
 *
 * O QUE É MCP?
 * MCP é um protocolo que permite que aplicações de chat (Claude, ChatGPT, etc.)
 * se conectem com sistemas externos de forma padronizada e segura.
 *
 * VANTAGENS DO MCP:
 * 1. DESCOBERTA AUTOMÁTICA: O chat descobre automaticamente quais ferramentas estão disponíveis
 * 2. VALIDAÇÃO AUTOMÁTICA: Parâmetros são validados pelo protocolo
 * 3. CONTEXTO SEMÂNTICO: O chat entende o que cada ferramenta faz
 * 4. SEGURANÇA: Controle granular sobre operações permitidas
 * 5. PADRONIZAÇÃO: Interface consistente independente do backend
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MCPServerConfig } from "./types/mcp.js";
import { SalesApiClient } from "./utils/api-client.js";
import { ToolRegistry } from "./utils/tool-registry.js";
import {
  ferramentaListarProdutos,
  manipuladorListarProdutos,
  ferramentaBuscarProduto,
  manipuladorBuscarProduto,
  ferramentaCriarProduto,
  manipuladorCriarProduto,
  ferramentaAtualizarProduto,
  manipuladorAtualizarProduto,
  ferramentaListarCategorias,
  manipuladorListarCategorias,
} from "./tools/produtos.js";
import {
  ferramentaListarVendas,
  manipuladorListarVendas,
  ferramentaBuscarVenda,
  manipuladorBuscarVenda,
  ferramentaCriarVenda,
  manipuladorCriarVenda,
  ferramentaAnaliseVendas,
  manipuladorAnaliseVendas,
  ferramentaResumoInventario,
  manipuladorResumoInventario,
  ferramentaAtualizarEstoque,
  manipuladorAtualizarEstoque,
} from "./tools/vendas.js";
import {
  recursosDisponiveis,
  obterConteudoRecurso,
} from "./resources/documentacao.js";

const configuracao: MCPServerConfig = {
  name: "servidor-mcp-vendas",
  version: "1.0.0",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
  timeout: 30000,
};

/**
 * Inicializa o Servidor MCP com registro completo de ferramentas e recursos
 */
async function iniciarServidor(): Promise<void> {
  const servidor = new Server({
    name: configuracao.name,
    version: configuracao.version,
  });

  // Inicializar cliente da API e registro de ferramentas
  const clienteApi = new SalesApiClient(
    configuracao.apiBaseUrl,
    configuracao.timeout
  );
  const registroFerramentas = new ToolRegistry();

  /**
   * FERRAMENTA DE VERIFICAÇÃO DE SAÚDE
   * Demonstra uma ferramenta básica que verifica se o sistema está funcionando
   */
  registroFerramentas.registerTool(
    {
      name: "verificar_saude_sistema",
      description: "Verifica se a API de vendas está funcionando e acessível",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    async () => {
      try {
        const saude = await clienteApi.healthCheck();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: "saudável",
                  servidor: configuracao.name,
                  urlApi: configuracao.apiBaseUrl,
                  saudeApi: saude,
                  timestamp: new Date().toISOString(),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (erro) {
        return {
          content: [
            {
              type: "text",
              text: `Erro: Falha na conexão com a API - ${
                erro instanceof Error ? erro.message : "Erro desconhecido"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Registrar Ferramentas de Produtos
  registroFerramentas.registerTool(
    ferramentaListarProdutos,
    manipuladorListarProdutos(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaBuscarProduto,
    manipuladorBuscarProduto(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaCriarProduto,
    manipuladorCriarProduto(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaAtualizarProduto,
    manipuladorAtualizarProduto(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaListarCategorias,
    manipuladorListarCategorias(clienteApi)
  );

  // Registrar Ferramentas de Vendas e Analytics
  registroFerramentas.registerTool(
    ferramentaListarVendas,
    manipuladorListarVendas(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaBuscarVenda,
    manipuladorBuscarVenda(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaCriarVenda,
    manipuladorCriarVenda(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaAnaliseVendas,
    manipuladorAnaliseVendas(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaResumoInventario,
    manipuladorResumoInventario(clienteApi)
  );
  registroFerramentas.registerTool(
    ferramentaAtualizarEstoque,
    manipuladorAtualizarEstoque(clienteApi)
  );

  /**
   * HANDLER PARA LISTAR FERRAMENTAS DISPONÍVEIS
   * O chat usa isso para descobrir quais ferramentas estão disponíveis
   */
  servidor.setRequestHandler(ListToolsRequestSchema, async () => {
    const ferramentas = registroFerramentas.getToolDefinitions();
    console.error(
      `[MCP] 📋 Listando ${ferramentas.length} ferramentas disponíveis`
    );
    return { tools: ferramentas };
  });

  /**
   * HANDLER PARA EXECUTAR FERRAMENTAS
   * O chat usa isso para executar uma ferramenta específica
   */
  servidor.setRequestHandler(CallToolRequestSchema, async (requisicao) => {
    const { name: nome, arguments: argumentos } = requisicao.params;
    console.error(`[MCP] 🔧 Executando ferramenta: ${nome}`);
    const resultado = await registroFerramentas.executeTool(
      nome,
      argumentos || {}
    );
    return {
      content: resultado.content,
      isError: resultado.isError,
    };
  });

  /**
   * HANDLER PARA LISTAR RECURSOS DISPONÍVEIS
   * Recursos fornecem informações estáticas como documentação
   */
  servidor.setRequestHandler(ListResourcesRequestSchema, async () => {
    console.error(
      `[MCP] 📚 Listando ${recursosDisponiveis.length} recursos disponíveis`
    );
    return { resources: recursosDisponiveis };
  });

  /**
   * HANDLER PARA LER CONTEÚDO DE RECURSOS
   * O chat usa isso para acessar documentação e informações estáticas
   */
  servidor.setRequestHandler(ReadResourceRequestSchema, async (requisicao) => {
    const { uri } = requisicao.params;
    console.error(`[MCP] 📖 Lendo recurso: ${uri}`);

    const conteudo = obterConteudoRecurso(uri);
    if (!conteudo) {
      throw new Error(`Recurso não encontrado: ${uri}`);
    }

    return {
      contents: [
        {
          uri: conteudo.uri,
          mimeType: conteudo.tipoMime,
          text: conteudo.conteudo,
        },
      ],
    };
  });

  // Iniciar servidor
  const transporte = new StdioServerTransport();
  await servidor.connect(transporte);

  console.error(
    `🚀 Servidor MCP ${configuracao.name} v${configuracao.version} iniciado`
  );
  console.error(`🌐 URL da API: ${configuracao.apiBaseUrl}`);
  console.error(
    `🛠️  Ferramentas registradas (${registroFerramentas.getToolCount()}): ${registroFerramentas
      .getToolNames()
      .join(", ")}`
  );
  console.error(
    `📚 Recursos disponíveis (${
      recursosDisponiveis.length
    }): ${recursosDisponiveis.map((r) => r.nome).join(", ")}`
  );
  console.error(`\n💡 DICA EDUCACIONAL:`);
  console.error(
    `   - FERRAMENTAS executam AÇÕES (criar, atualizar, consultar)`
  );
  console.error(`   - RECURSOS fornecem INFORMAÇÕES (documentação, esquemas)`);
  console.error(`   - Use ferramentas quando precisar FAZER algo`);
  console.error(`   - Use recursos quando precisar SABER algo\n`);
}

// Tratamento de encerramento do processo
process.on("SIGINT", async () => {
  console.error("🛑 Servidor MCP encerrando...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.error("🛑 Servidor MCP terminado");
  process.exit(0);
});

// Iniciar o servidor
iniciarServidor().catch((erro) => {
  console.error("❌ Falha ao iniciar servidor MCP:", erro);
  process.exit(1);
});
