# 📋 Otimizações e Correções - Workshop FATEC

**Data:** 23 de Outubro de 2025
**Objetivo:** Otimizar TPM do Groq e corrigir problemas de function calling nos 3 exemplos

---

## 📊 Resumo Geral

### Problemas Identificados e Resolvidos

1. ✅ **Rate limit exceeded** (TPM) - Exemplos consumindo muitos tokens
2. ✅ **String vs Number** - Groq enviando números como strings nas ferramentas
3. ✅ **Tool calling loop** - IA ficava presa em loops de ferramentas
4. ✅ **Exemplo 03: projectId faltando** - Erro ao executar SQL no Neon
5. ✅ **Exemplo 03: Busca SQL com =** - Não encontrava receitas sem nome exato
6. ✅ **Exemplo 03: Function calling em texto** - Modelo retornava tool calls como string

---

## 🎯 Exemplo 01 - Sistema de Vendas e Produtos

### Problemas Corrigidos

1. Rate limit com `llama-3.1-8b-instant` (TPM 6000)
2. Groq enviando strings ao invés de números (`preco`, `quantidade`, `id`)
3. Loop infinito de tool calls

### Alterações Realizadas

#### 1. Conversão Robusta de Strings → Números (MCP Server)

**Arquivos modificados:**

- `exemplo_01/mcp-server/src/tools/produtos.ts`
- `exemplo_01/mcp-server/src/tools/vendas.ts`

**Funções ajustadas:**

- `manipuladorBuscarProduto` → converte `id`
- `manipuladorCriarProduto` → converte `preco` e `estoque`
- `manipuladorAtualizarProduto` → converte `id`, `preco`, `estoque`
- `manipuladorBuscarVenda` → converte `id`
- `manipuladorCriarVenda` → converte `idProduto`, `quantidade`, `precoTotal`
- `manipuladorAtualizarEstoque` → converte `idProduto` e `quantidade`
- `manipuladorResumoInventario` → converte `limiteEstoqueBaixo`

**Exemplo de código:**

```typescript
// Antes
const { id } = argumentos;
const produto = await clienteApi.getProduct(id);

// Depois
const { id } = argumentos;
const idNum = typeof id === "string" ? Number(id) : id;
const produto = await clienteApi.getProduct(idNum);
```

#### 2. Atualização do Prompt (Frontend)

**Arquivo:** `exemplo_01/frontend/src/config/config-alunos.ts`

**Adicionado após linha 79:**

```typescript
REGRAS PARA CHAMAR FERRAMENTAS:
- Números (id, price, quantidade, limiteEstoqueBaixo) devem ser enviados como números, não strings
- Exemplo CORRETO: {"id": 5, "limiteEstoqueBaixo": 20}
- Exemplo ERRADO: {"id": "5", "limiteEstoqueBaixo": "20"}
```

#### 3. Otimização de Parâmetros Groq

**Arquivo:** `exemplo_01/frontend/src/config/config-alunos.ts`

```typescript
groq: {
  modelo: "meta-llama/llama-4-scout-17b-16e-instruct", // TPM 30K Free (era qwen3-32b)
  temperatura: 0.2,  // Baixa para precisão
  maxTokens: 600,    // Reduzido de ~1000
}
```

#### 4. Controle de Tool Calling

**Arquivo:** `exemplo_01/frontend/src/services/groq-client.ts`

**Implementações:**

a) **Janela deslizante de histórico:**

```typescript
function criarJanelaHistorico(
  historico: Message[],
  tamanho: number = 8
): Message[] {
  const mensagemSistema = historico.find((m) => m.role === "system");
  const mensagensRecentes = historico
    .filter((m) => m.role !== "system")
    .slice(-tamanho);

  return mensagemSistema
    ? [mensagemSistema, ...mensagensRecentes]
    : mensagensRecentes;
}
```

b) **Two-step function calling:**

```typescript
// 1ª chamada: tool_choice: "auto" (pode chamar ferramenta)
let response = await groq.chat.completions.create({
  tool_choice: "auto",
  // ... outros parâmetros
});

// Se chamou ferramenta, executa e faz 2ª chamada
if (response.choices[0].finish_reason === "tool_calls") {
  // ... executa ferramentas ...

  // 2ª chamada: tool_choice: "none" (força resposta final)
  response = await groq.chat.completions.create({
    tool_choice: "none",
    // ... outros parâmetros
  });
}
```

c) **Truncamento de resultados de ferramentas:**

