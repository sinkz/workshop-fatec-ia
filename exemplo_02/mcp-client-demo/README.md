# 🔌 MCP Client - Demonstração Educacional

Cliente MCP simples que demonstra o **protocolo MCP real** usando `stdin/stdout`.

---

## 🎯 O Que É Isto?

Este cliente mostra como aplicações **reais** (como Claude Desktop) se comunicam com servidores MCP.

### Diferença do Frontend:

| Aspecto        | Frontend (app.js)       | MCP Client (este)             |
| -------------- | ----------------------- | ----------------------------- |
| **Protocolo**  | HTTP/fetch              | stdin/stdout                  |
| **Formato**    | REST/JSON               | JSON-RPC (MCP)                |
| **IA**         | Groq decide ferramentas | Cliente decide explicitamente |
| **Transporte** | HTTP (porta 3000)       | stdio (pipes)                 |
| **Uso Real**   | Aplicações web          | IDEs, Claude Desktop          |

---

## 🏗️ Arquitetura Completa

```
┌─────────────────┐
│  MCP CLIENT     │ ← ESTE ARQUIVO
│  (client.js)    │
└────────┬────────┘
         │
         │ ① stdin/stdout (JSON-RPC)
         │    Protocolo MCP oficial
         │
┌────────▼────────┐
│  MCP SERVER     │ ← ../mcp-server/index.js
│  (index.js)     │
└────────┬────────┘
         │
         │ ② HTTP (axios)
         │    GET/POST
         │
┌────────▼────────┐
│  Backend Express│ ← ../backend/server.js
│  (porta 3001)   │
└─────────────────┘
```

### O Que Cada Camada Faz:

1. **MCP Client** (este)

   - Envia comandos MCP via stdin
   - Recebe respostas via stdout
   - Interface amigável no terminal

2. **MCP Server**

   - Recebe comandos JSON-RPC
   - Orquestra chamadas ao backend
   - Retorna dados formatados

3. **Backend Express**
   - Armazena dados (mock in-memory)
   - Processa requisições HTTP
   - Retorna JSON

---

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
cd exemplo_02/mcp-client-demo
npm install
```

### 2. Garantir Backend Rodando

**Abra outro terminal:**

```bash
cd ../backend
npm start
```

**Deve mostrar:**

```
🚀 Backend rodando na porta 3001
📦 Mock inicializado com 3 produtos
```

### 3. Executar Cliente MCP

```bash
npm start
```

---

## 📊 Saída Esperada

```
╔═══════════════════════════════════════╗
║                                       ║
║  🎓 DEMONSTRAÇÃO MCP CLIENT + SERVER ║
║     Protocolo MCP via stdio          ║
║                                       ║
╚═══════════════════════════════════════╝

═══════════════════════════════════════
  🔌 CONECTANDO AO MCP SERVER
═══════════════════════════════════════

📂 Comando: node ../mcp-server/index.js
⏳ Aguardando conexão...

✅ Conectado ao MCP Server!

──────────────────────────────────────

📋 Listando ferramentas disponíveis...

🛠️  2 ferramentas encontradas:

   1. listar_produtos
      ↳ Lista todos os produtos disponíveis no sistema

   2. criar_produto
      ↳ Cria um novo produto no sistema
      ↳ Parâmetros: nome, preco, categoria

──────────────────────────────────────

📚 Listando recursos disponíveis...

📖 1 recurso(s) encontrado(s):

   1. Guia do Sistema de Produtos
      URI: produtos://docs/guia
      Descrição: Documentação completa...
      Tipo: text/plain

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 1: Listar produtos existentes ║
╚═══════════════════════════════════════╝

🔧 Executando ferramenta: listar_produtos
   Sem argumentos
   ⏳ Processando...

✅ Resultado recebido:

   📦 3 produto(s):

      • Notebook Dell
        Preço: R$ 3000.00
        Categoria: Informática
        ID: 1

      • Mouse Logitech
        Preço: R$ 50.00
        Categoria: Periféricos
        ID: 2

      • Teclado Mecânico
        Preço: R$ 150.00
        Categoria: Periféricos
        ID: 3

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 2: Criar novo produto         ║
╚═══════════════════════════════════════╝

