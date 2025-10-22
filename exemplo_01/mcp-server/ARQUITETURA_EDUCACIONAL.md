# Arquitetura Educacional - MCP Server em Português

## 🎯 Objetivo Educacional

Este MCP Server foi projetado especificamente para o **mini curso de IA aplicada**, com foco na facilidade de compreensão.

## 🏗️ Arquitetura de Tradução

### Interface em Português (Chat) ↔ API em Inglês (Backend)

```
Chat (Português)     MCP Tools (Tradução)     Backend API (Inglês)
┌─────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│ nome: "iPhone"  │  │ nome → name         │  │ name: "iPhone"   │
│ preco: 5000     │→ │ preco → price       │→ │ price: 5000      │
│ categoria: "..."│  │ categoria → category│  │ category: "..."  │
└─────────────────┘  └─────────────────────┘  └──────────────────┘
```

### Por que essa abordagem?

1. **👨‍🎓 Facilidade para Alunos**: Interface em português é mais intuitiva
2. **🌍 Padrões Internacionais**: Backend mantém nomenclatura padrão da indústria
3. **🔄 Flexibilidade**: Fácil de adaptar para outros idiomas no futuro
4. **📚 Aprendizado**: Demonstra boas práticas de internacionalização

## 📁 Estrutura de Arquivos

```
src/
├── tools/
│   ├── produtos.ts    ✅ Ferramentas de produtos em PT-BR
│   └── vendas.ts      ✅ Ferramentas de vendas em PT-BR
├── resources/
│   └── documentacao.ts ✅ Recursos educacionais em PT-BR
├── utils/
│   └── api-client.ts   🔧 Cliente da API (mantém inglês)
└── types/
    └── mcp.ts         📝 Tipos com documentação em PT-BR
```

## 🛠️ Ferramentas Disponíveis

### 📦 Produtos

- `listar_produtos` - Lista produtos com filtros
- `buscar_produto` - Busca produto por ID
- `criar_produto` - Cria novo produto
- `atualizar_produto` - Atualiza produto existente
- `listar_categorias` - Lista categorias com estatísticas

### 💰 Vendas

- `listar_vendas` - Lista vendas com filtros de data
- `buscar_venda` - Busca venda por ID
- `criar_venda` - Registra nova venda
- `analisar_vendas` - Gera análise completa
- `resumo_inventario` - Resumo de estoque
- `atualizar_estoque` - Atualiza estoque de produtos

### 🔧 Sistema

- `verificar_saude_sistema` - Verifica se a API está funcionando

## 📚 Recursos Educacionais

### 📖 Documentação Disponível

1. **Esquema da API** - Estrutura completa dos dados
2. **Guia de Uso** - Como usar o sistema
3. **Exemplos MCP** - Diferença entre Tools e Resources

## 🎓 Para os Alunos

### Como Modificar uma Ferramenta

1. **Abra o arquivo** `src/tools/produtos.ts` ou `src/tools/vendas.ts`
2. **Encontre a ferramenta** que deseja modificar
3. **Altere a descrição** ou parâmetros conforme necessário
4. **Mantenha o mapeamento** português → inglês na implementação

### Exemplo de Modificação

```typescript
// ❌ NÃO faça isso (quebra a API)
const produto = await clienteApi.createProduct({
  nome: nome, // API espera 'name', não 'nome'
  preco: preco, // API espera 'price', não 'preco'
});

// ✅ FAÇA isso (mantém compatibilidade)
const produto = await clienteApi.createProduct({
  name: nome, // Traduz português → inglês
  price: preco, // Traduz português → inglês
  category: categoria,
  description: descricao,
  stock: estoque,
});
```

## 🚀 Vantagens desta Arquitetura

1. **🇧🇷 Acessibilidade**: Alunos brasileiros entendem facilmente
2. **🔧 Manutenibilidade**: Código bem organizado e documentado
3. **📈 Escalabilidade**: Fácil adicionar novas ferramentas
4. **🎯 Educacional**: Demonstra boas práticas de desenvolvimento
5. **🌐 Profissional**: Prepara para projetos internacionais

## 💡 Dicas para o Curso

- **Foque nas ferramentas em português** para explicar conceitos
- **Use os recursos** para mostrar diferença entre Tools e Resources
- **Demonstre o mapeamento** português ↔ inglês como boa prática
- **Incentive experimentação** com novos parâmetros e descrições
