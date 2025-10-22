import { RecursoMCP, ConteudoRecursoMCP } from "../types/mcp";

/**
 * RECURSOS MCP - EXEMPLO EDUCACIONAL
 *
 * DIFERENÇA ENTRE FERRAMENTAS E RECURSOS:
 *
 * FERRAMENTAS (Tools):
 * ✅ Executam AÇÕES (criar, atualizar, deletar, calcular)
 * ✅ Modificam o estado do sistema
 * ✅ Recebem parâmetros dinâmicos
 * ✅ Exemplo: criar_produto, atualizar_estoque
 *
 * RECURSOS (Resources):
 * ✅ Fornecem INFORMAÇÕES estáticas ou semi-estáticas
 * ✅ NÃO modificam o estado do sistema
 * ✅ Conteúdo relativamente fixo
 * ✅ Exemplo: documentação da API, esquemas de dados, manuais
 *
 * QUANDO USAR CADA UM:
 * - Use FERRAMENTAS quando o chat precisa FAZER algo
 * - Use RECURSOS quando o chat precisa SABER algo
 */

/**
 * Lista de recursos disponíveis no servidor MCP
 */
export const recursosDisponiveis: RecursoMCP[] = [
  {
    uri: "vendas://documentacao/api-schema",
    nome: "Esquema da API de Vendas",
    descricao: "Documentação completa dos endpoints e modelos de dados da API",
    tipoMime: "application/json",
  },
  {
    uri: "vendas://documentacao/guia-uso",
    nome: "Guia de Uso do Sistema",
    descricao: "Manual de como usar o sistema de vendas e suas funcionalidades",
    tipoMime: "text/markdown",
  },
  {
    uri: "vendas://documentacao/exemplos-mcp",
    nome: "Exemplos de Uso MCP",
    descricao: "Exemplos práticos de como usar as ferramentas MCP do sistema",
    tipoMime: "text/markdown",
  },
];

/**
 * Função para obter o conteúdo de um recurso específico
 */
