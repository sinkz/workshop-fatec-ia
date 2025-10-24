import { MCPTool, MCPToolHandler } from "../types/mcp";
import { SalesApiClient } from "../utils/api-client";

/**
 * FERRAMENTAS MCP PARA PRODUTOS
 *
 * Este arquivo demonstra como criar ferramentas MCP que permitem ao chat
 * interagir com nossa API de produtos de forma inteligente e contextual.
 *
 * VANTAGENS DO MCP:
 * - O chat "entende" automaticamente o que cada ferramenta faz
 * - Validação automática dos parâmetros de entrada
 * - Respostas estruturadas e consistentes
 * - Descoberta dinâmica de funcionalidades
 */

/**
 * @description Ferramenta para listar produtos com filtros opcionais
 *
 * CONCEITO MCP: Esta é uma ferramenta de CONSULTA que não modifica dados.
 * O chat pode usar esta ferramenta para entender quais produtos existem
 * no sistema antes de realizar outras operações.
 *
 * EXEMPLO DE USO PELO CHAT:
 * "Mostre-me todos os produtos da categoria Eletrônicos"
 * → O chat automaticamente chama listar_produtos com category: "Eletrônicos"
 */
export const ferramentaListarProdutos: MCPTool = {
  name: "listar_produtos",
  description:
    "Busca e lista produtos do sistema com filtros opcionais por categoria, preço, estoque ou texto",
  inputSchema: {
    type: "object",
    properties: {
      categoria: {
        type: "string",
        description:
          'Filtrar produtos por categoria (ex: "Eletrônicos", "Informática")',
      },
      precoMinimo: {
        type: "number",
        description: "Preço mínimo para filtrar produtos",
      },
      precoMaximo: {
        type: "number",
        description: "Preço máximo para filtrar produtos",
      },
      apenasEmEstoque: {
        type: "boolean",
        description: "Se true, mostra apenas produtos com estoque disponível",
      },
      buscarTexto: {
        type: "string",
        description: "Buscar produtos por nome ou descrição",
      },
    },
    required: [], // Todos os parâmetros são opcionais
  },
};

/**
 * @description Manipulador da ferramenta listar_produtos
 *
 * PADRÃO MCP: Sempre retorna um objeto com 'content' contendo array de objetos
 * com 'type' e 'text'. Isso permite que o chat processe a resposta de forma consistente.
 */
