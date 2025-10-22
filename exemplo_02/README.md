# 🎓 Sistema MCP Ultra-Simples - Workshop

> **Projeto minimalista para aprender MCP em 4 horas**

---

## 🎯 Sobre Este Projeto

Este é um exemplo **ULTRA-SIMPLIFICADO** de um sistema com:

- ✅ Backend Express (< 50 linhas)
- ✅ MCP Server (2 tools + 1 resource)
- ✅ Frontend HTML/CSS/JS puro (sem build!)
- ✅ Chat IA com Groq function calling

**Objetivo:** Ensinar conceitos MCP sem complexidade técnica.

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
node server.js
```

**Deve mostrar:**

```
🚀 Backend rodando na porta 3001
📦 Mock inicializado com 3 produtos
```

### 2. Frontend

```bash
cd frontend
# Edite config.js e adicione seu token Groq
```

Depois, **duplo clique** em `index.html` para abrir no navegador.

### 3. MCP Server (NOVO!)

```bash
cd mcp-server
npm install
npm start
```

**Deve mostrar:**

```
╔═══════════════════════════════════════╗
║  🌐 MCP Server HTTP Iniciado         ║
╚═══════════════════════════════════════╝

Porta: 3003
Endpoints:
  GET  http://localhost:3003/tools
  GET  http://localhost:3003/resources
  POST http://localhost:3003/tools/call
```

---

## 🏗️ Arquitetura Integrada (MCP Real!)

O sistema agora usa o **MCP Server de verdade** no fluxo principal:

```
┌──────────────┐
│  Frontend    │  (porta 3000)
│  (Browser)   │
└──────┬───────┘
       │
       │ ① HTTP GET /tools (busca ferramentas disponíveis)
       │ ② HTTP POST /tools/call (executa ferramenta)
       │
┌──────▼───────┐
│ MCP Server   │  (porta 3003)
│ HTTP + stdio │
└──────┬───────┘
       │
       │ ③ HTTP GET/POST /produtos
       │
┌──────▼───────┐
│  Backend     │  (porta 3001)
│  Express     │
└──────────────┘
```

### Como Funciona

**Inicialização:**

1. **Frontend** busca ferramentas do MCP Server (`GET /tools`)
2. **Frontend** busca recursos disponíveis (`GET /resources`)
3. **Frontend** carrega conteúdo de cada recurso (`GET /resources/:uri`)
4. **Frontend** adiciona recursos ao prompt do sistema (contexto permanente)
5. **Groq** recebe ferramentas + contexto dos recursos

**Durante Uso:** 6. **Groq** decide qual ferramenta usar (Function Calling) 7. **Frontend** executa ferramenta via MCP Server (`POST /tools/call`) 8. **MCP Server** orquestra chamada ao Backend Express 9. **Backend** processa e retorna dados 10. **MCP Server** formata resposta 11. **Frontend** recebe e exibe para usuário

### Portas

| Serviço             | Porta    | URL                     |
| ------------------- | -------- | ----------------------- |
| Frontend            | 3000     | `http://localhost:3000` |
| Backend             | 3001     | `http://localhost:3001` |
| **MCP Server HTTP** | **3003** | `http://localhost:3003` |

### Dual Mode

O MCP Server roda em **dois modos simultaneamente**:

- **HTTP** (porta 3003): Para frontend (browser)
- **stdio**: Para `mcp-client-demo` (terminal)

Isso demonstra a versatilidade do protocolo MCP!

---

## 📁 Estrutura

```
exemplo_02/
├── backend/
│   ├── produtos-mock.js    # Array de produtos em memória
│   ├── server.js           # Express com 2 endpoints
│   └── package.json
├── mcp-server/
│   ├── config.js           # Configuração das ferramentas
│   ├── index.js            # Servidor MCP
│   └── package.json
├── frontend/
│   ├── config.js           # ⚙️ CONFIGURAR TOKEN AQUI!
│   ├── index.html          # Interface split-screen
│   ├── style.css           # Estilos mínimos
│   ├── app.js              # Lógica + Groq function calling
│   └── personalidades/     # 🎭 Sistema modular de personalidades
│       ├── index.js        # Carregador de personalidades
│       ├── profissional.js # Personalidade formal
│       ├── sarcastico.js   # Personalidade irônica
│       ├── animado.js      # Personalidade empolgada
│       ├── poeta.js        # Personalidade poética
│       ├── minimalista.js  # Personalidade concisa
│       ├── _TEMPLATE.js    # Template para novas
│       └── README.md       # Documentação completa
├── COMO_ADICIONAR_PERSONALIDADE.md  # 🎭 Guia rápido
└── README.md               # Este arquivo
```

