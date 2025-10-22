# 📋 Plano - exemplo_03: Sistema de Receitas com Neon Database

---

## 🎯 Objetivo

Criar um sistema completo de gerenciamento de receitas com:

- Frontend React + Vite + Tailwind + shadcn/ui
- Chat IA (Groq) com Function Calling para CRUD via linguagem natural
- Integração com Neon Database (PostgreSQL serverless)
- Backend Node.js como proxy HTTP ↔ Neon MCP Server (stdio)
- Arquitetura: Frontend → Backend Proxy → Neon MCP Server → Neon Database

---

## 🏗️ Arquitetura

```
┌────────────────────────────────────────────────┐
│  Frontend (React + Vite)         Porta 3000   │
│  ├─ Home: Grid de Receitas (cards)            │
│  ├─ Detalhes: Ver receita completa            │
│  └─ Chat: IA para CRUD via linguagem natural  │
└──────────────────┬─────────────────────────────┘
                   │ HTTP (fetch)
                   │ GET /tools, POST /tools/call
┌──────────────────▼─────────────────────────────┐
│  Backend Express (Proxy MCP)     Porta 3001   │
│  ├─ Conecta ao Neon MCP via stdio             │
│  ├─ Expõe endpoints HTTP para frontend        │
│  └─ .env com Neon credentials (seguro)        │
└──────────────────┬─────────────────────────────┘
                   │ stdio (stdin/stdout)
                   │ JSON-RPC MCP Protocol
┌──────────────────▼─────────────────────────────┐
│  Neon MCP Server (@neondatabase/mcp-server)   │
│  ├─ Tools: execute_sql, create_branch, etc    │
│  ├─ Resources: schema, connections            │
│  └─ Conecta ao Neon Database                  │
└──────────────────┬─────────────────────────────┘
                   │ PostgreSQL Protocol
┌──────────────────▼─────────────────────────────┐
│  Neon Cloud Database (PostgreSQL Serverless)  │
│  └─ Tabela: recipes (id, titulo, ingredientes,│
│     modo_preparo, tempo, dificuldade, imagem)  │
└────────────────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
exemplo_03/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── ReceitaCard.tsx  # Card de receita
│   │   │   ├── ReceitasList.tsx # Grid de receitas
│   │   │   ├── ReceitaForm.tsx  # Formulário criar/editar
│   │   │   ├── ReceitaDetail.tsx# Detalhes completos
│   │   │   └── Chat.tsx         # Chat IA
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Lista de receitas + Chat
│   │   │   └── ReceitaPage.tsx  # Detalhes da receita
│   │   ├── services/
│   │   │   ├── groq.ts          # Cliente Groq
│   │   │   ├── mcp.ts           # Cliente MCP (HTTP)
│   │   │   └── receitas.ts      # API de receitas
│   │   ├── config/
│   │   │   └── config.ts        # ← CONFIGURÁVEL COM ALUNOS
│   │   ├── types/
│   │   │   └── receita.ts       # Tipos TypeScript
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── components.json          # shadcn config
│
├── backend/
│   ├── server.js                # Express + Proxy MCP
│   ├── mcp-client.js            # Cliente MCP (stdio)
│   ├── .env.example             # Template para alunos
│   ├── .env                     # ← Credenciais Neon (gitignored)
│   └── package.json
│
├── docs/
│   ├── GUIA_WORKSHOP.md         # Passo-a-passo para professores
│   ├── SETUP_NEON.md            # Como criar conta e database Neon
│   └── CONFIGURACAO_ALUNOS.md   # O que alunos devem configurar
│
├── README.md
├── COMO_RODAR.md
└── .gitignore
```

---

## 🗃️ Schema do Banco (Neon PostgreSQL)

