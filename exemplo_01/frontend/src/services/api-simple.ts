import { Produto, Venda, RespostaApi } from "../types/components";

/**
 * SERVIÇO DE API SIMPLIFICADO
 *
 * Cliente HTTP simples para comunicação com o backend
 * Compatível com os tipos definidos no frontend
 */
class ApiSimples {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:3001";
  }

  /**
   * Método genérico para fazer requisições HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<RespostaApi<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Métodos GET
   */
  async get<T>(endpoint: string): Promise<RespostaApi<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * Métodos POST
   */
  async post<T>(endpoint: string, data: any): Promise<RespostaApi<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Métodos PUT
   */
  async put<T>(endpoint: string, data: any): Promise<RespostaApi<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Métodos DELETE
   */
  async delete<T>(endpoint: string): Promise<RespostaApi<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS PARA PRODUTOS
  // ============================================================================

  /**
   * Listar todos os produtos
   */
  async listarProdutos(): Promise<Produto[]> {
    const response = await this.get<Produto[]>("/api/products");
    return response.data || [];
  }

  /**
   * Obter produto por ID
   */
  async obterProduto(id: number): Promise<Produto | null> {
    const response = await this.get<Produto>(`/api/products/${id}`);
    return response.data || null;
  }

  /**
   * Criar novo produto
   */
  async criarProduto(
    produto: Omit<Produto, "id" | "createdAt">
  ): Promise<Produto | null> {
    const response = await this.post<Produto>("/api/products", produto);
    return response.data || null;
  }

  /**
   * Atualizar produto existente
   */
  async atualizarProduto(
    id: number,
    produto: Partial<Produto>
  ): Promise<Produto | null> {
    const response = await this.put<Produto>(`/api/products/${id}`, produto);
    return response.data || null;
  }

  /**
   * Deletar produto
   */
  async deletarProduto(id: number): Promise<boolean> {
    const response = await this.delete(`/api/products/${id}`);
    return response.success;
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS PARA VENDAS
  // ============================================================================

  /**
   * Listar todas as vendas
   */
  async listarVendas(): Promise<Venda[]> {
    const response = await this.get<Venda[]>("/api/sales");
    return response.data || [];
  }

  /**
   * Obter venda por ID
   */
  async obterVenda(id: number): Promise<Venda | null> {
    const response = await this.get<Venda>(`/api/sales/${id}`);
    return response.data || null;
  }

  /**
   * Criar nova venda
   */
  async criarVenda(
    venda: Omit<Venda, "id" | "saleDate">
  ): Promise<Venda | null> {
    const vendaComData = {
      ...venda,
      saleDate: new Date().toISOString(),
    };

    const response = await this.post<Venda>("/api/sales", vendaComData);
    return response.data || null;
  }

  // ============================================================================
  // MÉTODOS PARA ANALYTICS E RELATÓRIOS
  // ============================================================================

  /**
   * Obter analytics de vendas
   */
  async obterAnalyticsVendas(): Promise<any> {
    const response = await this.get("/api/analytics/sales");
    return response.data || null;
  }

  /**
   * Obter resumo do inventário
   */
  async obterResumoInventario(): Promise<any> {
    const response = await this.get("/api/inventory/summary");
    return response.data || null;
  }

  /**
   * Buscar produtos com filtros
   */
  async buscarProdutos(filtros: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Produto[]> {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const endpoint = `/api/search/products${
      params.toString() ? "?" + params.toString() : ""
    }`;
    const response = await this.get<Produto[]>(endpoint);
    return response.data || [];
  }

  /**
   * Obter categorias disponíveis
   */
  async obterCategorias(): Promise<string[]> {
    const response = await this.get<{ categories: string[] }>(
      "/api/search/categories"
    );
    return response.data?.categories || [];
  }

  // ============================================================================
  // MÉTODO DE HEALTH CHECK
  // ============================================================================

  /**
   * Verificar se a API está funcionando
   */
  async verificarSaude(): Promise<boolean> {
    try {
      const response = await this.get("/health");
      return response.success;
    } catch {
      return false;
    }
  }
}

// Exportar instância única
export const api = new ApiSimples();

// Exportar também a classe para casos especiais
export { ApiSimples };
