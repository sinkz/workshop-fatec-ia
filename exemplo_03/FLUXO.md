# 📊 Diagrama de Fluxo - ReceitasIA

## 🏗️ Componentes

| Componente    | Porta | Tecnologia                   |
| ------------- | ----- | ---------------------------- |
| 🌐 Frontend   | 3000  | Next.js 15 App Router        |
| ⚙️ Backend    | 3000  | Integrado (Server Actions)   |
| 🔌 MCP Client | -     | Interno (lib/mcp-client.ts)  |
| 🤖 IA         | -     | Groq API                     |
| 💾 Database   | -     | Neon PostgreSQL (serverless) |

---

## 📈 Fluxo: Chat com MCP + Neon

```
[Usuário] "Quais receitas doces tenho?"
    │
    ▼
┌─────────────────────┐
│  🌐 Frontend        │  [1] Mensagem
│  (Chat.tsx)         │  ──────────►
│  Client Component   │
└─────────────────────┘
                            ┌─────────────────────┐
                            │  🤖 Groq API        │
                            │  + MCP Tools        │
                            └──────────┬──────────┘
                                       │ [2] Function Call
                                       │ {
                                       │   tool: "buscar_receitas",
                                       │   args: { categoria: "doce" }
                                       │ }
                                       ▼
┌─────────────────────┐      ┌─────────────────────┐
│  🌐 Frontend        │      │  🔌 MCP Client      │
│  (lib/mcp-client)   │ ─────│  (Interno)          │
└─────────────────────┘  [3] └──────────┬──────────┘
                                         │ [4] SQL Query
                                         │ SELECT * FROM receitas
                                         │ WHERE categoria = 'doce'
                                         ▼
                            ┌─────────────────────┐
                            │  💾 Neon PostgreSQL │
                            │  (Serverless)       │
                            └──────────┬──────────┘
                                       │ [5] Retorna receitas
                                       ▼
                            [Resposta sobe]
                                       │
                                       ▼
┌─────────────────────┐
│  🌐 Frontend        │  [6] Exibe receitas
│  Chat renderiza     │      com opção de salvar
└─────────────────────┘
```

---

## 📦 Fluxo: CRUD Manual (Server Actions)

### Listar Receitas

```
┌─────────────────────┐
│  🌐 Page Component  │  [1] Server Component
│  (app/page.tsx)     │      fetch direto!
│  Server Side        │
└──────────┬──────────┘
           │ [2] Query via @neondatabase/serverless
           ▼
┌─────────────────────┐
│  💾 Neon PostgreSQL │
│  SELECT * FROM      │
│  receitas           │
└──────────┬──────────┘
           │ [3] Retorna array
           ▼
┌─────────────────────┐
│  🌐 Page Component  │  [4] Renderiza no servidor
│  SSR automático     │      (props passadas)
└─────────────────────┘
```

### Criar Receita

```
┌─────────────────────┐
│  🌐 Client Form     │  [1] User submits
│  (ReceitaForm.tsx)  │  ──────────►
└─────────────────────┘
                            ┌─────────────────────┐
                            │  ⚙️ Server Action   │
                            │  (actions/receitas) │
                            └──────────┬──────────┘
                                       │ [2] Valida dados
                                       │ [3] INSERT INTO receitas
                                       ▼
                            ┌─────────────────────┐
                            │  💾 Neon PostgreSQL │
                            │  Salva receita      │
                            └──────────┬──────────┘
                                       │ [4] revalidatePath('/')
                                       │ [5] redirect('/')
                                       ▼
┌─────────────────────┐
│  🌐 Frontend        │  [6] Recarrega automático
│  Lista atualizada   │      (Server Component)
└─────────────────────┘
```

---

## 🤖 Fluxo: Sugestão de IA