```typescript
// Limitar conteúdo da ferramenta para ~1000 chars
const resultadoTruncado =
  typeof conteudo === "string" && conteudo.length > 1000
    ? conteudo.slice(0, 1000) + "…"
    : conteudo;
```

d) **Parâmetros adicionais:**

```typescript
top_p: 0.9,
frequency_penalty: 0.2,
presence_penalty: 0.0,
```

#### 5. Compilação

```bash
cd exemplo_01/mcp-server
npm run build
```

---

## 🎯 Exemplo 02 - Produtos Simples

### Problemas Corrigidos

1. Conversão de strings para números no MCP Server
2. Modelo não otimizado para TPM

### Alterações Realizadas

#### 1. Conversão no MCP Server

**Arquivo:** `exemplo_02/mcp-server/index.js`

**Handler stdio (linha ~152):**

```javascript
if (name === "criar_produto") {
  // Converter strings para numbers se necessário (robustez)
  const argsProcessados = {
    nome: args.nome,
    preco: typeof args.preco === "string" ? Number(args.preco) : args.preco,
    categoria: args.categoria,
  };
  const response = await axios.post(`${config.backendUrl}/produtos`, argsProcessados);
```

**Handler HTTP (linha ~334):**

```javascript
} else if (name === "criar_produto") {
  // Converter strings para numbers se necessário (robustez)
  const argsProcessados = {
    nome: args.nome,
    preco: typeof args.preco === "string" ? Number(args.preco) : args.preco,
    categoria: args.categoria,
  };
  const response = await axios.post(`${config.backendUrl}/produtos`, argsProcessados);
```

#### 2. Atualização do Config

**Arquivo:** `exemplo_02/frontend/config.js`

```javascript
groq: {
  token: "seu-token-aqui",
  modelo: "meta-llama/llama-4-scout-17b-16e-instruct", // TPM 30K Free
  temperatura: 0.3,
  maxTokens: 500,
}
```

#### 3. Atualização das Personalidades

**Arquivo:** `exemplo_02/frontend/personalidades/profissional.js`

```javascript
REGRAS IMPORTANTES:
- Quando precisar de dados reais, SEMPRE use as ferramentas disponíveis
- NUNCA invente informações sobre produtos
- Seja preciso e confiável

REGRAS PARA CHAMAR FERRAMENTAS:
- Números (preco) devem ser enviados como números, não strings
- Exemplo CORRETO: {"nome": "Mouse", "preco": 50, "categoria": "Periféricos"}
- Exemplo ERRADO: {"nome": "Mouse", "preco": "50", "categoria": "Periféricos"}
```

**Arquivo:** `exemplo_02/frontend/personalidades/minimalista.js`

```javascript
REGRAS:
- Use ferramentas para dados reais
- Não invente nada
- Seja útil em poucas palavras
- Envie números como números: {"preco": 50} não {"preco": "50"}
```

#### 4. Melhorias Já Existentes

O `exemplo_02/frontend/app.js` já tinha implementado:

- ✅ Janela deslizante (linha 333)
- ✅ Two-step function calling (linhas 338-425)
- ✅ Parâmetros otimizados (linhas 339-344)
- ✅ Truncamento de resultados (linha 416)

---

## 🎯 Exemplo 03 - Receitas com Neon Database

### Problemas Corrigidos

1. `projectId` faltando - erro ao executar SQL
2. Busca SQL com `=` (exato) ao invés de `ILIKE` (parcial)
3. IA criando receitas novas quando deveria buscar no banco
4. Function calling em formato texto ao invés de estruturado

### Alterações Realizadas

#### 1. Atualização de Parâmetros Groq

**Arquivo:** `exemplo_03/frontend/config/app.config.ts`

```typescript
groq: {
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
  model: "llama-3.3-70b-versatile", // TPM 12K Free
  temperature: 0.6,
  maxTokens: 1536, // Reduzido de 2048
}
```

#### 2. Correção do Schema - projectId Opcional

**Arquivo:** `exemplo_03/frontend/lib/groq-client.ts`

**Linhas 195-198 (ADICIONADO):**

```typescript
// Remover projectId dos campos obrigatórios (será injetado automaticamente)
const requiredFields = (paramsSchema.required || []).filter(
  (field: string) => field !== "projectId"
);
```

**Linha 209 (ALTERADO):**

```typescript
required: requiredFields, // ← Antes: paramsSchema.required || []
```

#### 3. Atualização do Prompt do Sistema

**Arquivo:** `exemplo_03/frontend/lib/groq-client.ts`