🔧 Executando ferramenta: criar_produto
   Argumentos: {
     "nome": "Webcam HD 1080p",
     "preco": 299.9,
     "categoria": "Periféricos"
   }
   ⏳ Processando...

✅ Resultado recebido:

   ✅ Produto criado:

      Nome: Webcam HD 1080p
      Preço: R$ 299.90
      Categoria: Periféricos
      ID: 4

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 3: Verificar produto criado   ║
╚═══════════════════════════════════════╝

🔧 Executando ferramenta: listar_produtos
   Sem argumentos
   ⏳ Processando...

✅ Resultado recebido:

   📦 4 produto(s):

      • Notebook Dell
      • Mouse Logitech
      • Teclado Mecânico
      • Webcam HD 1080p ← NOVO!

──────────────────────────────────────

╔═══════════════════════════════════════╗
║                                       ║
║  ✅ DEMONSTRAÇÃO CONCLUÍDA!          ║
║                                       ║
║  Conceitos demonstrados:             ║
║  • Conexão via stdio                 ║
║  • Listagem de ferramentas           ║
║  • Execução de tools                 ║
║  • Manipulação de dados reais        ║
║                                       ║
╚═══════════════════════════════════════╝

🔌 Conexão encerrada.
```

---

## 🔍 Entendendo o Código

### 1. Conexão (stdin/stdout)

```javascript
const transport = new StdioClientTransport({
  command: "node",
  args: ["../mcp-server/index.js"],
});

const client = new Client({ name: "mcp-client-demo", version: "1.0.0" });
await client.connect(transport);
```

**O que acontece:**

- Cliente inicia processo filho (MCP Server)
- Conecta stdin/stdout via pipes
- Comunicação via JSON-RPC

### 2. Listar Ferramentas

```javascript
const result = await client.listTools();
```

**Envia:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Recebe:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "listar_produtos",
        "description": "..."
      }
    ]
  }
}
```

### 3. Executar Ferramenta

```javascript
const result = await client.callTool({
  name: "criar_produto",
  arguments: { nome: "Webcam", preco: 299.9, categoria: "Periféricos" },
});
```

**Fluxo interno:**

1. Cliente → `tools/call` → MCP Server
2. MCP Server → `POST /produtos` → Backend Express
3. Backend → resposta JSON → MCP Server
4. MCP Server → formata MCP → Cliente

---

## 🎓 Valor Educacional

### Para os Alunos:

Este cliente demonstra:

✅ **Protocolo MCP Real** - Como Claude Desktop funciona
✅ **stdin/stdout** - Comunicação via pipes (não HTTP)
✅ **JSON-RPC** - Formato de mensagens MCP
✅ **Arquitetura em Camadas** - Cliente → MCP → Backend
✅ **Tools vs Resources** - Conceitos MCP

### Comparação com o Frontend:

| Conceito         | Frontend              | MCP Client                |
| ---------------- | --------------------- | ------------------------- |
| **Simplicidade** | ⭐⭐⭐⭐⭐ Mais fácil | ⭐⭐⭐ Conceitual         |
| **Realismo**     | ⭐⭐⭐ Adaptado       | ⭐⭐⭐⭐⭐ Protocolo real |
| **Uso Prático**  | Apps web              | IDEs, Desktop             |

---

## 🛠️ Quando Usar no Workshop

### Opção 1: Final do Workshop (10 min)

- Rodar a demo ao vivo
- Mostrar logs do MCP Server
- Comparar com o frontend

### Opção 2: Atividade Extra

- Deixar no repositório
- "Para quem quiser explorar mais"
- Link na documentação

### Opção 3: Não mostrar

- Se workshop já estiver denso
- Focar só no conceito via slides

---

## ❓ Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
```

### Erro: "Connection refused"

Backend não está rodando:

```bash
cd ../backend
npm start
```

### Erro: "ENOENT: no such file"

MCP Server não existe:

```bash
cd ../mcp-server
ls index.js  # Deve existir
```

---

## 📚 Referências

- [MCP Documentation](https://modelcontextprotocol.io/)
- [SDK Client API](https://github.com/modelcontextprotocol/sdk)
- [JSON-RPC 2.0 Spec](https://www.jsonrpc.org/specification)

---

**🎉 Explore e aprenda como o MCP funciona por baixo dos panos!**
