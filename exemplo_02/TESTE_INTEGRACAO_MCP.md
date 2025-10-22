# 🧪 Teste de Integração MCP HTTP

Guia para testar a integração real do MCP Server com o frontend.

---

## 🎯 O Que Mudou?

### Antes (Simplificado)

```
Frontend → Backend Express (direto)
```

### Agora (MCP Real)

```
Frontend → MCP Server HTTP → Backend Express
```

**Agora o MCP Server está no fluxo principal!**

---

## ⚡ Teste Rápido (4 Passos)

### 1️⃣ Terminal 1: Backend

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

### 2️⃣ Terminal 2: MCP Server

```bash
cd exemplo_02/mcp-server
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

✅ MCP Server iniciado com sucesso
🛠️  2 ferramentas registradas
📚 1 recursos disponíveis
```

✅ **Deixe rodando!**

---

### 3️⃣ Terminal 3: Frontend

```bash
cd exemplo_02/frontend
npm start
```

**Browser abre em:** `http://localhost:3000`

✅ **Página carregou!**

---

### 4️⃣ Verificar Console do Browser (F12)

**Deve mostrar:**

```
🚀 Sistema iniciado
🔌 Buscando ferramentas do MCP Server...
✅ 2 ferramentas carregadas do MCP Server
   Ferramentas: listar_produtos, criar_produto
📚 1 recursos disponíveis no MCP
📖 Carregando conteúdo dos recursos...
   ✅ Resource "Guia do Sistema de Produtos" carregado
✅ Contexto dos recursos adicionado ao prompt do sistema
📋 Configuração: {
  backend: "http://localhost:3001",
  mcpServer: "http://localhost:3003",
  modelo: "qwen/qwen3-32b",
  tokenConfigurado: true,
  ferramentasMCP: "Dinâmicas (MCP)"
}
📦 Produtos carregados: 3
```

✅ **Se ver "ferramentasMCP: Dinâmicas (MCP)" = FUNCIONOU!**

---

## 🧪 Teste Funcional

### Teste 1: Listar Produtos

No chat, digite:

```
Liste os produtos disponíveis
```

**Console deve mostrar:**

```
🔧 Executando ferramenta via MCP Server: listar_produtos
✅ Resultado do MCP Server: [array com 3 produtos]
```

**Terminal do MCP Server deve mostrar:**

```
📋 HTTP GET /tools - Listando ferramentas
🔧 HTTP POST /tools/call - Ferramenta: listar_produtos
✅ Ferramenta listar_produtos executada: 3 produtos
```

✅ **Chat responde com lista de produtos!**

---

### Teste 2: Criar Produto

No chat, digite:

```
Crie um produto chamado Mouse Gamer por R$ 180 na categoria Periféricos
```

**Console deve mostrar:**

```
🔧 Executando ferramenta via MCP Server: criar_produto
   Argumentos: {nome: "Mouse Gamer", preco: 180, categoria: "Periféricos"}
✅ Resultado do MCP Server: {id: 4, nome: "Mouse Gamer", ...}
```

**Terminal do MCP Server deve mostrar:**

```
🔧 HTTP POST /tools/call - Ferramenta: criar_produto
   Argumentos: {"nome":"Mouse Gamer","preco":180,"categoria":"Periféricos"}
✅ Ferramenta criar_produto executada: produto ID 4
```

**Terminal do Backend deve mostrar:**

```
✅ POST /produtos - Produto criado: {id: 4, nome: "Mouse Gamer", ...}
```

✅ **Produto aparece na lista à esquerda!**

---

## 🔍 Como Saber Se Está Usando MCP?

### ✅ Sinais de Sucesso:

1. **Console do Browser:**

   - `ferramentasMCP: "Dinâmicas (MCP)"`
   - `✅ 2 ferramentas carregadas do MCP Server`
   - `✅ Contexto dos recursos adicionado ao prompt do sistema`
   - `Executando ferramenta via MCP Server`

