/**
 * 🛠️ DEFINIÇÕES DE FERRAMENTAS MCP PARA GROQ FUNCTION CALLING
 *
 * Schemas completos das ferramentas no formato Groq/OpenAI
 * O modelo Groq decide AUTOMATICAMENTE qual ferramenta usar
 */

import { GroqTool } from "./groq-client";

export const FERRAMENTAS_MCP: GroqTool[] = [
  // ========== FERRAMENTAS DE PRODUTOS ==========
  {
    type: "function",
    function: {
      name: "listar_produtos",
      description:
        "Lista todos os produtos disponíveis no sistema. Use para consultar produtos, verificar estoque, ver preços ou buscar produtos por categoria.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buscar_produto",
      description:
        "Busca um produto específico pelo seu ID. Use quando precisar de informações detalhadas sobre um produto específico.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID único do produto a ser buscado",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "criar_produto",
      description:
        "Cria um novo produto no sistema. Use quando o usuário pedir para adicionar, criar ou cadastrar um produto.",
      parameters: {
        type: "object",
        properties: {
          nome: {
            type: "string",
            description: "Nome do produto",
          },
          preco: {
            type: "number",
            description: "Preço do produto em reais (número positivo)",
          },
          categoria: {
            type: "string",
            description:
              "Categoria do produto (ex: Eletrônicos, Informática, Áudio)",
          },
          descricao: {
            type: "string",
            description: "Descrição detalhada do produto",
          },
          estoque: {
            type: "number",
            description: "Quantidade em estoque (número inteiro não-negativo)",
          },
        },
        required: ["nome", "preco", "categoria", "descricao", "estoque"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "atualizar_produto",
      description:
        "Atualiza informações de um produto existente. Use quando precisar modificar nome, preço, descrição ou estoque de um produto.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID do produto a ser atualizado",
          },
          nome: {
            type: "string",
            description: "Novo nome do produto (opcional)",
          },
          preco: {
            type: "number",
            description: "Novo preço do produto (opcional)",
          },
          categoria: {
            type: "string",
            description: "Nova categoria (opcional)",
          },
          descricao: {
            type: "string",
            description: "Nova descrição (opcional)",
          },
          estoque: {
            type: "number",
            description: "Nova quantidade em estoque (opcional)",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listar_categorias",
      description:
        "Lista todas as categorias de produtos com estatísticas (quantidade de produtos, preço médio, estoque total).",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  // ========== FERRAMENTAS DE VENDAS ==========
  {
    type: "function",
    function: {
      name: "listar_vendas",
      description:
        "Lista todas as vendas registradas no sistema. Use para consultar histórico de vendas.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buscar_venda",
      description:
        "Busca uma venda específica pelo seu ID. Use quando precisar de detalhes de uma venda específica.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID único da venda",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "criar_venda",
      description:
        "Registra uma nova venda no sistema. Use quando o usuário quiser registrar ou criar uma venda.",
      parameters: {
        type: "object",
        properties: {
          idProduto: {
            type: "number",
            description: "ID do produto sendo vendido",
          },
          quantidade: {
            type: "number",
            description: "Quantidade de produtos vendidos",
          },
          nomeCliente: {
            type: "string",
            description: "Nome do cliente",
          },
          precoTotal: {
            type: "number",
            description:
              "Preço total da venda (opcional, será calculado automaticamente se não fornecido)",
          },
        },
        required: ["idProduto", "quantidade", "nomeCliente"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analisar_vendas",
      description:
        "Gera análise completa de vendas incluindo receita total, produtos mais vendidos, vendas por categoria e métricas de performance.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "resumo_inventario",
      description:
        "Gera resumo completo do inventário com alertas de estoque baixo, valor total em estoque e estatísticas gerais.",
      parameters: {
        type: "object",
        properties: {
          limiteEstoqueBaixo: {
            type: "number",
            description:
              "Limite para considerar estoque baixo (padrão: 20 unidades)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "atualizar_estoque",
      description:
        "Atualiza o estoque de um produto. Use para adicionar, subtrair ou definir quantidade em estoque.",
      parameters: {
        type: "object",
        properties: {
          idProduto: {
            type: "number",
            description: "ID do produto",
          },
          quantidade: {
            type: "number",
            description: "Quantidade para a operação",
          },
          operacao: {
            type: "string",
            enum: ["adicionar", "subtrair", "definir"],
            description:
              'Tipo de operação: "adicionar" (aumentar), "subtrair" (diminuir) ou "definir" (quantidade exata)',
          },
          motivo: {
            type: "string",
            description: "Motivo da alteração (opcional, para auditoria)",
          },
        },
        required: ["idProduto", "quantidade", "operacao"],
      },
    },
  },
];

/**
 * Buscar ferramenta por nome
 */
export function buscarFerramenta(nome: string): GroqTool | undefined {
  return FERRAMENTAS_MCP.find((f) => f.function.name === nome);
}

/**
 * Listar nomes de todas as ferramentas
 */
export function listarNomesFerramentas(): string[] {
  return FERRAMENTAS_MCP.map((f) => f.function.name);
}
