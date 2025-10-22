# 👨‍🏫 Guia do Professor - Workshop MCP Simplificado

> **Instruções passo-a-passo para conduzir o workshop no projetor**

---

## 🎯 Visão Geral

**Duração:** 4 horas
**Objetivo:** Construir sistema de produtos com IA do zero
**Nível:** Iniciantes
**Abordagem:** Construir JUNTO com os alunos no projetor

---

## 📦 O Que Vamos Construir

```
┌─────────────────────────────────────────┐
│  📦 Produtos     |     💬 Chat IA       │
│  (Cards)         |     (Inteligente)    │
│                  |                      │
│  🖥️ Notebook     |  👤 Liste produtos   │
│  R$ 3.000        |                      │
│                  |  🤖 Temos 3 produtos │
│  🖱️ Mouse        |     disponíveis:     │
│  R$ 50           |     - Notebook...    │
│                  |                      │
│  ⌨️ Teclado      |  👤 Crie um produto  │
│  R$ 150          |     Mouse Gamer...   │
│                  |                      │
│                  |  🤖 ✅ Produto       │
│                  |     criado!          │
└─────────────────────────────────────────┘
```

---

## ⏱️ Cronograma

| Horário | Duração | Bloco      | O Que Fazer              |
| ------- | ------- | ---------- | ------------------------ |
| 0:00    | 10 min  | Intro      | Apresentar projeto final |
| 0:10    | 50 min  | Backend    | Criar server.js + mock   |
| 1:00    | 50 min  | Frontend   | HTML + CSS + JS básico   |
| 1:50    | 15 min  | PAUSA      | ☕ Descanso              |
| 2:05    | 55 min  | MCP        | Servidor MCP + config    |
| 3:00    | 45 min  | Integração | Function calling         |
| 3:45    | 15 min  | Demo       | Testes finais            |

---

## 🚀 BLOCO 1: BACKEND (50 min)

### Passo 1.1: Criar Pasta e Inicializar (5 min)

**No projetor, digite:**

```bash
mkdir exemplo_02
cd exemplo_02
mkdir backend
cd backend
npm init -y
```

**Explicar:**

- `mkdir` = criar pasta
- `npm init -y` = criar package.json

### Passo 1.2: Instalar Dependências (5 min)

```bash
npm install express cors
```

**Explicar:**

- `express` = framework para criar servidor
- `cors` = permitir frontend acessar API

**Aguardar instalação!** (~30 segundos)

### Passo 1.3: Criar produtos-mock.js (10 min)

**Criar arquivo:** `produtos-mock.js`

**Digitar junto com os alunos:**

```javascript
// Array de produtos em memória
let produtos = [
  { id: 1, nome: "Notebook", preco: 3000, categoria: "Informática" },
  { id: 2, nome: "Mouse", preco: 50, categoria: "Periféricos" },
  { id: 3, nome: "Teclado", preco: 150, categoria: "Periféricos" },
];

let proximoId = 4;

module.exports = { produtos, proximoId };
```

**Explicar:**

- Array simples (não salva em arquivo)
- `proximoId` para gerar IDs únicos
- `module.exports` para usar em outros arquivos

### Passo 1.4: Criar server.js (20 min)

**Criar arquivo:** `server.js`

**Construir passo-a-passo:**

```javascript
// 1. Imports
const express = require("express");
const cors = require("cors");
const mock = require("./produtos-mock");

// 2. Criar app
const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. GET /produtos
app.get("/produtos", (req, res) => {
  console.log("📦 Listando produtos");
  res.json(mock.produtos);
});

// 5. POST /produtos
app.post("/produtos", (req, res) => {
  const { nome, preco, categoria } = req.body;

  const novoProduto = {
    id: mock.proximoId++,
    nome,
    preco: parseFloat(preco),
    categoria,
  };

  mock.produtos.push(novoProduto);
  console.log("✅ Produto criado:", novoProduto);
  res.status(201).json(novoProduto);
});

// 6. Iniciar servidor
app.listen(3001, () => {
  console.log("🚀 Backend rodando na porta 3001");
});
```

**Explicar cada parte:**

