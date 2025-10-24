import { MCPTool, MCPToolHandler } from "../types/mcp";
import { SalesApiClient } from "../utils/api-client";

/**
 * FERRAMENTAS MCP PARA VENDAS E ANALYTICS
 *
 * Este arquivo demonstra ferramentas MCP mais avançadas que combinam
 * operações de dados com análises de negócio.
 *
 * DIFERENÇA ENTRE FERRAMENTAS E RECURSOS:
 * - FERRAMENTAS: Executam ações, modificam dados, fazem cálculos
 * - RECURSOS: Fornecem informações estáticas (documentação, esquemas)
 */

/**
 * @description Ferramenta para listar vendas com filtros de data
 *
 * CONCEITO MCP: Ferramenta de consulta com parâmetros opcionais.
 * O chat pode usar filtros de data para análises temporais.
 *
 * EXEMPLO DE USO:
 * "Mostre as vendas da última semana"
 * → O chat calcula as datas e chama a ferramenta automaticamente
 */
export const ferramentaListarVendas: MCPTool = {
  name: "listar_vendas",
  description:
    "Lista todas as vendas do sistema com filtros opcionais por período de data",
  inputSchema: {
    type: "object",
    properties: {
      dataInicio: {
        type: "string",
        description: "Data de início para filtrar vendas (formato: YYYY-MM-DD)",
      },
      dataFim: {
        type: "string",
        description: "Data de fim para filtrar vendas (formato: YYYY-MM-DD)",
      },
      limite: {
        type: "number",
        description: "Número máximo de vendas a retornar (padrão: todas)",
      },
    },
    required: [],
  },
};

export const manipuladorListarVendas = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { dataInicio, dataFim, limite } = argumentos;

      if (dataInicio && dataFim) {
        // Usa filtro por período
        const resultado = await clienteApi.getSalesByDateRange(
          dataInicio,
          dataFim
        );

        let vendas = resultado.sales;
        if (limite && limite > 0) {
          vendas = vendas.slice(0, limite);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Encontradas ${vendas.length} vendas entre ${dataInicio} e ${dataFim}`,
                  dados: vendas,
                  receitaTotal: resultado.totalRevenue,
                  periodoConsultado: { dataInicio, dataFim },
                },
                null,
                2
              ),
            },
          ],
        };
      } else {
        // Lista todas as vendas
        let vendas = await clienteApi.getSales();

        if (limite && limite > 0) {
          vendas = vendas.slice(0, limite);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Listadas ${vendas.length} vendas do sistema`,
                  dados: vendas,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao listar vendas: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

/**
 * @description Ferramenta para buscar uma venda específica
 */
export const ferramentaBuscarVenda: MCPTool = {
  name: "buscar_venda",
  description:
    "Busca informações detalhadas de uma venda específica pelo seu ID",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID único da venda que se deseja consultar",
      },
    },
    required: ["id"],
  },
};

export const manipuladorBuscarVenda = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id } = argumentos;
      // Converter string para number se necessário (robustez)
      const idNum = typeof id === "string" ? Number(id) : id;
      const venda = await clienteApi.getSale(idNum);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Venda ${id} encontrada com sucesso`,
                dados: venda,
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
            text: `Erro ao buscar venda: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

/**
 * @description Ferramenta para registrar uma nova venda
 *
 * CONCEITO MCP: Ferramenta de TRANSAÇÃO que modifica múltiplos aspectos do sistema
 * (cria venda + pode afetar estoque). O chat pode calcular preços automaticamente.
 */
export const ferramentaCriarVenda: MCPTool = {
  name: "criar_venda",
  description: "Registra uma nova venda no sistema",
  inputSchema: {
    type: "object",
    properties: {
      idProduto: {
        type: "number",
        description: "ID do produto sendo vendido (obrigatório)",
      },
      quantidade: {
        type: "number",
        description:
          "Quantidade de produtos vendidos (obrigatório, deve ser positivo)",
      },
      nomeCliente: {
        type: "string",
        description: "Nome do cliente que está comprando (obrigatório)",
      },
      precoTotal: {
        type: "number",
        description:
          "Preço total da venda (opcional, será calculado automaticamente se não fornecido)",
      },
    },
    required: ["idProduto", "quantidade", "nomeCliente"],
  },
};

