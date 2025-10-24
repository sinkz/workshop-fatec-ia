/**
 * ⚙️ CONFIGURAÇÃO DO MCP SERVER - ESQUELETO PARA O WORKSHOP
 *
 * Define as ferramentas (tools) e recursos (resources) disponíveis
 *
 * 👨‍🏫 CONSTRUIR COM OS ALUNOS NO PROJETOR
 * 💡 DICA: Veja o arquivo cola/config.js para a versão completa
 */

export default {
  // URL do backend
  backendUrl: "http://localhost:3001",

  // ========== FERRAMENTAS (TOOLS) ==========
  // Tools executam AÇÕES (listar, criar, modificar)
  ferramentas: [
    // 👨‍🏫 FERRAMENTA 1: LISTAR PRODUTOS
    // TODO: Adicionar configuração para listar_produtos
    // name: "listar_produtos"
    // description: "Lista todos os produtos..."
    // inputSchema: sem propriedades, sem required

    // 👨‍🏫 FERRAMENTA 2: CRIAR PRODUTO
    // TODO: Adicionar configuração para criar_produto
    // name: "criar_produto"
    // description: "Cria um novo produto..."
    // inputSchema properties: nome (string), preco (number), categoria (string)
    // required: ["nome", "preco", "categoria"]
  ],

  // ========== RECURSOS (RESOURCES) ==========
  // Resources fornecem INFORMAÇÕES estáticas (documentação, guias)
  recursos: [
    // 👨‍🏫 RECURSO 1: DOCUMENTAÇÃO
    // TODO: Adicionar recurso com guia do sistema
    // uri: "produtos://docs/guia"
    // nome: "Guia do Sistema de Produtos"
    // descricao: "Documentação sobre como usar o sistema"
    // tipoMime: "text/markdown"
    // conteudo: `# Guia do Sistema...`
  ],
};