```sql
-- Tabela: recipes
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  ingredientes TEXT[] NOT NULL,           -- Array de strings
  modo_preparo TEXT NOT NULL,
  tempo_preparo INTEGER,                  -- Em minutos
  porcoes INTEGER,
  dificuldade VARCHAR(20),                -- 'facil', 'medio', 'dificil'
  categoria VARCHAR(50),                  -- 'doce', 'salgado', 'bebida'
  imagem_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dados iniciais (seed)
INSERT INTO recipes (titulo, ingredientes, modo_preparo, tempo_preparo, porcoes, dificuldade, categoria) VALUES
('Bolo de Chocolate', ARRAY['2 ovos', '1 xícara açúcar', '1 xícara farinha', '1/2 xícara chocolate em pó'],
 'Misture tudo e leve ao forno por 30 minutos a 180°C', 40, 8, 'medio', 'doce'),
('Salada Caesar', ARRAY['Alface', 'Frango grelhado', 'Croutons', 'Parmesão', 'Molho Caesar'],
 'Corte a alface, adicione o frango em cubos, croutons e finalize com molho', 15, 2, 'facil', 'salgado');
```

---

## 🛠️ Implementação - Backend (Proxy MCP)

### backend/server.js

```javascript
import express from "express";
import cors from "cors";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let mcpClient = null;

// Conectar ao Neon MCP Server via stdio
async function conectarNeonMCP() {
  console.log("🔌 Conectando ao Neon MCP Server...");

  const transport = new StdioClientTransport({
    command: "npx",
    args: [
      "@neondatabase/mcp-server",
      "--connection-string",
      process.env.NEON_DATABASE_URL,
    ],
    env: {
      ...process.env,
      NEON_API_KEY: process.env.NEON_API_KEY,
    },
  });

  mcpClient = new Client(
    {
      name: "receitas-backend-proxy",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await mcpClient.connect(transport);
  console.log("✅ Conectado ao Neon MCP Server!");
}

// Iniciar conexão na startup
await conectarNeonMCP();

// Endpoint: Listar ferramentas do Neon MCP
app.get("/tools", async (req, res) => {
  try {
    const result = await mcpClient.listTools();
    res.json({ tools: result.tools });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Listar recursos do Neon MCP
app.get("/resources", async (req, res) => {
  try {
    const result = await mcpClient.listResources();
    res.json({ resources: result.resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Executar ferramenta do Neon MCP
app.post("/tools/call", async (req, res) => {
  const { name, arguments: args } = req.body;

  console.log(`🔧 Executando tool Neon MCP: ${name}`);

  try {
    const result = await mcpClient.callTool({
      name: name,
      arguments: args,
    });

    res.json({ result: result.content });
  } catch (error) {
    console.error(`❌ Erro ao executar ${name}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    neonMCP: mcpClient ? "connected" : "disconnected",
  });
});