export const manipuladorListarProdutos = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const {
        categoria,
        precoMinimo,
        precoMaximo,
        apenasEmEstoque,
        buscarTexto,
      } = argumentos;

      // Se há filtros, usa o endpoint de busca
      if (
        buscarTexto ||
        categoria ||
        precoMinimo ||
        precoMaximo ||
        apenasEmEstoque !== undefined
      ) {
        const resultado = await clienteApi.searchProducts({
          q: buscarTexto,
          category: categoria,
          minPrice: precoMinimo,
          maxPrice: precoMaximo,
          inStock: apenasEmEstoque,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Encontrados ${resultado.count} produtos com os critérios especificados`,
                  dados: resultado.products,
                  filtrosAplicados: {
                    categoria,
                    precoMinimo,
                    precoMaximo,
                    apenasEmEstoque,
                    buscarTexto,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } else {
        // Busca todos os produtos
        const produtos = await clienteApi.getProducts();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Listados ${produtos.length} produtos do sistema`,
                  dados: produtos,
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
            text: `Erro ao listar produtos: ${
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
 * @description Ferramenta para buscar um produto específico por ID
 *
 * CONCEITO MCP: Ferramenta de consulta detalhada. Útil quando o chat precisa
 * de informações específicas sobre um produto para tomar decisões.
 */
export const ferramentaBuscarProduto: MCPTool = {
  name: "buscar_produto",
  description:
    "Busca informações detalhadas de um produto específico pelo seu ID único",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID único do produto que se deseja consultar",
      },
    },
    required: ["id"],
  },
};

export const manipuladorBuscarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id } = argumentos;
      // Converter string para number se necessário (robustez)
      const idNum = typeof id === "string" ? Number(id) : id;
      const produto = await clienteApi.getProduct(idNum);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto ${id} encontrado com sucesso`,
                dados: produto,
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
            text: `Erro ao buscar produto: ${
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
 * @description Ferramenta para criar um novo produto
 *
 * CONCEITO MCP: Esta é uma ferramenta de AÇÃO que modifica o estado do sistema.
 * O chat pode usar esta ferramenta para adicionar novos produtos baseado
 * em conversas com o usuário.
 *
 * EXEMPLO DE USO PELO CHAT:
 * Usuário: "Adicione um novo smartphone Samsung por R$ 1200"
 * → O chat chama criar_produto com os dados apropriados
 */
export const ferramentaCriarProduto: MCPTool = {
  name: "criar_produto",
  description: "Cria um novo produto no sistema de vendas",
  inputSchema: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome do produto (obrigatório)",
      },
      preco: {
        type: "number",
        description:
          "Preço do produto em reais (obrigatório, deve ser positivo)",
      },
      categoria: {
        type: "string",
        description:
          'Categoria do produto (obrigatório, ex: "Eletrônicos", "Informática")',
      },
      descricao: {
        type: "string",
        description: "Descrição detalhada do produto (obrigatório)",
      },
      estoque: {
        type: "number",
        description:
          "Quantidade inicial em estoque (obrigatório, deve ser não-negativo)",
      },
    },
    required: ["nome", "preco", "categoria", "descricao", "estoque"],
  },
};

export const manipuladorCriarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { nome, preco, categoria, descricao, estoque } = argumentos;

      // Converter strings para numbers se necessário (robustez)
      const precoNum = typeof preco === "string" ? Number(preco) : preco;
      const estoqueNum =
        typeof estoque === "string" ? Number(estoque) : estoque;

      const produto = await clienteApi.createProduct({
        name: nome,
        price: precoNum,
        category: categoria,
        description: descricao,
        stock: estoqueNum,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto "${nome}" criado com sucesso! ID: ${produto.id}`,
                dados: produto,
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
            text: `Erro ao criar produto: ${
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
 * @description Ferramenta para atualizar um produto existente
 *
 * CONCEITO MCP: Ferramenta de MODIFICAÇÃO que permite atualizações parciais.
 * Apenas os campos fornecidos serão atualizados.
 */
export const ferramentaAtualizarProduto: MCPTool = {
  name: "atualizar_produto",
  description:
    "Atualiza informações de um produto existente (atualização parcial permitida)",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID do produto a ser atualizado (obrigatório)",
      },
      nome: {
        type: "string",
        description: "Novo nome do produto (opcional)",
      },
      preco: {
        type: "number",
        description: "Novo preço do produto (opcional, deve ser positivo)",
      },
      categoria: {
        type: "string",
        description: "Nova categoria do produto (opcional)",
      },
      descricao: {
        type: "string",
        description: "Nova descrição do produto (opcional)",
      },
      estoque: {
        type: "number",
        description:
          "Nova quantidade em estoque (opcional, deve ser não-negativo)",
      },
    },
    required: ["id"],
  },
};

export const manipuladorAtualizarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id, ...atualizacoes } = argumentos;

      // Converter id para number se necessário
      const idNum = typeof id === "string" ? Number(id) : id;

      // Remove valores undefined para atualização parcial
      const atualizacoesLimpas = Object.fromEntries(
        Object.entries(atualizacoes).filter(([_, valor]) => valor !== undefined)
      );

      // Mapeia nomes em português para inglês (compatibilidade com API)
      const mapeamento: Record<string, string> = {
        nome: "name",
        preco: "price",
        categoria: "category",
        descricao: "description",
        estoque: "stock",
      };

      const atualizacoesApi = Object.fromEntries(
        Object.entries(atualizacoesLimpas).map(([chave, valor]) => {
          const novaChave = mapeamento[chave] || chave;
          // Converter números que possam vir como string
          const novoValor =
            (novaChave === "price" || novaChave === "stock") &&
            typeof valor === "string"
              ? Number(valor)
              : valor;
          return [novaChave, novoValor];
        })
      );

      const produto = await clienteApi.updateProduct(idNum, atualizacoesApi);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto ${id} atualizado com sucesso`,
                dados: produto,
                camposAtualizados: Object.keys(atualizacoesLimpas),
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
            text: `Erro ao atualizar produto: ${
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
 * @description Ferramenta para listar categorias com estatísticas
 *
 * CONCEITO MCP: Ferramenta de ANÁLISE que fornece visão geral do sistema.
 * Útil para o chat entender a estrutura de dados antes de fazer recomendações.
 */
export const ferramentaListarCategorias: MCPTool = {
  name: "listar_categorias",
  description:
    "Lista todas as categorias de produtos com estatísticas (quantidade, preço médio, estoque total)",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const manipuladorListarCategorias = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async () => {
    try {
      const categorias = await clienteApi.getCategories();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Encontradas ${categorias.length} categorias no sistema`,
                dados: categorias,
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
            text: `Erro ao listar categorias: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};
