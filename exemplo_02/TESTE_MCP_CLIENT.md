# 🧪 Como Testar o MCP Client

Guia rápido para testar a demonstração completa do protocolo MCP.

---

## 🎯 O Que Vai Ser Testado?

```
Cliente MCP ←stdin/stdout→ MCP Server ←HTTP→ Backend Express
```

**Diferente do frontend** que chama Groq diretamente, este usa o **protocolo MCP real**!

---

## ⚡ Teste Rápido (3 Passos)

### 1️⃣ Abra Terminal 1 - Backend

```bash
cd exemplo_02/backend
npm start
```

**Aguarde ver:**

```
🚀 Backend rodando na porta 3001
📦 Mock inicializado com 3 produtos
```

✅ **Deixe rodando!**

---

### 2️⃣ Abra Terminal 2 - MCP Client

```bash
cd exemplo_02/mcp-client-demo
npm start
```

---

### 3️⃣ Observe a Mágica! ✨

O cliente vai automaticamente:

1. **Conectar** ao MCP Server via stdio
2. **Listar** ferramentas disponíveis
3. **Listar** recursos disponíveis
4. **Executar** listar_produtos (3 produtos)
5. **Criar** novo produto (Webcam HD)
6. **Verificar** que foi criado (4 produtos)
7. **Encerrar** conexão

---

## 📊 Saída Esperada (Resumida)

```
╔═══════════════════════════════════════╗
║  🎓 DEMONSTRAÇÃO MCP CLIENT + SERVER ║
╚═══════════════════════════════════════╝

🔌 Conectando ao MCP Server...
✅ Conectado!

📋 Listando ferramentas...
🛠️  2 ferramentas encontradas:
   1. listar_produtos
   2. criar_produto

📚 Listando recursos...
📖 1 recurso(s) encontrado(s):
   1. Guia do Sistema de Produtos

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 1: Listar produtos existentes ║
╚═══════════════════════════════════════╝

🔧 Executando: listar_produtos
✅ Resultado:
   📦 3 produto(s):
      • Notebook Dell (R$ 3000.00)
      • Mouse Logitech (R$ 50.00)
      • Teclado Mecânico (R$ 150.00)

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 2: Criar novo produto         ║
╚═══════════════════════════════════════╝

🔧 Executando: criar_produto
✅ Produto criado:
      Nome: Webcam HD 1080p
      Preço: R$ 299.90
      ID: 4

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  TESTE 3: Verificar produto criado   ║
╚═══════════════════════════════════════╝

🔧 Executando: listar_produtos
✅ Resultado:
   📦 4 produto(s):
      • Notebook Dell
      • Mouse Logitech
      • Teclado Mecânico
      • Webcam HD 1080p ← NOVO!

──────────────────────────────────────

╔═══════════════════════════════════════╗
║  ✅ DEMONSTRAÇÃO CONCLUÍDA!          ║
╚═══════════════════════════════════════╝
```

---

## 🔍 O Que Está Acontecendo?

### Por Trás dos Panos:

**Quando roda `listar_produtos`:**

1. **Cliente MCP** envia via stdin:

   ```json
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "params": { "name": "listar_produtos" }
   }
   ```

2. **MCP Server** recebe e faz:

   ```javascript
   axios.get("http://localhost:3001/produtos");
   ```

3. **Backend Express** responde:

   ```json
   [{"id":1,"nome":"Notebook",...}]
   ```

4. **MCP Server** formata e retorna via stdout

5. **Cliente MCP** exibe formatado no terminal

---

## 🎓 Para Mostrar aos Alunos

### Comparação Visual:

**Frontend (app.js):**

```
Browser → HTTP → Groq.ai (Function Calling)
Browser → HTTP → Backend Express
```

**MCP Client (este):**

```
Client → stdin/stdout → MCP Server → HTTP → Backend
```

### Quando Mostrar:

✅ **Opção 1:** Final do workshop (10 min)

- Rodar ao vivo
- Mostrar logs em paralelo
- "Assim que aplicações reais usam MCP"

✅ **Opção 2:** Material extra

- Deixar no repositório
- "Explorem em casa"
- Link na documentação

❌ **Opção 3:** Não mostrar

- Se workshop já denso
- Focar só conceito via slides

---

## 🐛 Problemas Comuns

### "Cannot find module"

```bash
cd mcp-client-demo
npm install
```

### "ECONNREFUSED"

Backend não está rodando:

```bash
cd ../backend
npm start
```

### "MCP Server error"

Verifique se o MCP Server existe:

```bash
cd ../mcp-server
ls index.js
```

---

## 📝 Notas para o Workshop

### Conceitos Demonstrados:

✅ **Protocolo MCP Real** - stdin/stdout, não HTTP
✅ **JSON-RPC** - Formato de mensagens MCP
✅ **Arquitetura em Camadas** - Separação clara
✅ **Tools vs Resources** - Diferença prática
✅ **Orquestração** - MCP Server como intermediário

### Frase-chave:

> "O frontend que fizemos usa Groq diretamente (mais simples para aprender). Mas aplicações como Claude Desktop usam exatamente este fluxo: Cliente MCP ↔ Servidor MCP ↔ Backend."

---

## 🚀 Estrutura Final

```
exemplo_02/
├── backend/           # Express + mock (porta 3001)
├── mcp-server/        # Servidor MCP (stdio)
├── mcp-client-demo/   # Cliente MCP (este!) ← NOVO
└── frontend/          # HTML/JS (porta 3000)
```

**4 componentes independentes mas conectados!**

---

**🎉 Teste e mostre o poder do protocolo MCP real!**