**SUA MISSÃO (linhas 31-34):**

```typescript
## SUA MISSÃO:
1. Buscar receitas no banco de dados quando solicitado
2. Sugerir novas receitas criativas quando solicitado
3. SEMPRE distinguir entre BUSCAR (banco) vs CRIAR (nova receita)
```

**QUANDO USAR FERRAMENTAS (linhas 36-47):**

```typescript
## QUANDO USAR FERRAMENTAS (run_sql):
✅ USE ferramentas SQL quando o usuário:
- Quiser VER receitas que JÁ EXISTEM no banco
- Usar verbos: "mostre", "liste", "busque", "encontre", "quais", "quantas"
- Exemplos: "mostre receitas de bolo", "quais receitas doces tenho?", "liste todas as receitas"
- Pedir detalhes de uma receita ESPECÍFICA por ID ou título

❌ NÃO USE ferramentas quando o usuário:
- Pedir para CRIAR/SUGERIR/INVENTAR uma receita NOVA
- Usar verbos: "crie", "sugira", "invente", "me dê uma ideia"
- Enviar saudações ou perguntas genéricas
- Apenas conversar
```

**REGRA CRÍTICA - BUSCAR vs CRIAR (linhas 49-65):**

```typescript
## REGRA CRÍTICA - BUSCAR vs CRIAR:
🔍 BUSCAR no banco (usar run_sql):
- "mostre receitas de bolo" → SELECT * FROM receitas WHERE titulo ILIKE '%bolo%'
- "quais receitas eu tenho?" → SELECT * FROM receitas
- "lista receitas doces" → SELECT * FROM receitas WHERE categoria = 'doce'
- "busque torta de chocolate" → SELECT * FROM receitas WHERE titulo ILIKE '%torta%chocolate%'

✨ CRIAR nova receita (SEM ferramenta, gerar JSON):
- "sugira uma receita de bolo" → Gerar receita criativa com JSON
- "crie uma receita vegana" → Gerar receita criativa com JSON
- "me dê uma ideia de sobremesa" → Gerar receita criativa com JSON

🎯 REGRAS IMPORTANTES PARA SQL:
- SEMPRE use ILIKE (case-insensitive) ao invés de = para buscar por título
- Use % para busca parcial: WHERE titulo ILIKE '%termo%'
- Para múltiplas palavras: WHERE titulo ILIKE '%palavra1%' AND titulo ILIKE '%palavra2%'
- Nunca use = para comparar títulos, apenas ILIKE
```

**EXEMPLOS DE CONVERSA (linhas 91-116):**

````typescript
## EXEMPLOS DE CONVERSA:

👤: "Oi!"
🤖: Responde SEM usar ferramentas → "Olá! 👋 Sou o ReceitasIA! Posso BUSCAR receitas que você já salvou no banco ou CRIAR receitas novas para você. O que prefere?"

👤: "Quais receitas doces eu tenho?" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE categoria = 'doce' → "Encontrei 3 receitas doces no seu banco: ..."

👤: "Mostre receitas de bolo" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE titulo ILIKE '%bolo%' → "Achei 2 receitas de bolo salvas: ..."

👤: "Busque torta de chocolate" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE titulo ILIKE '%torta%' AND titulo ILIKE '%chocolate%' → "Encontrei uma Torta de Chocolate! 🍫..."

👤: "Me sugira uma receita de bolo de chocolate" ← CRIAR NOVA
🤖: Gera receita SEM ferramentas → "Aqui está uma deliciosa receita de Bolo de Chocolate! 🍰 [texto explicativo] ```json { "titulo": "Bolo de Chocolate", ... } ```"

👤: "Crie uma receita vegana para mim" ← CRIAR NOVA
🤖: Gera receita SEM ferramentas → "Que tal essa receita vegana? 🌱 [texto] ```json { ... } ```"
````

**REGRAS PARA CHAMAR FERRAMENTAS (linhas 118-125):**

```typescript
## REGRAS PARA CHAMAR FERRAMENTAS:
- Números (tempo_preparo, porcoes) devem ser enviados como números, não strings
- NÃO envie projectId - o sistema injeta automaticamente
- Use ILIKE para buscas de texto: WHERE titulo ILIKE '%termo%'
- Exemplos CORRETOS:
  ✅ {"sql": "SELECT * FROM receitas WHERE titulo ILIKE '%bolo%'"}
  ✅ {"sql": "SELECT * FROM receitas WHERE categoria = 'doce' LIMIT 10"}
  ❌ {"sql": "SELECT * FROM receitas WHERE titulo = 'Bolo de Chocolate'", "projectId": "xxx"}
```