- `require` = importar
- `app.use` = configurações
- `app.get` = rota GET
- `app.post` = rota POST
- `res.json` = retornar JSON
- `req.body` = dados enviados

### Passo 1.5: Testar Backend (10 min)

**Rodar:**

```bash
node server.js
```

**Deve mostrar:**

```
🚀 Backend rodando na porta 3001
```

**Testar no navegador:**

- Abrir: `http://localhost:3001/produtos`
- Deve mostrar JSON com 3 produtos

**✅ Checkpoint:** Backend funcionando!

---

## 🎨 BLOCO 2: FRONTEND (50 min)

### Passo 2.1: Criar Estrutura (5 min)

```bash
cd ..
mkdir frontend
cd frontend
```

### Passo 2.2: Criar config.js (5 min)

**Arquivo:** `config.js`

```javascript
const CONFIG = {
  groq: {
    token: "COLOCAR_SEU_TOKEN_AQUI", // ← Configurar depois!
    modelo: "qwen/qwen3-32b",
    temperatura: 0.6,
    maxTokens: 1000,
  },

  backend: {
    url: "http://localhost:3001",
  },

  prompt: "Você é um assistente de produtos. Seja direto e use emojis.",

  boasVindas: "👋 Olá! Como posso ajudar com os produtos?",
};
```

**Explicar:**

- Este arquivo concentra TODAS as configurações
- Alunos só precisam editar este arquivo!

### Passo 2.3: Criar index.html (15 min)

**Arquivo:** `index.html`

**Estrutura básica:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Sistema de Produtos + Chat</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <h1>🛍️ Sistema de Produtos com IA</h1>
    </header>

    <div class="container">
      <!-- Lado Esquerdo: Produtos -->
      <div class="produtos-section">
        <h2>📦 Produtos</h2>
        <div id="produtos-lista"></div>
      </div>

      <!-- Lado Direito: Chat -->
      <div class="chat-section">
        <h2>💬 Chat IA</h2>
        <div id="chat-mensagens"></div>
        <input id="chat-input" placeholder="Pergunte algo..." />
        <button onclick="enviarMensagem()">Enviar</button>
      </div>
    </div>

    <script src="config.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

**Explicar:**

- Split screen (50% produtos, 50% chat)
- IDs para JavaScript manipular
- Scripts no final

### Passo 2.4: Criar style.css (10 min)

**Copiar do arquivo criado** (ou simplificar ainda mais se preferir)

**Pontos-chave:**

- Grid layout (2 colunas)
- Cards para produtos
- Chat com mensagens alinhadas

### Passo 2.5: Criar app.js (15 min)

**Começar com o básico:**

```javascript
// Carregar produtos
async function carregarProdutos() {
  const response = await fetch("http://localhost:3001/produtos");
  const produtos = await response.json();

  const lista = document.getElementById("produtos-lista");
  lista.innerHTML = produtos
    .map(
      (p) => `
    <div class="produto-card">
      <h3>${p.nome}</h3>
      <div>R$ ${p.preco}</div>
      <span>${p.categoria}</span>
    </div>
  `
    )
    .join("");
}

// Enviar mensagem (versão simples primeiro)
async function enviarMensagem() {
  const input = document.getElementById("chat-input");
  const mensagem = input.value;

  alert("Mensagem: " + mensagem); // Testar primeiro!
  input.value = "";
}

// Iniciar
window.onload = function () {
  carregarProdutos();
};
```

**Testar:**

- Abrir `index.html` no navegador
- Produtos devem aparecer!
- Input deve funcionar (alert)

**✅ Checkpoint:** Frontend básico funcionando!

---

## ☕ PAUSA (15 min)

---

## 🔧 BLOCO 3: MCP SERVER (55 min)

### Passo 3.1: Criar Estrutura (5 min)

```bash
cd ..
mkdir mcp-server
cd mcp-server
npm init -y
npm install @modelcontextprotocol/sdk axios
```

### Passo 3.2: Criar config.js (15 min)

**Arquivo:** `config.js`

**Editar no projetor:**

