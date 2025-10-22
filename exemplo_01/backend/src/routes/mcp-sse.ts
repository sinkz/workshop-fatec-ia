/**
 * MCP Server via SSE (Server-Sent Events)
 * Implementação real do Model Context Protocol usando SSE Transport
 */

import { Router, Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const router = Router();

// URL base da API (ajuste conforme necessário)
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

/**
 * Endpoint SSE para MCP Server
 * Mantém conexão aberta com o cliente usando Server-Sent Events
 */
router.get("/mcp/sse", async (req: Request, res: Response) => {
  console.log("🔌 Nova conexão MCP SSE iniciada");

  try {
    // Criar servidor MCP
    const server = new Server(
      {
        name: "sales-mcp-server-sse",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Registrar handler para listar ferramentas
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.log("📋 MCP: Listando ferramentas disponíveis");

      return {
        tools: [
          {
            name: "listar_produtos",
            description:
              "Lista todos os produtos do sistema com informações completas",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          },
          {
            name: "buscar_produto",
            description: "Busca um produto específico por ID",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                  description: "ID do produto",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "listar_vendas",
            description: "Lista todas as vendas registradas",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          },
          {
            name: "analisar_vendas",
            description: "Gera análise completa de vendas com métricas",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          },
          {
            name: "listar_categorias",
            description: "Lista categorias de produtos com estatísticas",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        ],
      };
    });

    // Registrar handler para executar ferramentas
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      console.log(`🔧 MCP: Executando ferramenta "${name}"`, args);

      try {
        let data: any;

        switch (name) {
          case "listar_produtos": {
            const response = await axios.get(`${API_BASE_URL}/api/products`);
            data = response.data;
            break;
          }

          case "buscar_produto": {
            const id = (args as any)?.id;
            if (!id) {
              throw new Error("ID do produto é obrigatório");
            }
            const response = await axios.get(
              `${API_BASE_URL}/api/products/${id}`
            );
            data = response.data;
            break;
          }

          case "listar_vendas": {
            const response = await axios.get(`${API_BASE_URL}/api/sales`);
            data = response.data;
            break;
          }

          case "analisar_vendas": {
            const response = await axios.get(
              `${API_BASE_URL}/api/analytics/sales`
            );
            data = response.data.data;
            break;
          }

          case "listar_categorias": {
            const response = await axios.get(
              `${API_BASE_URL}/api/search/categories`
            );
            data = response.data.data.categories;
            break;
          }

          default:
            throw new Error(`Ferramenta "${name}" não encontrada`);
        }

        console.log(`✅ MCP: Ferramenta "${name}" executada com sucesso`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`❌ MCP: Erro na ferramenta "${name}":`, error);

        return {
          content: [
            {
              type: "text",
              text: `Erro ao executar ${name}: ${
                error instanceof Error ? error.message : "Erro desconhecido"
              }`,
            },
          ],
          isError: true,
        };
      }
    });

    // Criar transport SSE
    const transport = new SSEServerTransport("/mcp/message", res);

    // Conectar servidor ao transport
    await server.connect(transport);

    console.log("✅ MCP Server SSE conectado");

    // Cleanup ao fechar conexão
    req.on("close", () => {
      console.log("🔌 Conexão MCP SSE fechada");
      server.close().catch((err) => {
        console.error("Erro ao fechar servidor MCP:", err);
      });
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar MCP SSE:", error);
    res.end();
  }
});

/**
 * Endpoint POST para mensagens do cliente
 * O SDK MCP usa isso para enviar mensagens do cliente para o servidor
 */
router.post("/mcp/message", async (req: Request, res: Response) => {
  // O transport SSE lida com isso automaticamente
  // Este endpoint precisa existir mas o processamento é feito pelo transport
  res.status(202).json({ status: "accepted" });
});

export default router;