#### 4. Fallback para Function Calling em Texto

**Arquivo:** `exemplo_03/frontend/lib/groq-client.ts`

**Linhas 319-353 (ADICIONADO):**

```typescript
// 🔄 FALLBACK: Detectar tool calls no formato texto (compatibilidade com modelos antigos)
// Alguns modelos retornam: <function/run_sql>{"sql": "..."}</function>
if (
  finalMessage.includes("<function/") &&
  finalMessage.includes("</function>")
) {
  console.warn(
    "⚠️ Modelo retornou tool call em formato texto. Use um modelo com melhor suporte a function calling."
  );

  // Extrair nome da função e argumentos
  const match = finalMessage.match(/<function\/(\w+)>(\{.*?\})<\/function>/);
  if (match) {
    const [, toolName, argsJson] = match;
    console.log(`🔧 Detectado tool call manual: ${toolName}`);

    try {
      const toolArgs = JSON.parse(argsJson);

      // Injetar projectId se necessário
      if (!toolArgs.projectId) {
        toolArgs.projectId = appConfig.neon?.projectId || "auto";
      }

      const neonArgs = { params: toolArgs };
      const result = await executarFerramentaMCP(toolName, neonArgs);

      toolsUsed.push(toolName);

      // Formatar resultado de forma amigável
      if (Array.isArray(result)) {
        finalMessage = `Encontrei ${
          result.length
        } receita(s):\n\n${JSON.stringify(result, null, 2)}`;
      } else {
        finalMessage = JSON.stringify(result, null, 2);
      }
    } catch (error: any) {
      finalMessage = `Erro ao executar ferramenta: ${error.message}`;
    }
  }
}
```

#### 5. Melhorias Já Existentes

O `exemplo_03` já tinha implementado:

- ✅ Controle de tool_choice (auto → none) (linhas 223-313)
- ✅ Parâmetros otimizados (linhas 227-232)
- ✅ Truncamento de resultados (linhas 295-299)
- ✅ Filtro de ferramentas (apenas 4 de 23 tools do Neon)

---

## 📊 Comparação de Modelos Groq

### Exemplo 01 e 02 - Produtos/Vendas

| Modelo                                          | TPM     | RPM    | Function Calling | Recomendação       |
| ----------------------------------------------- | ------- | ------ | ---------------- | ------------------ |
| `llama-3.1-8b-instant`                          | 6K      | 30     | ⚠️ Médio         | ❌ Muito baixo TPM |
| `qwen/qwen3-32b`                                | 18K     | 30     | ✅ Bom           | ⚠️ Alternativa     |
| **`meta-llama/llama-4-scout-17b-16e-instruct`** | **30K** | **30** | **✅ Excelente** | **✅ Recomendado** |

### Exemplo 03 - Receitas/SQL

| Modelo                           | TPM     | RPM    | SQL Complexo     | Function Calling     | Recomendação       |
| -------------------------------- | ------- | ------ | ---------------- | -------------------- | ------------------ |
| **`llama-3.3-70b-versatile`**    | **12K** | **30** | **✅ Excelente** | **⚠️ Formato texto** | **✅ Recomendado** |
| `llama-3.3-70b-specdec`          | 14K     | 30     | ✅ Excelente     | ✅ Estruturado       | ⚠️ Pode dar erro   |
| `llama-4-scout-17b-16e-instruct` | 30K     | 30     | ⚠️ Médio         | ✅ Estruturado       | 🔄 Backup          |

---

## 📖 Conceitos Importantes

### 🌡️ Temperatura

Controla aleatoriedade e criatividade:

- **0.0-0.3** → Preciso, determinístico (vendas, produtos, code)
- **0.4-0.7** → Equilibrado (chat geral, receitas)
- **0.8-1.0** → Criativo, variado (escrita criativa, brainstorming)

**Configuração atual:**

- Exemplo 01: `0.2` (precisão para vendas)
- Exemplo 02: `0.3` (precisão moderada)
- Exemplo 03: `0.6` (balanço SQL + criatividade)

### 🔧 Tool Choice

Controla se o modelo pode usar ferramentas:

- **`"auto"`** → Modelo decide se usa ferramenta ou responde direto
- **`"none"`** → Força modelo a responder (sem ferramentas)
- **`"required"`** → Força modelo a usar ferramenta