```javascript
module.exports = {
  backendUrl: "http://localhost:3001",

  ferramentas: [
    {
      name: "listar_produtos",
      description: "Lista todos os produtos",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "criar_produto",
      description: "Cria um novo produto",
      inputSchema: {
        type: "object",
        properties: {
          nome: { type: "string" },
          preco: { type: "number" },
          categoria: { type: "string" },
        },
        required: ["nome", "preco", "categoria"],
      },
    },
  ],

  recursos: [
    {
      uri: "produtos://docs/guia",
      nome: "Guia do Sistema",
      descricao: "Como usar o sistema",
      tipoMime: "text/markdown",
      conteudo: "Documentação do sistema...",
    },
  ],
};
```

**Explicar:**

- **Tools**: Executam ações (listar, criar)
- **Resources**: Fornecem informações (documentação)
- **inputSchema**: Define parâmetros esperados

### Passo 3.3: Criar index.js (30 min)

**Arquivo:** `index.js`

**Construir por partes:**

```javascript
// 1. Imports
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios = require("axios");
const config = require("./config.js");

// 2. Criar servidor
const server = new Server({
  name: "mcp-produtos-simples",
  version: "1.0.0",
});

// 3. Handler: Listar ferramentas
server.setRequestHandler("tools/list", async () => {
  return { tools: config.ferramentas };
});

// 4. Handler: Executar ferramenta
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "listar_produtos") {
    const res = await axios.get(config.backendUrl + "/produtos");
    return {
      content: [{ type: "text", text: JSON.stringify(res.data) }],
    };
  }

  if (name === "criar_produto") {
    const res = await axios.post(config.backendUrl + "/produtos", args);
    return {
      content: [{ type: "text", text: JSON.stringify(res.data) }],
    };
  }
});

// 5. Iniciar
const transport = new StdioServerTransport();
server.connect(transport);
console.error("✅ MCP Server iniciado");
```

**Explicar:**

- SDK oficial do MCP
- Handlers para cada operação
- Stdio = entrada/saída padrão

### Passo 3.4: Testar MCP (5 min)

```bash
node index.js
```

**Deve mostrar:**

```
✅ MCP Server iniciado
```

**Explicar:**

- Servidor fica aguardando comandos
- Usado pelo Claude ou nosso chat
- Ctrl+C para parar

**✅ Checkpoint:** MCP Server rodando!

---

## 🔗 BLOCO 4: INTEGRAÇÃO (45 min)

### Passo 4.1: Configurar Token Groq (5 min)

**Abrir:** `frontend/config.js`

**No projetor, substituir:**

```javascript
token: 'COLOCAR_SEU_TOKEN_AQUI',
```

**Por:**

```javascript
token: 'gsk_...seu_token_real...',
```

**Explicar:**

- Token obtido em https://console.groq.com/
- Necessário para usar a IA
- Gratuito para testes

### Passo 4.2: Implementar Function Calling (35 min)

**Já está pronto no `app.js`!**

**Mostrar o código:**

```javascript
// Ferramentas no formato Groq
const FERRAMENTAS_GROQ = [
  {
    type: 'function',
    function: {
      name: 'listar_produtos',
      description: '...',
      parameters: { ... }
    }
  }
];

// Chamar Groq com ferramentas
async function chamarGroqComFerramentas(mensagem) {
  // 1. Enviar para Groq com tools
  const response = await fetch('...groq...', {
    body: JSON.stringify({
      messages: historico,
      tools: FERRAMENTAS_GROQ,  // ← IA vê as ferramentas!
      tool_choice: 'auto'        // ← IA decide se usa
    })
  });

  // 2. Se Groq pediu ferramentas
  if (assistantMessage.tool_calls) {
    // Executar cada ferramenta
    for (const toolCall of assistantMessage.tool_calls) {
      const resultado = await executarFerramenta(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      );

      // Adicionar resultado ao histórico
      historicoGroq.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(resultado)
      });
    }

    // 3. Chamar Groq novamente para resposta final
    const finalResponse = await fetch('...groq...');
    return finalResponse;
  }
}
```

**Explicar:**

- Groq DECIDE qual ferramenta usar
- Frontend EXECUTA o que Groq pediu
- Groq gera resposta final com os dados

### Passo 4.3: Testar Tudo Junto (5 min)