2. **Terminal MCP Server:**

   - Mostra requisições HTTP
   - `GET /tools`
   - `GET /resources`
   - `GET /resources/:uri` (para cada resource)
   - `POST /tools/call`

3. **Fluxo de Logs:**

   ```
   Browser → MCP Server → Backend
   ```

4. **Resources Carregados:**

   - Conteúdo dos resources é adicionado ao prompt do sistema
   - IA tem contexto permanente da documentação
   - Respostas mais informadas sobre o sistema

### ❌ Se NÃO Estiver Funcionando:

**Console mostra:**

```
❌ Erro ao conectar com MCP Server
⚠️ Usando ferramentas estáticas como fallback
ferramentasMCP: "Estáticas (fallback)"
```

**Causas:**

- MCP Server não está rodando
- Porta 3003 ocupada
- Firewall bloqueando

**Solução:**

1. Verifique se MCP Server está rodando (Terminal 2)
2. Teste manual: `http://localhost:3003/tools` (deve retornar JSON)
3. Reinicie MCP Server

---

## 🎨 Teste Visual

### O Que Deve Acontecer:

```
┌─────────────────┬─────────────────┐
│   Produtos      │      Chat       │
├─────────────────┼─────────────────┤
│ 📦 Notebook     │ 👤 Liste        │
│ 📦 Mouse        │ produtos        │
│ 📦 Teclado      │                 │
│                 │ 🤖 Temos 3...   │
│                 │                 │
│ (atualiza ao    │ 👤 Crie Mouse   │
│  criar novo)    │ Gamer R$180     │
│                 │                 │
│ 📦 Notebook     │ 🤖 ✅ Criado!   │
│ 📦 Mouse        │                 │
│ 📦 Teclado      │                 │
│ 📦 Mouse Gamer ← NOVO!            │
└─────────────────┴─────────────────┘
```

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /tools"

MCP Server não iniciou. Rode:

```bash
cd mcp-server
npm install  # Se ainda não fez
npm start
```

### Erro: "ECONNREFUSED 3003"

MCP Server caiu. Reinicie Terminal 2.

### Produtos não aparecem na lista

Backend não está rodando:

```bash
cd backend
npm start
```

### Chat não responde

Token Groq não configurado:

1. Edite `frontend/config.js`
2. Substitua `token: "COLOCAR_SEU_TOKEN_GROQ_AQUI"`
3. Recarregue página (F5)

---

## 📊 Arquitetura Completa

```
┌──────────────────┐
│  Browser         │  http://localhost:3000
│  (Frontend)      │
└────────┬─────────┘
         │
         │ HTTP GET /tools
         │ HTTP POST /tools/call
         │
┌────────▼─────────┐
│  MCP Server      │  http://localhost:3003
│  (Express+stdio) │  Dual mode!
└────────┬─────────┘
         │
         │ HTTP GET/POST /produtos
         │
┌────────▼─────────┐
│  Backend Express │  http://localhost:3001
│  (Mock em RAM)   │
└──────────────────┘
```

---

## ✅ Checklist Final

- [ ] Backend rodando (porta 3001)
- [ ] MCP Server rodando (porta 3003)
- [ ] Frontend rodando (porta 3000)
- [ ] Console mostra "ferramentasMCP: Dinâmicas (MCP)"
- [ ] Console mostra "2 ferramentas carregadas do MCP"
- [ ] Chat lista produtos corretamente
- [ ] Chat cria produtos corretamente
- [ ] Novo produto aparece na lista à esquerda
- [ ] Logs aparecem no terminal do MCP Server

---

## 🎉 Sucesso!

Se todos os checks acima passaram, **a integração MCP está funcionando!**

O frontend agora:

- ✅ Busca ferramentas dinamicamente do MCP
- ✅ Executa ferramentas via MCP Server
- ✅ MCP Server orquestra chamadas ao backend
- ✅ Protocolo MCP real no fluxo principal

**Parabéns! Sistema MCP completamente integrado! 🚀**