**Padrão usado:** Two-step approach

1. `tool_choice: "auto"` → Permite ferramenta
2. Se chamou ferramenta → executa
3. `tool_choice: "none"` → Força resposta final (evita loop)

### 📏 TPM vs RPM

- **TPM (Tokens Per Minute):** Quantos tokens você pode processar por minuto
- **RPM (Requests Per Minute):** Quantas requisições você pode fazer por minuto

**Erro comum:**

```
Rate limit reached: Limit 6000, Used 4801, Requested 2833
```

Significa: `Used (4801) + Requested (2833) = 7634 > Limit (6000)`

**Soluções:**

1. Usar modelo com TPM maior
2. Reduzir `maxTokens`
3. Reduzir `temperatura`
4. Implementar janela deslizante de histórico
5. Truncar resultados de ferramentas

---

## 🧪 Como Testar

### Exemplo 01

```bash
# Terminal 1 - Backend
cd exemplo_01/backend
npm start

# Terminal 2 - MCP Server
cd exemplo_01/mcp-server
npm start

# Terminal 3 - Frontend
cd exemplo_01/frontend
npm run dev
```

**Testes:**

- "Liste os produtos" → Deve usar `listar_produtos`
- "Crie um mouse por 50 reais" → Deve usar `criar_produto` com `preco: 50` (número)
- "Mostre as vendas" → Deve usar `listar_vendas`
- Fazer 3 perguntas seguidas → Não deve dar rate limit

### Exemplo 02

```bash
# Terminal 1 - Backend
cd exemplo_02/backend
node server.js

# Terminal 2 - MCP Server
cd exemplo_02/mcp-server
node index.js

# Terminal 3 - Frontend (abrir index.html no browser)
cd exemplo_02/frontend
# Abrir index.html no navegador
```

**Testes:**

- "Liste os produtos" → Deve mostrar 3 produtos iniciais
- "Crie uma webcam por 200" → Deve criar com `preco: 200` (número)
- Trocar personalidade → Verificar comportamento diferente

### Exemplo 03

```bash
# Terminal 1 - Backend
cd exemplo_03/backend
npm start

# Terminal 2 - Frontend
cd exemplo_03/frontend
npm run dev
```

**Testes:**

- "Oi" → Não deve usar SQL
- "Quais receitas eu tenho?" → Deve usar `SELECT * FROM receitas`
- "Mostre receitas de bolo" → Deve usar `ILIKE '%bolo%'`
- "Busque torta de chocolate" → Deve usar `ILIKE '%torta%'` e encontrar
- "Sugira uma receita de bolo" → NÃO deve usar SQL, deve gerar JSON
- Verificar console → Não deve ter erro de `projectId`

---

## ⚠️ Problemas Conhecidos e Soluções

### Problema: Rate limit exceeded

**Sintoma:**

```json
{
  "error": {
    "message": "Rate limit reached for model ...",
    "code": "rate_limit_exceeded"
  }
}
```

**Soluções:**

1. Usar modelo com TPM maior (`llama-4-scout-17b-16e-instruct`)
2. Reduzir `maxTokens`
3. Implementar janela deslizante (já implementado)
4. Adicionar delay entre requisições

### Problema: tool call validation failed (projectId)

**Sintoma:**

```json
{
  "error": {
    "message": "missing properties: 'projectId'",
    "code": "tool_use_failed"
  }
}
```

**Solução:** Já implementada no exemplo_03

- Schema remove `projectId` de `required`
- Backend injeta `projectId` automaticamente
- Prompt instrui para não enviar `projectId`

### Problema: Function calling em formato texto

**Sintoma:**

```
<function/run_sql>{"sql": "..."}</function>
```

**Solução:** Fallback implementado no exemplo_03 (linhas 319-353)

- Detecta automaticamente formato texto
- Extrai e executa ferramenta
- Retorna resultado formatado

### Problema: IA cria receita ao invés de buscar

**Sintoma:**
Usuário: "busque torta de chocolate"
IA: Gera receita nova com JSON

**Solução:** Prompt atualizado com exemplos claros

- Verbos de busca: "mostre", "liste", "busque" → SQL
- Verbos de criação: "sugira", "crie", "invente" → JSON
- Exemplos práticos com marcadores `← BUSCAR` e `← CRIAR NOVA`

### Problema: SQL não encontra receitas

**Sintoma:**

```sql
SELECT * FROM receitas WHERE titulo = 'Torta de Chocolate'
-- Retorna vazio mesmo existindo "Torta de chocolate"
```