**Abrir 2 terminais:**

```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: (MCP Server roda sob demanda)
```

**Abrir frontend:**

- Duplo clique em `index.html`
- Ou abrir no navegador

**✅ Checkpoint:** Tudo rodando!

---

## 🧪 BLOCO 5: DEMO E TESTES (15 min)

### Teste 1: Listar Produtos

**Digite no chat:**

```
Liste os produtos
```

**Deve:**

- ✅ Chamar ferramenta `listar_produtos`
- ✅ Mostrar os 3 produtos
- ✅ Dados reais (não inventados)

### Teste 2: Criar Produto

**Digite no chat:**

```
Crie um produto chamado Webcam por R$ 250 na categoria Periféricos
```

**Deve:**

- ✅ Groq detectar que precisa criar
- ✅ Chamar `criar_produto` com argumentos
- ✅ Produto aparecer na lista à esquerda
- ✅ Console mostrar "Produto criado"

### Teste 3: Consultar Preço

**Digite no chat:**

```
Qual o preço do Mouse?
```

**Deve:**

- ✅ Listar produtos
- ✅ Responder: "R$ 50,00"
- ✅ **NÃO inventar** outro preço

### Teste 4: Anti-Alucinação

**Digite no chat:**

```
Qual o preço do iPhone?
```

**Deve:**

- ✅ Listar produtos
- ✅ Dizer que NÃO existe iPhone
- ✅ **NÃO inventar** preço

**✅ Se todos passarem:** Sistema funcionando perfeitamente!

---

## 📝 Arquivos que Alunos Editam

**Durante o workshop, no projetor:**

1. ✅ `backend/produtos-mock.js` - Dados iniciais
2. ✅ `backend/server.js` - Endpoints (linha por linha)
3. ✅ `mcp-server/config.js` - Ferramentas MCP
4. ✅ `frontend/config.js` - Token Groq

**Total:** 4 arquivos pequenos e focados!

---

## 💡 Dicas para o Professor

### Gestão de Tempo

- ⏰ Use timer visível
- 🎯 Checkpoints são obrigatórios
- 📊 Vá mais devagar no backend (base importante)
- ⚡ Frontend e MCP podem ser mais rápidos

### Durante a Aula

- 👥 Peça alunos digitarem junto
- 🐛 Erros são normais e educativos
- ✅ Valide cada checkpoint
- 🎬 Mostre console e logs sempre

### Se Atrasar

- Backend é prioridade (#1)
- Frontend pode ser dado pronto
- MCP pode ser demonstrado (sem construir)
- Integração é mais importante que perfeição

### Problemas Comuns

| Problema              | Solução                        |
| --------------------- | ------------------------------ |
| npm install falha     | Verificar internet             |
| CORS error            | Verificar backend rodando      |
| Token inválido        | Gerar novo em console.groq.com |
| Produtos não aparecem | F12 → Console → ver erro       |

---

## 🎯 Objetivos de Aprendizado

Ao final, alunos devem entender:

**Conceitos:**

- ✅ O que é MCP e para que serve
- ✅ Diferença entre Tools e Resources
- ✅ Como evitar alucinações de IA
- ✅ Function calling (IA decide ferramentas)

**Prática:**

- ✅ Criar API REST simples
- ✅ Integrar frontend com backend
- ✅ Usar Groq.ai
- ✅ Configurar servidor MCP

**Resultado:**

- ✅ Sistema funcionando end-to-end
- ✅ Código próprio (construíram juntos!)
- ✅ Base para expandir depois

---

## 📚 Após o Workshop

**Exercícios para casa:**

1. Adicionar mais produtos ao mock
2. Criar ferramenta para deletar produto
3. Adicionar campo "descrição" nos produtos
4. Melhorar o CSS
5. Adicionar mais recursos MCP

---

## 🎉 Checklist Final

Antes de começar o workshop:

- [ ] Node.js instalado nos PCs dos alunos
- [ ] Token Groq obtido
- [ ] Código projetado e legível
- [ ] Backend testado
- [ ] Frontend testado
- [ ] Cronograma impresso
- [ ] Pausas planejadas

**Boa sorte no workshop! 🚀**