```
[Usuário] "Sugira uma receita de bolo de chocolate"
    │
    ▼
┌─────────────────────┐
│  🌐 Chat.tsx        │  [1] Mensagem para Groq
│  Client Component   │  ──────────────────────►
└─────────────────────┘
                            ┌─────────────────────┐
                            │  🤖 Groq API        │
                            │  (SEM MCP)          │
                            │  Criatividade pura  │
                            └──────────┬──────────┘
                                       │ [2] Gera receita
                                       │ {
                                       │   nome: "Bolo Fofinho",
                                       │   ingredientes: [...],
                                       │   modo_preparo: "..."
                                       │ }
                                       ▼
┌─────────────────────┐
│  🌐 Frontend        │  [3] Exibe preview
│  ReceitaPreview.tsx │      + botão "Salvar"
└──────────┬──────────┘
           │ [4] User clica "Salvar" (opcional)
           ▼
┌─────────────────────┐
│  ⚙️ Server Action   │  [5] INSERT INTO receitas
│  salvarReceita()    │  ──────────────────────►
└─────────────────────┘
                            ┌─────────────────────┐
                            │  💾 Neon PostgreSQL │
                            │  Salva no banco     │
                            └─────────────────────┘
```

---

## 🔍 Fluxo: MCP Consulta Schema

```
[IA precisa saber estrutura do banco]
    │
    ▼
┌─────────────────────┐
│  🔌 MCP Client      │  [1] Query via MCP
│  listTables()       │  ──────────────────►
└─────────────────────┘
                            ┌─────────────────────┐
                            │  💾 Neon PostgreSQL │
                            │  SELECT * FROM      │
                            │  information_schema │
                            └──────────┬──────────┘
                                       │ [2] Retorna schema
                                       │ {
                                       │   tables: ["receitas"],
                                       │   columns: [...]
                                       │ }
                                       ▼
┌─────────────────────┐
│  🤖 Groq API        │  [3] Entende estrutura
│  "Ah, tem coluna    │      e faz query correta
│   'categoria'"      │
└─────────────────────┘
```

---

## 🔗 Endpoints

| Serviço            | URL                                               | Porta |
| ------------------ | ------------------------------------------------- | ----- |
| Frontend + Backend | `http://localhost:3000`                           | 3000  |
| Server Actions     | `/_next/data/...` (interno)                       | 3000  |
| Neon PostgreSQL    | `postgresql://...neon.tech`                       | -     |
| Groq API           | `https://api.groq.com/openai/v1/chat/completions` | -     |

---

## 🚀 Inicialização

```bash
# Configure .env
NEON_DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...

# Rode (tudo em um!)
npm run dev                        # Porta 3000
```

**Next.js unifica tudo:**

- ✅ Frontend (React)
- ✅ Backend (Server Actions)
- ✅ MCP Client (lib/)
- ✅ Database (Neon via @neondatabase/serverless)

---

## 🎯 Diferenças dos Outros Exemplos

**Exemplo 01:**

```
Frontend → Backend → MCP Server → Database
(Separados, 3 processos)
```

**Exemplo 02:**

```
Frontend → IA (direto)
Frontend → Backend → Mock
(2 processos)
```

**Exemplo 03:**

```
Frontend/Backend (unificado) → MCP Client (interno) → Neon
(1 processo!)
```

**Vantagens:**

- ✅ Menos complexidade
- ✅ Deploy mais fácil (Vercel)
- ✅ MCP integrado no código
- ✅ Server Actions = API automática
- ✅ SSR nativo

---

## 💡 Notas Importantes

### Server Components vs Client Components

**Server (padrão):**

```typescript
// app/page.tsx
export default async function Page() {
  const receitas = await fetch...  // ✅ Direto no servidor
  return <ReceitaCard receitas={receitas} />
}
```

**Client (quando necessário):**

```typescript
"use client"; // ⚠️ Só quando usar hooks, eventos

export function Chat() {
  const [mensagens, setMensagens] = useState([]);
  // ...
}
```

### MCP Client Interno

Diferente dos outros exemplos, aqui **não há MCP Server separado**. O MCP Client está em `lib/mcp-client.ts` e roda no Next.js.

**Por quê?**

- ✅ Mais simples
- ✅ Menos processos
- ✅ Neon suporta queries diretas
- ✅ Ideal para serverless (Vercel)
