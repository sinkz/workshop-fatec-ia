# 📚 Como Funcionam os MCP Resources

Explicação detalhada de como os Resources (recursos) são usados na integração MCP.

---

## 🎯 O Que São Resources?

**Resources** são **dados estáticos** que fornecem **contexto** para a IA:

- 📖 Documentação
- 📋 Políticas da empresa
- 📝 Manuais de uso
- ℹ️ Informações de referência

**Diferente de Tools:**

- **Tools** = Executam AÇÕES (criar, listar, deletar)
- **Resources** = Fornecem INFORMAÇÕES (consulta, referência)

---

## 🏗️ Arquitetura dos Resources

```
┌────────────────────────────────────────────────┐
│  1. INICIALIZAÇÃO (window.onload)             │
│                                                │
│  Frontend chama:                               │
│  └─ inicializarMCP()                           │
│     ├─ GET /tools → Busca ferramentas          │
│     └─ GET /resources → Busca lista de recursos│
│        └─ Para cada resource:                  │
│           GET /resources/:uri → Busca conteúdo │
│           └─ Adiciona ao prompt do sistema     │
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  2. PROMPT DO SISTEMA (modificado)            │
│                                                │
│  Antes:                                        │
│  "Você é um assistente..."                    │
│                                                │
│  Depois:                                       │
│  "Você é um assistente..."                    │
│  === DOCUMENTAÇÃO DO SISTEMA ===              │
│  - Guia do Sistema de Produtos                │
│  - Categorias aceitas: Informática...         │
│  - Preço mínimo: R$ 10,00                     │
│  - etc...                                      │
└────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────┐
│  3. CONVERSA COM GROQ                         │
│                                                │
│  Groq recebe:                                  │
│  ├─ messages[0] (system): Prompt + Resources  │
│  ├─ messages[1...] (user/assistant): Chat     │
│  └─ tools: Ferramentas disponíveis            │
│                                                │
│  Resultado:                                    │
│  → IA tem CONTEXTO PERMANENTE da documentação │
│  → Respostas mais informadas                  │
│  → Pode referenciar políticas/regras          │
└────────────────────────────────────────────────┘
```

---

## 📝 Implementação

### 1. MCP Server - Endpoint para Ler Resource

**Arquivo:** `mcp-server/index.js`

```javascript
// Endpoint: Ler conteúdo de um recurso específico
httpApp.get("/resources/:uri", async (req, res) => {
  const uri = decodeURIComponent(req.params.uri);

  // Buscar recurso na configuração
  const recurso = config.recursos.find((r) => r.uri === uri);

  if (!recurso) {
    return res.status(404).json({ error: `Recurso ${uri} não encontrado` });
  }

  // Retornar conteúdo
  res.json({
    uri: recurso.uri,
    name: recurso.nome,
    mimeType: recurso.tipoMime,
    content: recurso.conteudo, // ← Conteúdo completo do resource
  });
});
```

---

### 2. Frontend - Buscar e Usar Resources

**Arquivo:** `frontend/app.js`

```javascript
async function inicializarMCP() {
  // ... buscar tools ...

  // Buscar resources
  const resourcesResponse = await fetch("http://localhost:3003/resources");
  const resourcesData = await resourcesResponse.json();

  // Para cada resource, buscar conteúdo
  let contextosAdicionais = "\n\n=== DOCUMENTAÇÃO DO SISTEMA ===\n\n";

  for (const resource of resourcesData.resources) {
    const uriEncoded = encodeURIComponent(resource.uri);
    const contentResponse = await fetch(
      `http://localhost:3003/resources/${uriEncoded}`
    );

    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      contextosAdicionais += `\n--- ${contentData.name} ---\n`;
      contextosAdicionais += `${contentData.content}\n`;
    }
  }

  // Adicionar ao prompt do sistema (primeira mensagem do histórico)
  if (historicoGroq[0].role === "system") {
    historicoGroq[0].content += contextosAdicionais;
  }
}
```

---

## 🔍 Exemplo Prático

### Resource Definido (mcp-server/config.js)

```javascript
{
  uri: "produtos://docs/guia",
  nome: "Guia do Sistema de Produtos",
  tipoMime: "text/plain",
  conteudo: `
    SISTEMA DE PRODUTOS - GUIA RÁPIDO

    Categorias aceitas:
    - Informática
    - Periféricos
    - Acessórios

    Regras de preço:
    - Mínimo: R$ 10,00
    - Máximo: R$ 10.000,00

    Campos obrigatórios:
    - nome (string)
    - preco (number)
    - categoria (string)
  `
}
```

---

### O Que Acontece

**1. Frontend busca resource:**

```javascript
GET http://localhost:3003/resources
// Resposta: [{ uri: "produtos://docs/guia", name: "Guia...", ... }]
```

**2. Frontend busca conteúdo:**

```javascript
GET http://localhost:3003/resources/produtos%3A%2F%2Fdocs%2Fguia
// Resposta: { content: "SISTEMA DE PRODUTOS - GUIA..." }
```

**3. Frontend adiciona ao prompt:**

```javascript
historicoGroq[0].content = `
  Você é um assistente...

  === DOCUMENTAÇÃO DO SISTEMA ===

  --- Guia do Sistema de Produtos ---
  SISTEMA DE PRODUTOS - GUIA RÁPIDO
  Categorias aceitas: Informática, Periféricos...
`;
```

**4. Groq recebe contexto:**

```
Usuário: "Quais categorias posso usar?"
Groq: (lê o resource no prompt) "As categorias aceitas são: Informática, Periféricos e Acessórios"
```

---

## 💡 Casos de Uso

### Caso 1: Perguntas sobre Regras

**Sem resource:**

```
Usuário: "Qual o preço mínimo?"
IA: "Desculpe, não tenho essa informação" (alucinação ou erro)
```

**Com resource:**

```
Usuário: "Qual o preço mínimo?"
IA: "O preço mínimo é R$ 10,00" (leu do resource!)
```

---

### Caso 2: Validações Inteligentes

**Sem resource:**

```
Usuário: "Crie produto por R$ 5"
IA: Tenta criar (pode falhar)
```

**Com resource:**

```
Usuário: "Crie produto por R$ 5"
IA: "O preço mínimo permitido é R$ 10,00. Por favor, ajuste o valor."
```

---

### Caso 3: Sugestões Contextualizadas

**Sem resource:**

```
Usuário: "Que categoria usar?"
IA: Inventa categorias aleatórias
```

**Com resource:**

```
Usuário: "Que categoria usar?"
IA: "As categorias disponíveis são: Informática, Periféricos e Acessórios"
```

---

## 🔄 Fluxo Completo (Tools + Resources)

```
INICIALIZAÇÃO:
┌─────────────────────────────────────┐
│ Frontend.inicializarMCP()           │
├─────────────────────────────────────┤
│ 1. GET /tools                       │
│    → Recebe ferramentas             │
│    → Envia para Groq (Function Call)│
│                                     │
│ 2. GET /resources                   │
│    → Recebe lista de resources      │
│                                     │
│ 3. GET /resources/:uri (cada um)    │
│    → Recebe conteúdo                │
│    → Adiciona ao prompt do sistema  │
└─────────────────────────────────────┘

