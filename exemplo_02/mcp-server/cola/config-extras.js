/**
 * ⚙️ CONFIGURAÇÃO EXTRA DO MCP SERVER
 *
 * FERRAMENTAS ADICIONAIS para exercício dos alunos:
 * - editar_produto
 * - excluir_produto
 * - buscar_produto
 *
 * 👨‍🏫 EXERCÍCIO: Os alunos devem:
 * 1. Copiar estas configurações para o config.js
 * 2. Adicionar os handlers no index.js (ver cola/handlers-extras.js)
 * 3. Testar com a IA via frontend
 */

// ========== FERRAMENTA 3: EDITAR PRODUTO ==========
export const editarProdutoTool = {
  name: "editar_produto",
  description:
    "Edita/atualiza os dados de um produto existente no sistema. Use quando o usuário quiser modificar nome, preço ou categoria de um produto.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
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
};

// ========== FERRAMENTA 4: EXCLUIR PRODUTO ==========
export const excluirProdutoTool = {
  name: "excluir_produto",
  description:
    "Remove/exclui um produto do sistema permanentemente. Use quando o usuário quiser deletar um produto específico.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID do produto a ser excluído",
      },
    },
    required: ["id"],
  },
};

// ========== FERRAMENTA 5: BUSCAR PRODUTO ==========
export const buscarProdutoTool = {
  name: "buscar_produto",
  description:
    "Busca um produto específico pelo ID. Use quando o usuário quiser detalhes de um produto específico ou verificar se um produto existe.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID do produto a ser buscado",
      },
    },
    required: ["id"],
  },
};

// ========== CONFIGURAÇÃO COMPLETA ==========
/**
 * Array completo de ferramentas para adicionar ao config.js
 * 
 * COMO USAR:
 * 1. Abrir config.js
 * 2. Na seção "ferramentas", adicionar estes 3 objetos
 */
export const ferramentasExtras = [
  editarProdutoTool,
  excluirProdutoTool,
  buscarProdutoTool,
];

// ========== RECURSO EXTRA: DOCUMENTAÇÃO ==========
/**
 * Documentação atualizada incluindo as novas ferramentas
 */
export const recursoDocumentacaoAtualizada = {
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
};

/**
 * 🎯 INSTRUÇÕES PARA OS ALUNOS
 * =============================
 * 
 * PASSO 1 - Atualizar config.js:
 * ================================
 * Adicionar as 3 novas ferramentas ao array "ferramentas":
 * 
 * ferramentas: [
 *   // ... ferramentas existentes ...
 *   {
 *     name: "buscar_produto",
 *     description: "Busca um produto específico pelo ID...",
 *     inputSchema: { ... }
 *   },
 *   {
 *     name: "editar_produto",
 *     description: "Edita/atualiza os dados de um produto...",
 *     inputSchema: { ... }
 *   },
 *   {
 *     name: "excluir_produto",
 *     description: "Remove/exclui um produto do sistema...",
 *     inputSchema: { ... }
 *   }
 * ]
 * 
 * PASSO 2 - Adicionar handlers no index.js:
 * ===========================================
 * Ver arquivo: handlers-extras.js
 * 
 * PASSO 3 - Testar:
 * ==================
 * 1. Reiniciar MCP Server: npm run dev
 * 2. Reiniciar Backend: npm start
 * 3. Abrir frontend e testar comandos
 * 
 * Exemplos de comandos no chat:
 * - "Busque o produto 1"
 * - "Edite o produto 1 para custar R$ 3200"
 * - "Exclua o produto 4"
 */

