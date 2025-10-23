# 📊 Diagrama de Fluxo - Sistema de Vendas

## 🏗️ Componentes

| Componente    | Porta | Tecnologia            |
| ------------- | ----- | --------------------- |
| 🌐 Frontend   | 3000  | React 18 + TypeScript |
| ⚙️ Backend    | 3001  | Express + JSON Server |
| 🔌 MCP Server | stdio | MCP SDK               |
| 🤖 IA         | -     | Groq/Gemini API       |
| 💾 Database   | -     | db.json               |

---

## 📈 Fluxo: Chat com IA + MCP

```
[Usuário] "liste meus produtos"
    │
    ▼
┌─────────────────────┐
│  🌐 Frontend        │  [1] Mensagem + Tools disponíveis
│  (React - 3000)     │  ────────────────────────►
└─────────────────────┘
                                    ┌─────────────────────┐
                                    │  🤖 Groq/Gemini     │
                                    │  (API Externa)      │
                                    └──────────┬──────────┘
                                               │ [2] Function Call
                                               │ {
                                               │   tool: "listar_produtos",
                                               │   args: {}
                                               │ }
                                               ▼
┌─────────────────────┐              ┌─────────────────────┐
│  🌐 Frontend        │  [3] POST    │  ⚙️ Backend         │
│                     │  /mcp/execute│  (Express - 3001)   │
│                     │  ───────────►│                     │
└─────────────────────┘              └──────────┬──────────┘
                                                │ [4] Executa tool
                                                ▼
                                     ┌─────────────────────┐
                                     │  🔌 MCP Server      │
                                     │  (12 Tools)         │
                                     └──────────┬──────────┘
                                                │ [5] Lê dados
                                                ▼
                                     ┌─────────────────────┐
                                     │  💾 db.json         │
                                     │  { products: [...] }│
                                     └──────────┬──────────┘
                                                │ [6] Retorna produtos
                                                ▼
                                     [Resposta sobe pela pilha]
                                                │
                                                ▼
┌─────────────────────┐
│  🌐 Frontend        │  [7] Exibe resposta formatada
│  Chat exibe lista   │
└─────────────────────┘
```

---

## 📦 Fluxo: CRUD Produtos (sem IA)

```
┌─────────────────────┐
│  🌐 Frontend        │  [1] GET /api/products
│  (Products.tsx)     │  ──────────────────────►
└─────────────────────┘
                                    ┌─────────────────────┐
                                    │  ⚙️ Backend         │
                                    │  (porta 3001)       │
                                    └──────────┬──────────┘
                                               │ [2] Read file
                                               ▼
                                    ┌─────────────────────┐
                                    │  💾 db.json         │
                                    │  products: [...]    │
                                    └──────────┬──────────┘
                                               │ [3] Return JSON
                                               ▼
┌─────────────────────┐              ┌─────────────────────┐
│  🌐 Frontend        │  [4] Response│  ⚙️ Backend         │
│  Renderiza tabela   │ ◄────────────│                     │
└─────────────────────┘              └─────────────────────┘
```

---

## 🎭 Fluxo: Multi-Provider (Groq vs Gemini)

```
            [Startup do App]
                 │
                 ▼
        ┌─────────────────┐
        │  config-alunos  │
        │  ia.provider:   │
        │  "groq"|"gemini"│
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ criarProviderIA()│
        │   (Factory)     │
        └────────┬────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌──────────┐          ┌──────────┐
│  Groq    │          │ Gemini   │
│ Provider │          │ Provider │
└──────────┘          └──────────┘
     │                       │
     └───────────┬───────────┘
                 │
                 ▼
         [Mesmo Interface]
            IAProvider
```

---

## 🔗 Endpoints

| Serviço     | URL                                                        | Porta |
| ----------- | ---------------------------------------------------------- | ----- |
| Frontend    | `http://localhost:3000`                                    | 3000  |
| Backend API | `http://localhost:3001/api`                                | 3001  |
| MCP Execute | `http://localhost:3001/mcp/execute`                        | 3001  |
| Groq API    | `https://api.groq.com/openai/v1/chat/completions`          | -     |
| Gemini API  | `https://generativelanguage.googleapis.com/v1beta/models/` | -     |

---

## 🚀 Inicialização

```bash
# Terminal 1 - Backend + Database
cd backend && npm run dev          # Porta 3001

# Terminal 2 - MCP Server
cd mcp-server && npm run dev       # stdio

# Terminal 3 - Frontend
cd frontend && npm run dev         # Porta 3000
```
