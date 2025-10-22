# 📊 Diagrama de Fluxo - Sistema Ultra-Simples

## 🏗️ Componentes

| Componente    | Porta | Tecnologia           |
| ------------- | ----- | -------------------- |
| 🌐 Frontend   | local | HTML/CSS/JS puro     |
| ⚙️ Backend    | 3001  | Express minimalista  |
| 🔌 MCP Server | stdio | 2 tools + 1 resource |
| 🤖 IA         | -     | Groq API             |
| 💾 Database   | -     | Mock em memória      |

---

## 📈 Fluxo: Chat Direto (Frontend → Groq)

```
[Usuário] "olá, como você está?"
    │
    ▼
┌─────────────────────┐
│  🌐 Frontend        │  [1] Mensagem + Personalidade
│  (HTML/JS puro)     │  ───────────────────────►
│  app.js             │
└─────────────────────┘
                                    ┌─────────────────────┐
                                    │  🤖 Groq API        │
                                    │  (Direto!)          │
                                    │                     │
                                    │  + System Prompt    │
                                    │  + Personalidade    │
                                    └──────────┬──────────┘
                                               │ [2] Resposta
                                               ▼
┌─────────────────────┐
│  🌐 Frontend        │  [3] Exibe no chat
│  Renderiza resposta │
└─────────────────────┘
```

**Nota:** Chat NÃO usa backend! Vai direto para Groq API.

---

## 📦 Fluxo: Listar Produtos (via Backend)

```
[Usuário] clica em "Ver Produtos"
    │
    ▼
┌─────────────────────┐
│  🌐 Frontend        │  [1] GET /produtos
│  (HTML/JS)          │  ──────────────────────►
└─────────────────────┘
                                    ┌─────────────────────┐
                                    │  ⚙️ Backend         │
                                    │  (porta 3001)       │
                                    └──────────┬──────────┘
                                               │ [2] Read mock
                                               ▼
                                    ┌─────────────────────┐
                                    │  💾 produtos-mock.js│
                                    │  [                  │
                                    │    { id, nome, ... }│
                                    │  ]                  │
                                    └──────────┬──────────┘
                                               │ [3] Return array
                                               ▼
┌─────────────────────┐              ┌─────────────────────┐
│  🌐 Frontend        │  [4] JSON    │  ⚙️ Backend         │
│  Renderiza cards    │ ◄────────────│                     │
└─────────────────────┘              └─────────────────────┘
```

---

## 🎭 Fluxo: Sistema de Personalidades

```
            [Usuário seleciona personalidade]
                        │
                        ▼
        ┌───────────────────────────────┐
        │  personalidades/index.js      │
        │  ────────────────────────────  │
        │  export {                     │
        │    profissional,              │
        │    animado,                   │
        │    poeta,                     │
        │    sarcastico,                │
        │    minimalista                │
        │  }                            │
        └────────────┬──────────────────┘
                     │ [Carrega arquivo]
                     ▼
        ┌───────────────────────────────┐
        │  personalidades/animado.js    │
        │  ────────────────────────────  │
        │  export default {             │
        │    nome: "Animado",           │
        │    systemPrompt: "Seja muito  │
        │                   empolgado!" │
        │  }                            │
        └────────────┬──────────────────┘
                     │
                     ▼
        ┌───────────────────────────────┐
        │  app.js                       │
        │  ────────────────────────────  │
        │  const prompt =               │
        │    personalidade.systemPrompt │
        └────────────┬──────────────────┘
                     │ [Envia para Groq]
                     ▼
        ┌───────────────────────────────┐
        │  🤖 Groq API                  │
        │  Com prompt da personalidade  │
        └───────────────────────────────┘
```

---

## 🔌 Fluxo: MCP Tools (Opcionais)

```
[IA decide usar tool]
         │
         ▼
┌─────────────────────┐
│  🌐 Frontend        │  [1] POST /mcp (se configurado)
│  mcp-client-demo    │  ────────────────────►
└─────────────────────┘
                                    ┌─────────────────────┐
                                    │  🔌 MCP Server      │
                                    │  (2 tools apenas)   │
                                    │  ─────────────────   │
                                    │  • listar_produtos  │
                                    │  • buscar_produto   │
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │  💾 produtos-mock.js│
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    [Retorna dados]
```

**Nota:** MCP é opcional neste exemplo. Foco está nas personalidades.

---

## 🔗 Endpoints

| Serviço    | URL                                               | Porta |
| ---------- | ------------------------------------------------- | ----- |
| Frontend   | `file:///index.html` (duplo-clique)               | -     |
| Backend    | `http://localhost:3001/produtos`                  | 3001  |
| MCP Server | stdio (opcional)                                  | -     |
| Groq API   | `https://api.groq.com/openai/v1/chat/completions` | -     |

---

## 🚀 Inicialização

```bash
# Terminal 1 - Backend
cd backend && node server.js       # Porta 3001

# Terminal 2 - MCP (opcional)
cd mcp-server && npm run dev       # stdio

# Frontend - Duplo clique!
# Abra: frontend/index.html
```

---

## 🎯 Diferença Principal

**Exemplo 01 (Completo):**

```
Frontend → Backend → MCP → IA
```

**Exemplo 02 (Ultra-Simples):**

```
Frontend → IA (direto!)
Frontend → Backend (só para produtos)
```

**Por quê?**

- ✅ Mais fácil de entender
- ✅ Menos dependências
- ✅ Foco em personalidades
- ✅ Ideal para workshop de 4h
