# 🔌 Configuração Neon MCP Server

## ✅ Problema Resolvido

**Erro anterior:**

```
npm error 404 Not Found - GET https://registry.npmjs.org/@neondatabase%2fmcp-server
```

**Causa:** Nome incorreto do pacote NPM.

**Solução:** Atualizado para usar o pacote oficial `@neondatabase/mcp-server-neon`.

---

## 📋 Pré-requisitos

Antes de rodar o backend, verifique:

1. **Node.js >= v18.0.0**

   ```bash
   node --version
   # Deve mostrar v18.x.x ou superior
   ```

2. **API Key do Neon** (obrigatória)
   - Acesse: https://console.neon.tech/app/settings/api-keys
   - Clique em "Generate New Key"
   - Copie a chave gerada

---

## 🚀 Como Configurar

### 1. Criar arquivo `.env`

Na pasta `backend/`, copie o arquivo de exemplo:

```bash
cd backend
cp env.example .env
```

### 2. Editar o `.env`

Abra o arquivo `.env` e adicione sua API key:

```env
NEON_API_KEY="neon_api_sua_chave_aqui"
```

⚠️ **ATENÇÃO:** Não commite o arquivo `.env` no Git! Ele já está no `.gitignore`.

### 3. Instalar dependências

```bash
npm install
```

### 4. Iniciar o servidor

```bash
npm start
```

Se tudo estiver correto, você verá:

```
🔌 Conectando ao Neon MCP Server...
✅ Conectado ao Neon MCP Server!

╔═══════════════════════════════════════╗
║  🌉 Backend Proxy MCP Iniciado       ║
╚═══════════════════════════════════════╝

Porta: 3001
Endpoints:
  GET  http://localhost:3001/tools
  GET  http://localhost:3001/resources
  POST http://localhost:3001/tools/call
  GET  http://localhost:3001/health
```

---

## 🧪 Testar a Conexão

### Health Check

```bash
curl http://localhost:3001/health
```

**Resposta esperada:**

```json
{
  "status": "ok",
  "neonMCP": "connected",
  "timestamp": "2025-10-21T23:50:00.000Z"
}
```

### Listar ferramentas disponíveis

```bash
curl http://localhost:3001/tools
```

**Resposta esperada:** JSON com lista de tools do Neon MCP (run_sql, create_branch, list_projects, etc).

---

## ❌ Troubleshooting

### Erro: "NEON_API_KEY não configurada"

**Problema:** Arquivo `.env` não existe ou está vazio.

**Solução:**

1. Verifique se o arquivo `.env` existe na pasta `backend/`
2. Abra o arquivo e confirme que `NEON_API_KEY` está preenchida
3. Remova aspas duplas se houver ao redor da chave

### Erro: "npm error 404" ou "Connection closed"

**Problema:** Pacote antigo ou cache do npm.

**Solução:**

```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Tentar novamente
npm start
```

### Erro: "npx: command not found"

**Problema:** npm/npx não está no PATH do sistema.

**Solução (Windows):**

1. Verifique se Node.js está instalado: `node --version`
2. Reinstale Node.js: https://nodejs.org/
3. Reinicie o terminal após instalar

### Erro de versão do Node.js

**Problema:** Node.js muito antigo (< v18).

**Solução:**

1. Atualize para Node.js LTS mais recente: https://nodejs.org/
2. Verifique após atualizar: `node --version`

---

## 🏗️ Arquitetura

```
Frontend (Browser)
    ↓ HTTP (fetch)
Backend Express (server.js) ← você está aqui
    ↓ stdio (StdioClientTransport)
Neon MCP Server (@neondatabase/mcp-server-neon)
    ↓ Neon API
Neon Database (PostgreSQL na nuvem)
```

**Por que esta arquitetura?**

- Browsers não conseguem usar comunicação stdio
- API key fica segura no backend (não exposta ao browser)
- Backend traduz HTTP (familiar) → stdio (protocolo MCP)

---

## 📚 Recursos

- **Documentação oficial:** https://neon.com/docs/ai/neon-mcp-server
- **Neon Console:** https://console.neon.tech
- **Model Context Protocol (MCP):** https://modelcontextprotocol.io
- **SDK MCP:** https://github.com/modelcontextprotocol/sdk

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**

1. **NUNCA** commite o arquivo `.env` no Git
2. **NUNCA** compartilhe sua NEON_API_KEY publicamente
3. **NUNCA** exponha a API key no frontend (sempre use o backend)
4. Use `.gitignore` para garantir que `.env` não seja versionado

Se você acidentalmente commitar a chave:

1. Revogue imediatamente no Neon Console
2. Gere uma nova chave
3. Atualize o `.env` local

---

## ✅ Checklist Final

Antes de prosseguir para o frontend:

- [ ] Node.js >= v18 instalado
- [ ] Arquivo `.env` criado com NEON_API_KEY válida
- [ ] `npm install` executado com sucesso
- [ ] `npm start` iniciou sem erros
- [ ] `curl http://localhost:3001/health` retorna `"neonMCP": "connected"`
- [ ] `curl http://localhost:3001/tools` retorna lista de ferramentas

Se todos os itens estão ✅, seu backend está pronto! 🎉