export function obterConteudoRecurso(uri: string): ConteudoRecursoMCP | null {
  switch (uri) {
    case "vendas://documentacao/api-schema":
      return {
        uri,
        tipoMime: "application/json",
        conteudo: JSON.stringify(
          {
            titulo: "API de Vendas - Esquema de Dados",
            versao: "1.0.0",
            modelos: {
              Produto: {
                propriedades: {
                  id: {
                    tipo: "number",
                    descricao: "Identificador único do produto",
                  },
                  nome: { tipo: "string", descricao: "Nome do produto" },
                  preco: { tipo: "number", descricao: "Preço em reais" },
                  categoria: {
                    tipo: "string",
                    descricao: "Categoria do produto",
                  },
                  descricao: {
                    tipo: "string",
                    descricao: "Descrição detalhada",
                  },
                  estoque: {
                    tipo: "number",
                    descricao: "Quantidade em estoque",
                  },
                  criadoEm: {
                    tipo: "string",
                    descricao: "Data de criação (ISO)",
                  },
                },
              },
              Venda: {
                propriedades: {
                  id: {
                    tipo: "number",
                    descricao: "Identificador único da venda",
                  },
                  idProduto: {
                    tipo: "number",
                    descricao: "ID do produto vendido",
                  },
                  quantidade: {
                    tipo: "number",
                    descricao: "Quantidade vendida",
                  },
                  precoTotal: {
                    tipo: "number",
                    descricao: "Valor total da venda",
                  },
                  nomeCliente: { tipo: "string", descricao: "Nome do cliente" },
                  dataVenda: {
                    tipo: "string",
                    descricao: "Data da venda (ISO)",
                  },
                },
              },
            },
            endpoints: {
              produtos: {
                "GET /api/products": "Lista todos os produtos",
                "GET /api/products/:id": "Busca produto por ID",
                "POST /api/products": "Cria novo produto",
                "PUT /api/products/:id": "Atualiza produto",
                "DELETE /api/products/:id": "Remove produto",
              },
              vendas: {
                "GET /api/sales": "Lista todas as vendas",
                "GET /api/sales/:id": "Busca venda por ID",
                "POST /api/sales": "Registra nova venda",
              },
              analytics: {
                "GET /api/analytics/sales": "Análise completa de vendas",
                "GET /api/search/products": "Busca produtos com filtros",
                "GET /api/inventory/summary": "Resumo do inventário",
              },
            },
          },
          null,
          2
        ),
      };

    case "vendas://documentacao/guia-uso":
      return {
        uri,
        tipoMime: "text/markdown",
        conteudo: `# Guia de Uso - Sistema de Vendas

## Visão Geral
Este sistema permite gerenciar produtos e vendas através de uma API REST integrada com MCP.

## Funcionalidades Principais

### 1. Gerenciamento de Produtos
- ✅ Criar novos produtos
- ✅ Listar produtos com filtros
- ✅ Atualizar informações de produtos
- ✅ Controlar estoque

### 2. Controle de Vendas
- ✅ Registrar vendas
- ✅ Consultar histórico de vendas
- ✅ Análises de performance

### 3. Analytics e Relatórios
- ✅ Relatórios de vendas por período
- ✅ Produtos mais vendidos
- ✅ Alertas de estoque baixo
- ✅ Análise por categoria

## Como Usar via MCP

### Exemplo 1: Listar Produtos
\`\`\`
Usuário: "Mostre todos os produtos da categoria Eletrônicos"
→ MCP chama: listar_produtos com categoria: "Eletrônicos"
\`\`\`

### Exemplo 2: Criar Produto
\`\`\`
Usuário: "Adicione um iPhone 15 por R$ 5000 na categoria Eletrônicos"
→ MCP chama: criar_produto com os dados apropriados
\`\`\`

### Exemplo 3: Análise de Vendas
\`\`\`
Usuário: "Como estão as vendas este mês?"
→ MCP chama: analisar_vendas e interpreta os resultados
\`\`\`

## Vantagens do MCP
1. **Contexto Automático**: O chat entende o que cada ferramenta faz
2. **Validação**: Parâmetros são validados automaticamente
3. **Descoberta**: Novas funcionalidades são descobertas dinamicamente
4. **Segurança**: Controle fino sobre operações permitidas
`,
      };

    case "vendas://documentacao/exemplos-mcp":
      return {
        uri,
        tipoMime: "text/markdown",
        conteudo: `# Exemplos Práticos - MCP Tools vs Resources

## O que são MCP Tools?
Tools são **AÇÕES** que o chat pode executar para modificar ou consultar dados.

### Exemplos de Tools:
- \`listar_produtos\` - Busca produtos no sistema
- \`criar_produto\` - Adiciona novo produto
- \`analisar_vendas\` - Gera relatório de vendas
- \`atualizar_estoque\` - Modifica quantidade em estoque

## O que são MCP Resources?
Resources são **INFORMAÇÕES** estáticas que o chat pode consultar para entender o sistema.

### Exemplos de Resources:
- Documentação da API
- Esquemas de dados
- Manuais de uso
- Configurações do sistema

## Quando Usar Cada Um?

### Use TOOLS quando:
- ✅ Precisa FAZER algo (criar, atualizar, deletar)
- ✅ Dados mudam frequentemente
- ✅ Requer parâmetros dinâmicos
- ✅ Modifica estado do sistema

### Use RESOURCES quando:
- ✅ Precisa SABER algo (documentação, esquemas)
- ✅ Informação é relativamente estática
- ✅ Não modifica dados
- ✅ Fornece contexto ou referência

## Exemplo Prático

**Cenário**: Usuário quer adicionar um produto

1. **Resource**: Chat consulta esquema de dados para entender campos obrigatórios
2. **Tool**: Chat usa \`criar_produto\` para adicionar o produto
3. **Tool**: Chat pode usar \`listar_produtos\` para confirmar criação

**Por que não usar apenas REST?**
- MCP fornece **descoberta automática** de funcionalidades
- **Validação automática** de parâmetros
- **Contexto semântico** sobre o que cada operação faz
- **Segurança** através de controle de acesso granular
`,
      };

    default:
      return null;
  }
}
