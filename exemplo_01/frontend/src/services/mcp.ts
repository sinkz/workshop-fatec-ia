/**
 * 🔌 SERVIÇO MCP SIMPLIFICADO PARA ALUNOS
 *
 * Integração simples com o servidor MCP usando apenas configurações dos alunos
 */

import CONFIG_ALUNOS from "../config/config-alunos";

// ============================================================================
// 🔧 TIPOS SIMPLES
// ============================================================================

export interface FerramentaMCP {
  nome: string;
  descricao: string;
  parametros?: Record<string, any>;
}

export interface RespostaMCP {
  sucesso: boolean;
  dados?: any;
  erro?: string;
}

// ============================================================================
// 🔌 CLIENTE MCP SIMPLIFICADO
// ============================================================================

export class MCPClientSimples {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = CONFIG_ALUNOS.mcp.url;
    this.timeout = 60000; // 60 segundos (aumentado para operações de escrita)
  }

  /**
   * Listar ferramentas disponíveis
   */
  async listarFerramentas(): Promise<FerramentaMCP[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`Erro MCP: ${response.status}`);
      }

      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error("Erro ao listar ferramentas MCP:", error);
      return [];
    }
  }

  /**
   * Executar ferramenta MCP (via API do backend)
   */
  async executarFerramenta(
    nome: string,
    parametros: Record<string, any> = {}
  ): Promise<RespostaMCP> {
    try {
      // Mapear ferramentas MCP para endpoints da API
      let endpoint = "";
      let method = "GET";
      let body = null;

      switch (nome) {
        case "listar_produtos":
          endpoint = "/api/products";
          break;
        case "buscar_produto":
          endpoint = `/api/products/${parametros.id}`;
          break;
        case "criar_produto":
          endpoint = "/api/products";
          method = "POST";
          body = JSON.stringify({
            name: parametros.nome,
            price: parametros.preco,
            category: parametros.categoria,
            description: parametros.descricao,
            stock: parametros.estoque,
          });
          break;
        case "listar_vendas":
          endpoint = "/api/sales";
          break;
        case "analisar_vendas":
          endpoint = "/api/analytics/sales";
          break;
        case "listar_categorias":
          endpoint = "/api/search/categories";
          break;
        case "atualizar_produto":
          endpoint = `/api/products/${parametros.id}`;
          method = "PUT";
          // Mapear campos PT → EN
          const atualizacoes: any = {};
          if (parametros.nome) atualizacoes.name = parametros.nome;
          if (parametros.preco) atualizacoes.price = parametros.preco;
          if (parametros.categoria)
            atualizacoes.category = parametros.categoria;
          if (parametros.descricao)
            atualizacoes.description = parametros.descricao;
          if (parametros.estoque !== undefined)
            atualizacoes.stock = parametros.estoque;
          body = JSON.stringify(atualizacoes);
          break;
        case "criar_venda":
          endpoint = "/api/sales";
          method = "POST";
          body = JSON.stringify({
            productId: parametros.idProduto,
            quantity: parametros.quantidade,
            customerName: parametros.nomeCliente,
            totalPrice: parametros.precoTotal,
            saleDate: new Date().toISOString(),
          });
          break;
        case "buscar_venda":
          endpoint = `/api/sales/${parametros.id}`;
          break;
        case "resumo_inventario":
          endpoint = "/api/inventory/summary";
          break;
        case "atualizar_estoque":
          endpoint = "/api/inventory/stock";
          method = "PATCH";
          // Mapear operações PT → EN
          const operacaoMap: Record<string, string> = {
            adicionar: "add",
            subtrair: "subtract",
            definir: "set",
          };
          body = JSON.stringify({
            productId: parametros.idProduto,
            quantity: parametros.quantidade,
            operation: operacaoMap[parametros.operacao] || parametros.operacao,
            reason: parametros.motivo,
          });
          break;
        default:
          throw new Error(`Ferramenta ${nome} não implementada`);
      }

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body) {
        fetchOptions.body = body;
      }

      console.log(`🌐 Chamando: ${method} ${this.baseUrl}${endpoint}`);
      if (body) {
        console.log(`📦 Body:`, JSON.parse(body));
      }

      // Timeout manual via Promise.race (mais confiável que AbortSignal)
      const fetchPromise = fetch(`${this.baseUrl}${endpoint}`, fetchOptions);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout após ${this.timeout}ms`)),
          this.timeout
        )
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erro response:`, errorText);
        throw new Error(
          `Erro ao executar ${nome}: ${response.status} - ${errorText}`
        );
      }

      const dados = await response.json();
      console.log(`✅ Dados recebidos:`, dados);

      return {
        sucesso: true,
        dados,
      };
    } catch (error) {
      console.error(`Erro na ferramenta ${nome}:`, error);
      return {
        sucesso: false,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Verificar se MCP está conectado (verifica o backend)
   */
  async verificarConexao(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 segundos para health check
      });

      return response.ok;
    } catch (error) {
      console.error("MCP desconectado:", error);
      return false;
    }
  }
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA ALUNOS
// ============================================================================

/**
 * COMO USAR:
 *
 * ```typescript
 * const mcp = new MCPClientSimples();
 *
 * // Verificar conexão
 * const conectado = await mcp.verificarConexao();
 *
 * // Listar ferramentas
 * const ferramentas = await mcp.listarFerramentas();
 *
 * // Executar ferramenta
 * const resultado = await mcp.executarFerramenta("listar_produtos", {});
 * ```
 *
 * CONFIGURAÇÕES:
 * - URL e timeout vêm do config-alunos.ts
 * - Todas as ferramentas são descobertas automaticamente
 * - Tratamento de erro simplificado
 */

export default MCPClientSimples;