app.listen(3001, () => {
  console.log("🌉 Backend Proxy MCP rodando na porta 3001");
  console.log("🔗 Conectado ao Neon MCP Server via stdio");
});
```

### backend/package.json

```json
{
  "name": "receitas-backend-proxy",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@modelcontextprotocol/sdk": "^0.5.0",
    "dotenv": "^16.0.3"
  }
}
```

### backend/.env (exemplo)

```env
NEON_DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/receitas"
NEON_API_KEY="seu_api_key_neon_aqui"
```

---

## 🎨 Frontend - React + Vite + Tailwind

### frontend/src/config/config.ts

```typescript
// ⚙️ CONFIGURÁVEL COM OS ALUNOS
export const CONFIG = {
  groq: {
    token: "COLOCAR_SEU_TOKEN_GROQ_AQUI",
    modelo: "qwen/qwen3-32b",
    temperatura: 0.6,
    maxTokens: 2000,
  },

  backend: {
    url: "http://localhost:3001",
  },

  prompt: `Você é um assistente especializado em receitas culinárias.

Você tem acesso a um banco de dados de receitas e pode:
- Listar receitas
- Criar novas receitas
- Editar receitas existentes
- Deletar receitas

Responda sempre em português brasileiro.
Seja criativo ao sugerir receitas.
Use emojis relacionados a comida.

IMPORTANTE: Use SEMPRE as ferramentas disponíveis para acessar dados reais.
NUNCA invente receitas que não existem no banco.`,
};
```

### frontend/src/types/receita.ts

```typescript
export interface Receita {
  id: number;
  titulo: string;
  descricao?: string;
  ingredientes: string[];
  modo_preparo: string;
  tempo_preparo?: number;
  porcoes?: number;
  dificuldade?: "facil" | "medio" | "dificil";
  categoria?: string;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Componentes Principais

**ReceitaCard.tsx**

- Card visual da receita
- Título, imagem, tempo, dificuldade
- Botões: Ver, Editar, Deletar

**ReceitaForm.tsx**

- Formulário para criar/editar
- Campos: título, ingredientes (array), modo de preparo, etc
- Validação

**Chat.tsx**

- Interface de chat com IA
- Integração Groq + MCP
- Function Calling para CRUD

---

## 🤖 Ferramentas MCP do Neon

O Neon MCP Server oficial fornece:

### Tools Principais (usaremos):

- `execute_sql` - Executar qualquer query SQL
- `list_databases` - Listar databases
- `create_branch` - Criar branch do database (opcional)

### Como Usar para Receitas:

**Listar receitas:**

```javascript
{
  name: "execute_sql",
  arguments: {
    query: "SELECT * FROM recipes ORDER BY created_at DESC"
  }
}
```

**Criar receita:**

```javascript
{
  name: "execute_sql",
  arguments: {
    query: `INSERT INTO recipes (titulo, ingredientes, modo_preparo, tempo_preparo, porcoes, dificuldade, categoria)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    params: ["Bolo de Cenoura", ["cenoura", "farinha", "ovos"], "...", 45, 10, "medio", "doce"]
  }
}
```

---

## 🔧 Ferramentas Groq (Function Calling)

Frontend define ferramentas específicas para receitas:

```typescript
const FERRAMENTAS_RECEITAS = [
  {
    type: "function",
    function: {
      name: "listar_receitas",
      description: "Lista todas as receitas disponíveis no banco de dados",
      parameters: {
        type: "object",
        properties: {
          categoria: {
            type: "string",
            description: "Filtrar por categoria (opcional)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "criar_receita",
      description: "Cria uma nova receita no banco de dados",
      parameters: {
        type: "object",
        properties: {
          titulo: { type: "string", description: "Nome da receita" },
          ingredientes: {
            type: "array",
            items: { type: "string" },
            description: "Lista de ingredientes",
          },
          modo_preparo: {
            type: "string",
            description: "Instruções de preparo",
          },
          tempo_preparo: { type: "number", description: "Tempo em minutos" },
          porcoes: { type: "number", description: "Número de porções" },
          dificuldade: {
            type: "string",
            enum: ["facil", "medio", "dificil"],
            description: "Nível de dificuldade",
          },
          categoria: { type: "string", description: "Categoria da receita" },
        },
        required: ["titulo", "ingredientes", "modo_preparo"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "atualizar_receita",
      description: "Atualiza uma receita existente",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "ID da receita" },
          campos: { type: "object", description: "Campos a atualizar" },
        },
        required: ["id", "campos"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deletar_receita",
      description: "Deleta uma receita do banco de dados",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "ID da receita a deletar" },
        },
        required: ["id"],
      },
    },
  },
];
```

**Backend traduz essas ferramentas para SQL via Neon MCP!**

---

## 📝 Passos de Implementação

### 1. Estrutura Base

- Criar pasta `exemplo_03/`
- Estrutura frontend/, backend/, docs/
- .gitignore apropriado
- README inicial

### 2. Setup Neon Database

- Criar conta gratuita no Neon
- Criar projeto "receitas-workshop"
- Criar database "receitas"
- Criar tabela `recipes` com schema
- Inserir dados seed (2-3 receitas)
- Obter connection string
- Obter API key

### 3. Backend (Proxy MCP)

- Inicializar projeto Node.js (type: module)
- Instalar dependências: express, cors, @modelcontextprotocol/sdk, dotenv
- Criar server.js com:
  - Conexão ao Neon MCP Server via stdio
  - Endpoints HTTP: /tools, /resources, /tools/call
  - Mapeamento de ferramentas customizadas → execute_sql
- Criar .env.example
- Testar conexão standalone

### 4. Frontend Base (React + Vite)

- Criar projeto Vite + React + TypeScript
- Instalar Tailwind CSS
- Instalar shadcn/ui
- Configurar roteamento (react-router-dom)
- Criar config.ts para alunos editarem
- Criar tipos TypeScript (Receita)

### 5. Componentes UI

- ReceitaCard: Card responsivo com imagem, título, tempo
- ReceitasList: Grid de cards com loading state
- ReceitaForm: Formulário completo com validação
- ReceitaDetail: Modal/página com receita completa
- Chat: Interface de chat (igual exemplo_02 mas adaptada)

### 6. Integração MCP

- Criar serviço mcp.ts:
  - inicializarMCP() - Busca tools/resources
  - executarFerramenta() - POST /tools/call
  - Mapeamento: listar_receitas → execute_sql SELECT
  - Mapeamento: criar_receita → execute_sql INSERT
  - Mapeamento: atualizar_receita → execute_sql UPDATE
  - Mapeamento: deletar_receita → execute_sql DELETE

### 7. Chat com Groq

- Integrar Groq Function Calling
- Histórico de conversação
- Ferramentas dinâmicas do MCP
- Respostas naturais
- Loading states

### 8. CRUD UI

- Home page com grid de receitas
- Botão "Nova Receita" → Modal/Form
- Botão "Editar" em cada card
- Botão "Deletar" com confirmação
- Auto-refresh após ações

### 9. Documentação

- README.md: Visão geral + Quick Start
- COMO_RODAR.md: Instruções passo-a-passo
- SETUP_NEON.md: Como criar conta e configurar Neon
- CONFIGURACAO_ALUNOS.md: O que editar (config.ts, .env)
- GUIA_WORKSHOP.md: Roteiro para professores

---

## 🎨 UI/UX Proposto

### Home Page (Layout Split)

```
┌─────────────────────────────────────────────────┐
│  🍳 Minhas Receitas        [+ Nova Receita]     │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│  GRID DE RECEITAS    │    CHAT IA               │
│                      │                          │
│  ┌────────────┐      │  💬 Como posso ajudar?   │
│  │ Bolo       │      │                          │
│  │ Chocolate  │      │  👤 Liste receitas doces │
│  │ ⏱️ 40min   │      │                          │
│  │ [Ver][✏️][🗑️]│      │  🤖 Encontrei 3...      │
│  └────────────┘      │                          │
│                      │  👤 Crie receita de      │
│  ┌────────────┐      │  mousse                  │
│  │ Salada     │      │                          │
│  │ Caesar     │      │  🤖 ✅ Receita criada!   │
│  │ ⏱️ 15min   │      │                          │
│  │ [Ver][✏️][🗑️]│      │  ┌─────────────────┐   │
│  └────────────┘      │  │ [Digite...]     │   │
│                      │  └─────────────────┘   │
└──────────────────────┴──────────────────────────┘
```

---

## 🎓 Configurações para Alunos

### O Que os Alunos Vão Editar:

1. **backend/.env**

   ```env
   NEON_DATABASE_URL="postgresql://..."  # ← Copiar do Neon
   NEON_API_KEY="..."                    # ← Copiar do Neon
   ```

2. **frontend/src/config/config.ts**
   ```typescript
   groq: {
     token: "COLOCAR_TOKEN_AQUI",  # ← Token Groq
   }
   ```

**Só isso!** Resto já vem pronto.

---

## 🧪 Funcionalidades do Chat IA

### Exemplos de Comandos:

**Listar:**

```
👤: "Liste todas as receitas"
👤: "Mostre receitas doces"
👤: "Quais receitas tenho de sobremesa?"
```

**Criar:**

```
👤: "Crie uma receita de Mousse de Maracujá com
     ingredientes: 1 lata de leite condensado,
     1 xícara suco de maracujá, 1 lata creme de leite.
     Modo de preparo: Bata tudo no liquidificador e leve
     à geladeira por 2 horas"

🤖: "✅ Receita Mousse de Maracujá criada com sucesso!
     Tempo: 120 min, Dificuldade: fácil"
```

**Editar:**

```
👤: "Mude o tempo do Bolo de Chocolate para 45 minutos"
🤖: "✅ Receita atualizada! Tempo alterado para 45 minutos"
```

**Deletar:**

```
👤: "Delete a receita de Salada Caesar"
🤖: "✅ Receita Salada Caesar removida do banco de dados"
```

---

## 🔄 Fluxo Completo (Exemplo: Criar Receita)

```
1. Usuário no Chat: "Crie receita de Brownie"
              ↓
2. Frontend → Groq (Function Calling)
   └─ Groq decide: usar "criar_receita"
   └─ Groq extrai: {titulo: "Brownie", ingredientes: [...], ...}
              ↓
3. Frontend → POST /tools/call (Backend)
   └─ {name: "criar_receita", arguments: {...}}
              ↓
4. Backend → Neon MCP Server (stdio)
   └─ Traduz para: execute_sql
   └─ Query: INSERT INTO recipes ...
              ↓
5. Neon MCP → Neon Database (PostgreSQL)
   └─ Executa INSERT
   └─ Retorna: {id: 5, titulo: "Brownie", ...}
              ↓
6. Backend → Frontend
   └─ {result: {...}}
              ↓
7. Frontend → Groq (com resultado)
   └─ Groq gera: "✅ Receita Brownie criada!"
              ↓
8. Frontend atualiza lista de receitas
   └─ Novo card aparece no grid
```

---

## 📊 Comparação dos 3 Exemplos

| Aspecto          | exemplo_01             | exemplo_02            | **exemplo_03**              |
| ---------------- | ---------------------- | --------------------- | --------------------------- |
| **Tema**         | Vendas                 | Produtos              | **Receitas**                |
| **Database**     | JSON Server (arquivo)  | Mock (RAM)            | **Neon Postgres (cloud)**   |
| **MCP Server**   | Customizado (12 tools) | Customizado (2 tools) | **Neon Oficial**            |
| **Frontend**     | React + TS             | HTML Vanilla          | **React + Vite + Tailwind** |
| **Backend**      | Express + Proxy JSON   | Express simples       | **Express Proxy MCP**       |
| **UI**           | Bootstrap-like         | CSS puro              | **shadcn/ui**               |
| **Complexidade** | ⭐⭐⭐⭐⭐             | ⭐⭐                  | ⭐⭐⭐⭐                    |
| **Aprende**      | MCP completo           | MCP conceitos         | **Database real + IA**      |

---

## 🎯 Diferenciais do exemplo_03

1. **Database Real (Neon PostgreSQL)**

   - Não é mock ou arquivo
   - PostgreSQL de verdade na nuvem
   - Persiste entre sessões
   - Escalável

2. **MCP Server Oficial**

   - Não é customizado
   - Mantido pelo Neon
   - Produção-ready
   - Mais ferramentas disponíveis

3. **UI Moderna (shadcn/ui)**

   - Componentes profissionais
   - Acessibilidade
   - Responsivo
   - Boas práticas

4. **TypeScript**
   - Type safety
   - Melhor DX
   - Menos erros

---

## ✅ Checklist de Implementação

- [ ] Estrutura de pastas criada
- [ ] Backend proxy MCP implementado
- [ ] Neon Database configurado com schema
- [ ] Frontend React + Vite + Tailwind inicializado
- [ ] shadcn/ui instalado e configurado
- [ ] Componentes UI criados
- [ ] Serviço MCP (frontend) implementado
- [ ] Chat com Groq + Function Calling
- [ ] CRUD via UI funcionando
- [ ] CRUD via Chat funcionando
- [ ] Configurações separadas para alunos
- [ ] Documentação completa
- [ ] Testes manuais realizados
- [ ] README com instruções claras

---

## 🚀 Ordem de Implementação

1. Backend Proxy MCP (base da comunicação)
2. Neon Database setup (dados)
3. Frontend base (estrutura)
4. Componentes UI (interface)
5. Integração MCP (conexão)
6. Chat IA (inteligência)
7. CRUD completo (funcionalidades)
8. Documentação (guias)

---

## 📚 Documentação Necessária

1. **SETUP_NEON.md**

   - Como criar conta gratuita
   - Como criar projeto e database
   - Como obter connection string
   - Como obter API key
   - Prints do console Neon

2. **CONFIGURACAO_ALUNOS.md**

   - Quais arquivos editar
   - O que colocar no .env
   - Como obter token Groq
   - Troubleshooting comum

3. **GUIA_WORKSHOP.md**

   - Cronograma sugerido (4h)
   - O que explicar em cada etapa
   - Demos ao vivo
   - Checkpoints

4. **COMO_RODAR.md**
   - Setup inicial
   - Comandos para rodar
   - Como testar se funcionou

---

**🎯 Este plano está aprovado? Posso começar a implementar?**