CONVERSA:
┌─────────────────────────────────────┐
│ Usuário: "Liste produtos"           │
├─────────────────────────────────────┤
│ 1. Groq analisa:                    │
│    ├─ Histórico (com resources!)    │
│    └─ Tools disponíveis             │
│                                     │
│ 2. Groq decide:                     │
│    └─ tool_call: listar_produtos    │
│                                     │
│ 3. Frontend executa:                │
│    └─ POST /tools/call              │
│                                     │
│ 4. MCP Server orquestra:            │
│    └─ GET /produtos (backend)       │
│                                     │
│ 5. Groq responde:                   │
│    └─ "Temos 3 produtos: ..."       │
└─────────────────────────────────────┘
```

---

## 🎓 Benefícios para o Workshop

### O Que os Alunos Aprendem

1. **Tools vs Resources:**

   - Tools executam ações
   - Resources fornecem contexto

2. **RAG (Retrieval-Augmented Generation):**

   - IA tem acesso a documentação real
   - Respostas baseadas em dados concretos
   - Sem alucinação

3. **Prompt Engineering:**

   - Como incluir contexto no system prompt
   - Diferença entre prompt estático e dinâmico

4. **Protocolo MCP Completo:**
   - Tools para ações
   - Resources para informações
   - Ambos via HTTP do MCP Server

---

## 📊 Comparação

| Aspecto            | Sem Resources          | Com Resources           |
| ------------------ | ---------------------- | ----------------------- |
| **Contexto**       | Apenas prompt básico   | Prompt + documentação   |
| **Precisão**       | Média (pode alucinar)  | Alta (baseada em docs)  |
| **Manutenção**     | Hardcoded no config.js | Dinâmico do MCP         |
| **Escalabilidade** | Difícil                | Fácil (adiciona no MCP) |

---

## ✅ Resultado

Agora a IA tem:

1. **Tools** - Para executar ações (criar, listar produtos)
2. **Resources** - Para consultar informações (guias, políticas)

**Sistema completo:** IA inteligente + informada + conectada com dados reais!

---

## 🧪 Como Testar

### Teste de Resource

**Pergunte algo sobre regras do sistema:**

```
Usuário: "Quais são as categorias de produtos disponíveis?"
```

**IA deve responder baseada no resource:**

```
IA: "As categorias disponíveis são: Informática, Periféricos e Acessórios"
```

**Verifique no console:**

```
✅ Resource "Guia do Sistema de Produtos" carregado
✅ Contexto dos recursos adicionado ao prompt do sistema
```

**Terminal do MCP Server deve mostrar:**

```
📋 HTTP GET /tools - Listando ferramentas
📚 HTTP GET /resources - Listando recursos
📖 HTTP GET /resources/produtos://docs/guia - Lendo recurso
✅ Recurso Guia do Sistema de Produtos encontrado
```

---

## 🎉 Conclusão

**Integração MCP completa agora inclui:**

- ✅ Tools dinâmicos (ações executáveis)
- ✅ Resources dinâmicos (documentação e contexto)
- ✅ Frontend busca ambos do MCP Server
- ✅ IA tem ferramentas + contexto
- ✅ Sistema inteligente e informado

**MCP usado de verdade com todos os conceitos! 🚀**