**Solução:** Prompt força uso de `ILIKE`

```sql
SELECT * FROM receitas WHERE titulo ILIKE '%torta%chocolate%'
-- Case-insensitive e busca parcial
```

---

## 📝 Checklist de Configuração

### Exemplo 01

- [ ] `.env` configurado com token Groq
- [ ] Backend rodando (porta 3000)
- [ ] MCP Server rodando (stdio)
- [ ] Frontend rodando (porta 5173)
- [ ] Modelo: `meta-llama/llama-4-scout-17b-16e-instruct`
- [ ] Temperatura: `0.2`
- [ ] MaxTokens: `600`

### Exemplo 02

- [ ] Token Groq em `config.js`
- [ ] Backend rodando (porta 3001)
- [ ] MCP Server rodando (porta 3003)
- [ ] Frontend aberto no navegador
- [ ] Modelo: `meta-llama/llama-4-scout-17b-16e-instruct`
- [ ] Temperatura: `0.3`
- [ ] MaxTokens: `500`
- [ ] Produtos mock inicializados (3 produtos)

### Exemplo 03

- [ ] `.env.local` configurado com Neon DB URL
- [ ] `NEXT_PUBLIC_GROQ_API_KEY` configurado
- [ ] `NEON_API_KEY` configurado no backend
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (Next.js)
- [ ] Modelo: `llama-3.3-70b-versatile`
- [ ] Temperatura: `0.6`
- [ ] MaxTokens: `1536`
- [ ] Tabela `receitas` criada no Neon

---

## 🔄 Changelog

### 23/10/2025

#### Exemplo 01

- ✅ Conversão string→number em todos manipuladores MCP
- ✅ Atualizado modelo para `llama-4-scout-17b-16e-instruct`
- ✅ Prompt com regras de tipos
- ✅ Two-step function calling implementado
- ✅ Janela deslizante de histórico
- ✅ Truncamento de resultados
- ✅ Parâmetros otimizados (temp 0.2, maxTokens 600)
- ✅ Compilação bem-sucedida

#### Exemplo 02

- ✅ Conversão string→number no MCP Server (stdio + HTTP)
- ✅ Atualizado modelo para `llama-4-scout-17b-16e-instruct`
- ✅ Prompts atualizados (profissional + minimalista)
- ✅ Parâmetros otimizados (temp 0.3, maxTokens 500)
- ✅ Backend com mock inicializado (3 produtos)
- ✅ Routes implementadas (GET/POST /produtos)

#### Exemplo 03

- ✅ Schema corrigido (projectId opcional)
- ✅ Prompt completo com BUSCAR vs CRIAR
- ✅ Instruções SQL com ILIKE
- ✅ Exemplos de conversa expandidos
- ✅ Fallback para function calling em texto
- ✅ Modelo mantido: `llama-3.3-70b-versatile`
- ✅ Parâmetros otimizados (temp 0.6, maxTokens 1536)
- ✅ Sem erros de lint

---

## 📚 Referências

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

---

## 💡 Dicas para o Workshop

1. **Demonstre a temperatura:** Mostre diferença entre 0.2 e 0.9
2. **Mostre rate limits:** Forçar erro e explicar TPM
3. **Compare modelos:** Teste com diferentes modelos do Groq
4. **Explique two-step:** Mostrar como evita loops de ferramentas
5. **SQL ILIKE vs =:** Demonstrar diferença na busca
6. **projectId:** Mostrar erro e depois solução automática
7. **Fallback:** Explicar compatibilidade com diferentes modelos

---

## 🎓 Para os Alunos

### O que eles vão ajustar?

**Exemplo 01:** Apenas rodar (já configurado)

**Exemplo 02:**

- Token Groq em `config.js`
- Personalidade em `config.js`
- Entender ferramentas em `config.js` do MCP

**Exemplo 03:**

- Neon Database URL
- Token Groq
- Entender Neon MCP
- Criar tabela `receitas`

### Arquivos que NÃO devem editar

- Código TypeScript compilado (`dist/`)
- `node_modules/`
- Lógica de function calling
- Manipuladores MCP

### Arquivos que PODEM editar

- `.env` / `.env.local`
- `config.js` / `config-alunos.ts` / `app.config.ts`
- `personalidades/*.js` (exemplo 02)
- Prompt do sistema (avançado)

---

**Documento criado por:** IA Assistant (Claude Sonnet 4.5)
**Versão:** 1.0
**Última atualização:** 23/10/2025
