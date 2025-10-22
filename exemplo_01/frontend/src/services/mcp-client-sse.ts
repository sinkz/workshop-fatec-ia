/**
 * 🌟 CLIENTE MCP REAL - SSE Transport
 *
 * Implementação oficial usando @modelcontextprotocol/sdk
 * Usa Server-Sent Events (SSE) para comunicação bidirecional
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export interface MCPToolResult {
  sucesso: boolean;
  dados?: any;
  erro?: string;
}

/**
 * Cliente MCP Real usando SSE Transport
 * Esta é a implementação OFICIAL e CORRETA do MCP no browser
 */
export class MCPClientSSE {
  private client: Client | null = null;
  private transport: SSEClientTransport | null = null;
  private baseUrl: string;
  private connected: boolean = false;

  constructor(baseUrl: string = "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  /**
   * Conectar ao servidor MCP via SSE (apenas uma vez, com timeout)
   */
  async connect(): Promise<void> {
    if (this.connected && this.client) {
      console.log("✅ MCP já conectado, reutilizando conexão");
      return;
    }

    try {
      console.log("🔌 Conectando ao MCP Server via SSE...");

      // Criar transport SSE
      this.transport = new SSEClientTransport(
        new URL(`${this.baseUrl}/mcp/sse`),
        new URL(`${this.baseUrl}/mcp/message`)
      );

      // Criar cliente MCP
      this.client = new Client(
        {
          name: "chat-frontend",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      // Timeout para conexão (15 segundos)
      const connectTimeout = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Timeout ao conectar MCP via SSE")),
          15000
        );
      });

      // Conectar (aguarda estabelecer conexão)
      await Promise.race([this.client.connect(this.transport), connectTimeout]);

      this.connected = true;
      console.log("✅ MCP Client conectado via SSE");

      // Listar ferramentas disponíveis (com timeout)
      const listTimeout = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Timeout ao listar ferramentas")),
          5000
        );
      });

      const tools = await Promise.race([this.client.listTools(), listTimeout]);

      console.log(
        `📋 ${tools.tools.length} ferramentas MCP disponíveis:`,
        tools.tools.map((t) => t.name).join(", ")
      );
    } catch (error) {
      console.error("❌ Erro ao conectar MCP:", error);
      this.connected = false;
      this.client = null;
      this.transport = null;
      throw error;
    }
  }

  /**
   * Desconectar do servidor MCP
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        this.connected = false;
        console.log("🔌 MCP Client desconectado");
      } catch (error) {
        console.error("Erro ao desconectar MCP:", error);
      }
    }
  }

  /**
   * Verificar se está conectado
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Listar ferramentas disponíveis
   */
  async listarFerramentas(): Promise<any[]> {
    if (!this.client || !this.connected) {
      await this.connect();
    }

    try {
      const response = await this.client!.listTools();
      return response.tools;
    } catch (error) {
      console.error("Erro ao listar ferramentas MCP:", error);
      return [];
    }
  }

  /**
   * Executar ferramenta MCP (via SDK oficial com timeout)
   */
  async executarFerramenta(
    nome: string,
    parametros: Record<string, any> = {}
  ): Promise<MCPToolResult> {
    if (!this.client || !this.connected) {
      try {
        await this.connect();
      } catch (error) {
        return {
          sucesso: false,
          erro: "Falha ao conectar ao servidor MCP",
        };
      }
    }

    try {
      console.log(`🔧 MCP: Executando ferramenta "${nome}"`, parametros);

      // Criar promise com timeout de 10 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Timeout: MCP não respondeu em 10s")),
          10000
        );
      });

      // Chamar ferramenta via SDK oficial
      const responsePromise = this.client!.callTool({
        name: nome,
        arguments: parametros,
      });

      // Race entre a chamada e o timeout
      const response = await Promise.race([responsePromise, timeoutPromise]);

      // Extrair dados da resposta MCP
      const textContent = response.content.find((c) => c.type === "text");
      const dados = textContent ? JSON.parse((textContent as any).text) : null;

      console.log(`✅ MCP: Ferramenta "${nome}" executada com sucesso`);

      return {
        sucesso: true,
        dados,
      };
    } catch (error) {
      console.error(`❌ MCP: Erro na ferramenta "${nome}":`, error);
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Verificar conexão (sem reconectar automaticamente)
   */
  async verificarConexao(): Promise<boolean> {
    return this.connected;
  }
}

// ============================================================================
// 📚 DOCUMENTAÇÃO
// ============================================================================

/**
 * DIFERENÇA ENTRE MCP FAKE vs MCP REAL:
 *
 * ❌ MCP Fake (anterior):
 * Frontend → Chama API REST diretamente → Pega dados → Envia para Groq
 *
 * ✅ MCP Real (atual):
 * Frontend → MCP Client (SSE) → MCP Server → API REST → MCP Server → Frontend
 *                                    ↓
 *                              Groq processa
 *
 * VANTAGENS DO MCP REAL:
 * 1. Protocolo padronizado (MCP spec oficial)
 * 2. Descoberta automática de ferramentas
 * 3. Validação de schemas
 * 4. Streaming de respostas (SSE)
 * 5. Reconnect automático
 * 6. Compatível com Claude/Anthropic
 *
 * COMO USAR:
 *
 * ```typescript
 * const mcpClient = new MCPClientSSE("http://localhost:3001");
 * await mcpClient.connect();
 *
 * const ferramentas = await mcpClient.listarFerramentas();
 * const resultado = await mcpClient.executarFerramenta("listar_produtos", {});
 * ```
 */

export default MCPClientSSE;
