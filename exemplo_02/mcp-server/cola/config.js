/**
 * ⚙️ CONFIGURAÇÃO COMPLETA DO MCP SERVER - VERSÃO COLA
 *
 * Define todas as ferramentas (tools) e recursos (resources) disponíveis
 *
 * 5 ferramentas implementadas:
 * - listar_produtos
 * - criar_produto
 * - buscar_produto
 * - editar_produto
 * - excluir_produto
 *
 * 👨‍🏫 ARQUIVO COMPLETO PARA OS ALUNOS COPIAREM
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
    {
      name: "buscar_produto",
      description:
        "Busca um produto específico pelo ID. Use quando o usuário quiser detalhes de um produto específico ou verificar se um produto existe.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: ["number", "string"],
            description: "ID do produto a ser buscado",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "editar_produto",
      description:
        "Edita/atualiza os dados de um produto existente no sistema. Use quando o usuário quiser modificar nome, preço ou categoria de um produto.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: ["number", "string"],
            description: "ID do produto a ser editado",
          },
          nome: {
            type: "string",
            description: "Novo nome do produto (opcional)",
          },
          preco: {
            type: "number",
            description: "Novo preço do produto em reais (opcional)",
          },
          categoria: {
            type: "string",
            description: "Nova categoria do produto (opcional)",
          },
        },
        required: ["id"], // Apenas ID é obrigatório, os outros são opcionais
      },
    },
    {
      name: "excluir_produto",
      description:
        "Remove/exclui um produto do sistema permanentemente. Use quando o usuário quiser deletar um produto específico.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: ["number", "string"],
            description: "ID do produto a ser excluído",
          },
        },
        required: ["id"],
      },
    },
  ],

  // ========== RECURSOS (RESOURCES) ==========
  // Resources fornecem INFORMAÇÕES estáticas (documentação, guias)
  recursos: [
    {
      uri: "produtos://docs/guia-completo",
      nome: "Guia Completo do Sistema de Produtos",
      descricao: "Documentação completa com todas as funcionalidades",
      tipoMime: "text/markdown",
      conteudo: `# Guia Completo do Sistema de Produtos

## 🎯 O que você pode fazer?

### Consultas
- ✅ Listar todos os produtos
- ✅ Buscar produto específico por ID

### Operações
- ✅ Criar novos produtos
- ✅ Editar produtos existentes
- ✅ Excluir produtos

### Análises via IA
- ✅ Consultar informações via chat
- ✅ Filtrar produtos por categoria
- ✅ Encontrar produtos mais caros/baratos

## 📚 Exemplos de uso no chat:

### Listar e Buscar
- "Liste todos os produtos"
- "Mostre o produto 1"
- "Busque o produto com ID 3"
- "Quantos produtos temos?"

### Criar
- "Crie um produto chamado Webcam por R$ 200 na categoria Periféricos"
- "Adicione um Monitor LG por R$ 800"

### Editar
- "Edite o produto 1 para ter o nome 'Notebook Dell XPS'"
- "Atualize o preço do produto 2 para R$ 75"
- "Mude a categoria do produto 3 para 'Hardware'"

### Excluir
- "Exclua o produto 4"
- "Delete o produto com ID 2"
- "Remova o produto 'Mouse Logitech'"

### Análises
- "Qual o produto mais caro?"
- "Liste produtos da categoria Periféricos"
- "Quantos produtos custam menos de R$ 100?"

## 📋 Estrutura de um Produto:

\`\`\`json
{
  "id": 1,                    // Número único (gerado automaticamente)
  "nome": "Notebook Dell",    // Nome do produto
  "preco": 3000,              // Preço em reais
  "categoria": "Informática"  // Categoria do produto
}
\`\`\`

## 🔧 Ferramentas Disponíveis:

1. **listar_produtos** - Lista todos os produtos
2. **criar_produto** - Cria um novo produto
3. **buscar_produto** - Busca um produto por ID
4. **editar_produto** - Edita dados de um produto
5. **excluir_produto** - Remove um produto do sistema

## ⚠️ Observações Importantes:

- Os dados são armazenados em memória (array JavaScript)
- Ao reiniciar o servidor, os dados voltam ao estado inicial
- IDs são únicos e gerados automaticamente
- Ao editar, você pode atualizar apenas os campos desejados
- Ao excluir, o produto é removido permanentemente (nesta sessão)
`,
    },
  ],
};