export const manipuladorCriarVenda = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { idProduto, quantidade, nomeCliente, precoTotal } = argumentos;

      // Converter strings para numbers se necessário (robustez)
      const idProdutoNum =
        typeof idProduto === "string" ? Number(idProduto) : idProduto;
      const quantidadeNum =
        typeof quantidade === "string" ? Number(quantidade) : quantidade;
      const precoTotalNum =
        precoTotal && typeof precoTotal === "string"
          ? Number(precoTotal)
          : precoTotal;

      // Se preço não fornecido, calcula baseado no produto
      let precoFinal = precoTotalNum;
      if (!precoFinal) {
        const produto = await clienteApi.getProduct(idProdutoNum);
        precoFinal = produto.price * quantidadeNum;
      }

      const venda = await clienteApi.createSale({
        productId: idProdutoNum,
        quantity: quantidadeNum,
        customerName: nomeCliente,
        totalPrice: precoFinal,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Venda registrada com sucesso para o cliente "${nomeCliente}"! ID da venda: ${venda.id}`,
                dados: venda,
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
            text: `Erro ao criar venda: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

/**
 * @description Ferramenta para análise completa de vendas
 *
 * CONCEITO MCP: Ferramenta de BUSINESS INTELLIGENCE que agrega dados
 * de múltiplas fontes para fornecer insights de negócio.
 *
 * VANTAGEM DO MCP: O chat pode interpretar os dados e fazer recomendações
 * baseadas nos insights retornados.
 */
export const ferramentaAnaliseVendas: MCPTool = {
  name: "analisar_vendas",
  description:
    "Gera análise completa de vendas incluindo receita, produtos mais vendidos, vendas por categoria e tendências",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const manipuladorAnaliseVendas = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async () => {
    try {
      const analise = await clienteApi.getSalesAnalytics();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: "Análise de vendas gerada com sucesso",
                dados: {
                  resumoExecutivo: analise.summary,
                  vendasPorCategoria: analise.salesByCategory,
                  produtosMaisVendidos: analise.topProducts,
                  vendasRecentes: analise.recentSales,
                  produtosEstoqueBaixo: analise.lowStockProducts,
                },
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
            text: `Erro ao gerar análise de vendas: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

/**
 * @description Ferramenta para resumo de inventário
 *
 * CONCEITO MCP: Ferramenta de MONITORAMENTO que combina dados de produtos
 * e vendas para fornecer visão operacional do negócio.
 */
export const ferramentaResumoInventario: MCPTool = {
  name: "resumo_inventario",
  description:
    "Gera resumo completo do inventário incluindo níveis de estoque, alertas de estoque baixo e valor total",
  inputSchema: {
    type: "object",
    properties: {
      limiteEstoqueBaixo: {
        type: "number",
        description:
          "Limite para alertas de estoque baixo (padrão: 20 unidades)",
      },
    },
    required: [],
  },
};

export const manipuladorResumoInventario = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      // Converter string para number se necessário (robustez)
      const limiteRaw = argumentos.limiteEstoqueBaixo ?? 20;
      const limiteEstoqueBaixo =
        typeof limiteRaw === "string" ? Number(limiteRaw) : limiteRaw;

      const [resumo, produtosEstoqueBaixo] = await Promise.all([
        clienteApi.getInventorySummary(),
        clienteApi.getLowStockProducts(limiteEstoqueBaixo),
      ]);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: "Resumo de inventário gerado com sucesso",
                dados: {
                  ...resumo,
                  alertasEstoqueBaixo: produtosEstoqueBaixo,
                  limiteConfigurado: limiteEstoqueBaixo,
                },
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
            text: `Erro ao gerar resumo de inventário: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

/**
 * @description Ferramenta para atualizar estoque
 *
 * CONCEITO MCP: Ferramenta de OPERAÇÃO CRÍTICA que modifica dados importantes.
 * Inclui validações e logs detalhados para auditoria.
 */
export const ferramentaAtualizarEstoque: MCPTool = {
  name: "atualizar_estoque",
  description:
    "Atualiza o estoque de um produto com operações de adicionar, subtrair ou definir quantidade exata",
  inputSchema: {
    type: "object",
    properties: {
      idProduto: {
        type: "number",
        description: "ID do produto para atualizar estoque (obrigatório)",
      },
      quantidade: {
        type: "number",
        description: "Quantidade para a operação (obrigatório)",
      },
      operacao: {
        type: "string",
        enum: ["adicionar", "subtrair", "definir"],
        description:
          'Tipo de operação: "adicionar" (aumentar estoque), "subtrair" (diminuir estoque), "definir" (definir quantidade exata)',
      },
      motivo: {
        type: "string",
        description:
          "Motivo da alteração de estoque (opcional, para auditoria)",
      },
    },
    required: ["idProduto", "quantidade", "operacao"],
  },
};

export const manipuladorAtualizarEstoque = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { idProduto, quantidade, operacao, motivo } = argumentos;

      // Converter strings para numbers se necessário (robustez)
      const idProdutoNum =
        typeof idProduto === "string" ? Number(idProduto) : idProduto;
      const quantidadeNum =
        typeof quantidade === "string" ? Number(quantidade) : quantidade;

      // Mapeia operações em português para inglês (compatibilidade com API)
      const mapeamentoOperacoes: Record<string, string> = {
        adicionar: "add",
        subtrair: "subtract",
        definir: "set",
      };

      const operacaoApi = mapeamentoOperacoes[operacao] || operacao;

      const resultado = await clienteApi.updateStock(
        idProdutoNum,
        quantidadeNum,
        operacaoApi as any,
        motivo
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Estoque atualizado com sucesso para o produto ${idProduto}`,
                dados: {
                  produto: resultado.product,
                  alteracao: resultado.stockChange,
                  operacaoRealizada: operacao,
                  motivoRegistrado: motivo || "Não informado",
                },
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
            text: `Erro ao atualizar estoque: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};