---

## ⚙️ Configuração

### Obter Token Groq

1. Acesse https://console.groq.com/
2. Faça login ou crie conta
3. Vá em **API Keys**
4. Crie uma nova chave
5. Copie o token

### Configurar Token

Edite `frontend/config.js`:

```javascript
const CONFIG = {
  ia: {
    groq: {
      token: "gsk_seu_token_aqui", // ← COLE SEU TOKEN
      modelo: "qwen/qwen3-32b",
      // ...
    },
  },
};
```

### Escolher Personalidade

O sistema agora tem **personalidades modulares**! Escolha uma:

```javascript
const CONFIG = {
  // ...
  personalidade: "animado", // ← Altere aqui!
  // Opções: profissional, sarcastico, animado, poeta, minimalista
};
```

**📚 Para criar sua própria personalidade:** Veja `COMO_ADICIONAR_PERSONALIDADE.md`

---

## 🧪 Testes

### No Chat, Digite:

```
Liste os produtos
```

**Resultado:** Deve mostrar os 3 produtos do mock

```
Crie um produto chamado Webcam por R$ 200 na categoria Periféricos
```

**Resultado:** Produto criado e aparece na lista!

```
Qual o preço do Mouse?
```

**Resultado:** R$ 50,00 (dados reais!)

---

## 🎓 Para Professores

**Veja:** `GUIA_PROFESSOR.md`

Contém passo-a-passo completo de como conduzir o workshop no projetor.

---

## 🆚 Diferenças do Exemplo 01

| Aspecto      | Exemplo 01            | Exemplo 02     |
| ------------ | --------------------- | -------------- |
| Stack        | React + TypeScript    | HTML/JS puro   |
| Backend      | Express + JSON Server | Express + mock |
| Ferramentas  | 11 tools              | 2 tools        |
| Complexidade | Alta                  | **Baixíssima** |
| Build        | Necessário            | **Nenhum!**    |
| Linhas       | ~2000                 | **~300**       |
| Setup        | 30 min                | **5 min**      |

---

## 💡 Conceitos Aprendidos

- ✅ Model Context Protocol (MCP)
- ✅ Tools vs Resources
- ✅ Groq function calling
- ✅ Anti-alucinação com dados reais
- ✅ Integração Frontend + Backend + IA
- ✅ Sistema modular de personalidades
- ✅ ES6 Modules (import/export)

---

## 🚀 Próximos Passos

Após dominar este exemplo:

1. **Crie sua própria personalidade** (veja `COMO_ADICIONAR_PERSONALIDADE.md`)
2. Adicione mais ferramentas (deletar, atualizar)
3. Implemente persistência (arquivo/banco)
4. Adicione recursos (resources) customizados no MCP
5. Migre para TypeScript
6. Use React (ver exemplo_01)
7. Deploy em produção

## 🎭 Sistema de Personalidades

O exemplo_02 agora tem um **sistema modular de personalidades**!

### Personalidades Disponíveis

| ID           | Nome         | Descrição           |
| ------------ | ------------ | ------------------- |
| profissional | Profissional | Formal e objetivo   |
| sarcastico   | Sarcástico   | Irônico mas útil    |
| animado      | Animado      | Super empolgado! 🎉 |
| poeta        | Poeta        | Linguagem poética   |
| minimalista  | Minimalista  | Conciso e direto    |

### Como Trocar de Personalidade

Edite `frontend/config.js`:

```javascript
personalidade: "poeta", // ← Troque aqui!
```

### Como Criar Nova Personalidade

**5 passos simples:**

1. Copie `personalidades/_TEMPLATE.js`
2. Preencha os campos (id, nome, prompt, boasVindas)
3. Salve como `personalidades/genio.js`
4. Importe no `personalidades/index.js`
5. Adicione ao array `PERSONALIDADES_DISPONIVEIS`

**📖 Guia completo:** `COMO_ADICIONAR_PERSONALIDADE.md`

---

**🎉 Divirta-se aprendendo MCP!**
