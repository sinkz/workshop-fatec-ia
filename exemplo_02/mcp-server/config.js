/**
 * ⚙️ CONFIGURAÇÃO DO MCP SERVER
 *
 * Define as ferramentas (tools) e recursos (resources) disponíveis
 *
 * 👨‍🏫 EDITAR COM OS ALUNOS NO PROJETOR
 */

export default {
  // URL do backend
  backendUrl: "http://localhost:3001",

  // ========== FERRAMENTAS (TOOLS) ==========
  // Tools executam AÇÕES (listar, criar, modificar)
  ferramentas: [
    {
      name: "listar_produtos",
      description: "Lista todos os produtos disponíveis no sistema",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "criar_produto",
      description: "Cria um novo produto no sistema",
      inputSchema: {
        type: "object",
        properties: {
          nome: {
            type: "string",
            description: "Nome do produto",
          },
          preco: {
            type: "number",
            description: "Preço do produto em reais",
          },
          categoria: {
            type: "string",
            description: "Categoria do produto (ex: Informática, Periféricos)",
          },
        },
        required: ["nome", "preco", "categoria"],
      },
    },
  ],

  // ========== RECURSOS (RESOURCES) ==========
  // Resources fornecem INFORMAÇÕES estáticas (documentação, guias)
  recursos: [
    {
      uri: "produtos://docs/guia",
      nome: "Guia do Sistema de Produtos",
      descricao: "Documentação sobre como usar o sistema",
      tipoMime: "text/markdown",
      conteudo: `# Guia do Sistema de Produtos

## O que você pode fazer?

- ✅ Listar todos os produtos
- ✅ Criar novos produtos
- ✅ Consultar informações via chat IA

## Exemplos de uso no chat:

- "Liste os produtos"
- "Crie um produto chamado Webcam por R$ 200 na categoria Periféricos"
- "Quantos produtos temos?"
- "Qual o produto mais caro?"

## Estrutura de um Produto:

- **id**: Número único
- **nome**: Nome do produto
- **preco**: Preço em reais
- **categoria**: Categoria (Informática, Periféricos, etc)
`,
    },
  ],
};
