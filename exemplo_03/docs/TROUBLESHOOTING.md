# 🔧 Troubleshooting - ReceitasIA

**Guia de Problemas Comuns e Soluções**

Este documento lista os erros mais comuns e como resolvê-los rapidamente.

---

## 📚 Índice

- [Problemas com Backend](#problemas-com-backend)
- [Problemas com Frontend](#problemas-com-frontend)
- [Problemas com Neon Database](#problemas-com-neon-database)
- [Problemas com Chat IA](#problemas-com-chat-ia)
- [Problemas de Configuração](#problemas-de-configuração)
- [Problemas de Performance](#problemas-de-performance)

---

## Problemas com Backend

### ❌ Erro: "NEON_DATABASE_URL não configurada"

**Causa:** Arquivo `.env` não existe ou está vazio

**Solução:**

```bash
cd backend
# Windows
copy env.example .env
# Mac/Linux
cp env.example .env
```

Edite `.env` e cole suas credenciais do Neon.

---

### ❌ Erro: "Conectando ao Neon MCP Server... (travado)"

**Causa:** `npx @neondatabase/mcp-server` não consegue executar

**Soluções:**

1. **Limpar cache do npm:**

   ```bash
   npm cache clean --force
   npx clear-npx-cache
   ```

2. **Reinstalar dependências:**

   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Verificar Node.js:**
   ```bash
   node --version  # Deve ser 18 ou superior
   ```

---

### ❌ Erro: "Failed to connect to Neon"

**Causa:** Connection string inválida ou rede

**Soluções:**

1. **Verificar connection string:**

   - Deve começar com `postgresql://`
   - Deve terminar com `?sslmode=require`
   - Não pode ter espaços ou quebras de linha

2. **Testar connection string:**

   ```bash
   # Instalar cliente postgres (opcional)
   npm install -g pg
   # Testar conexão
   psql "postgresql://..." -c "SELECT 1"
   ```

3. **Verificar firewall/proxy:**
   - Liberar porta 5432
   - Tentar em outra rede (wifi diferente)

---

### ❌ Backend para de funcionar aleatoriamente

**Causa:** Timeout ou erro não tratado

**Solução:**

Usar `nodemon` para restart automático:

```bash
npm install --save-dev nodemon
npx nodemon server.js
```

---

## Problemas com Frontend

### ❌ Erro: "Failed to fetch recipes"

**Causa:** Backend não está rodando ou `.env.local` incorreto

**Soluções:**

1. **Verificar se backend está rodando:**

   - Abrir http://localhost:3001/health
   - Deve retornar `{"status":"ok"}`

2. **Verificar `.env.local`:**

   - Arquivo deve existir em `frontend/.env.local`
   - Deve ter `NEON_DATABASE_URL` preenchido
   - Usar MESMA connection string do backend

3. **Reiniciar frontend:**
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

---

### ❌ Erro: "Module not found" ou "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**

```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

### ❌ Página em branco / tela branca

**Causa:** Erro de JavaScript não tratado

**Soluções:**

1. **Abrir DevTools:**

   - Pressione F12
   - Aba "Console"
   - Veja erro em vermelho

2. **Erros comuns:**

   - `Cannot read property 'map' of undefined` → Receitas não carregaram
   - `Hydration error` → Problema com SSR, recarregue página

3. **Limpar cache:**
   ```bash
   # Parar frontend (Ctrl+C)
   rm -rf .next
   npm run dev
   ```

---

### ❌ Estilização quebrada / sem CSS

**Causa:** Tailwind CSS não compilado

**Solução:**

```bash
cd frontend
# Parar frontend
rm -rf .next
npm run dev
```

Verificar se `tailwind.config.js` e `postcss.config.js` existem.

---

## Problemas com Neon Database

### ❌ Erro: "relation 'recipes' does not exist"

**Causa:** Tabela não foi criada

**Solução:**

1. Acessar Neon Console (https://console.neon.tech)
2. Abrir SQL Editor
3. Executar:
   ```sql
   CREATE TABLE recipes (
     id SERIAL PRIMARY KEY,
     titulo VARCHAR(200) NOT NULL,
     descricao TEXT,
     ingredientes TEXT[] NOT NULL,
     modo_preparo TEXT NOT NULL,
     tempo_preparo INTEGER,
     porcoes INTEGER,
     dificuldade VARCHAR(20),
     categoria VARCHAR(50),
     imagem_url TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

---

### ❌ Erro: "password authentication failed"

**Causa:** Senha incorreta na connection string

**Solução:**

1. No Neon Console, vá em "Connection Details"
2. Clique em "Reset Password"
3. Copie nova connection string
4. Atualize `.env` e `.env.local`
5. Reinicie backend e frontend

---

### ❌ Erro: "SSL required"

**Causa:** Connection string sem `?sslmode=require`

**Solução:**

Adicionar ao final da connection string:

```
?sslmode=require
```

Exemplo correto:

```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### ❌ Consultas SQL muito lentas

**Causa:** Database em sleep mode (free tier)

**Solução:**

1. Primeira query após inatividade demora ~1-2 segundos (normal)
2. Próximas queries serão rápidas
3. Database dorme após 5 minutos de inatividade

---

## Problemas com Chat IA

### ❌ Chat não responde nada

**Causa:** Token do Groq não configurado ou inválido

**Soluções:**

1. **Verificar token:**

   - Abrir `config/app.config.ts`
   - Token deve estar entre aspas
   - Não pode estar escrito "COLE_SEU_TOKEN_GROQ_AQUI"

2. **Gerar novo token:**

   - Acessar https://console.groq.com/keys
   - Clicar "Create API Key"
   - Copiar token
   - Colar em `app.config.ts`

3. **Reiniciar frontend** (Ctrl+C e `npm run dev`)

---

### ❌ Erro: "Backend MCP não conectado"

**Causa:** Backend não está rodando

**Solução:**

1. Verificar terminal do backend
2. Se não estiver rodando:
   ```bash
   cd backend
   npm start
   ```
3. Aguardar mensagem "✅ Conectado ao Neon MCP Server!"
4. Tentar novamente no chat

---

### ❌ IA responde mas não usa ferramentas

**Causa:** IA não identificou necessidade de consultar banco

**Soluções:**

1. **Ser mais específico:**

   - ❌ Ruim: "receitas"
   - ✅ Bom: "Quais receitas doces eu tenho cadastradas?"

2. **Comandos que forçam uso de tools:**
   - "Liste todas as receitas do banco"
   - "Quantas receitas existem?"
   - "Qual é a estrutura da tabela recipes?"

---

### ❌ IA sugere receita mas não aparece preview

**Causa:** IA não retornou JSON ou formato incorreto

**Soluções:**

1. **Pedir novamente de forma clara:**

   ```
   Me sugira uma receita de bolo de cenoura.
   Retorne no formato JSON com todos os campos necessários.
   ```

2. **Verificar console do browser (F12):**
   - Ver se há erro de parsing JSON

---

### ❌ Erro: "Erro ao salvar receita: ingredientes must be an array"

**Causa:** Formato de dados incorreto da IA

**Solução:**

1. Tentar pedir receita novamente
2. IA deve aprender com erro anterior
3. Se persistir, pedir:
   ```
   Consulte o schema da tabela recipes e me sugira uma receita
   compatível com todos os campos corretos
   ```

---

## Problemas de Configuração

### ❌ "Cannot find module '@/components/...'"

**Causa:** Path alias do TypeScript não configurado

**Solução:**

Verificar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Reiniciar VSCode e frontend.

---

### ❌ TypeScript errors em todo lugar

**Causa:** Tipos não instalados ou conflito de versões

**Solução:**

```bash
cd frontend
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

---

### ❌ "Port 3000 is already in use"

**Causa:** Outro processo usando porta 3000

**Soluções:**

1. **Matar processo:**

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **Usar outra porta:**
   ```bash
   npm run dev -- -p 3001
   ```

---

## Problemas de Performance

### ❌ Frontend muito lento

**Causas e Soluções:**

1. **Muitas receitas:**

   - Implementar paginação
   - Limitar query a 50 receitas

2. **DevTools aberto:**

   - Fechar F12
   - React DevTools desabilitado em produção

3. **Build de desenvolvimento:**
   ```bash
   npm run build
   npm start  # Rodar versão de produção
   ```

---

### ❌ Chat demora muito para responder

**Causas:**

1. **Normal:** Groq pode demorar 2-5 segundos com Function Calling
2. **Muitos tool calls:** IA chamando múltiplas ferramentas

**Não há problema!** É comportamento esperado.

---

## 🆘 Ainda com Problema?

### Checklist Final:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Backend rodando (http://localhost:3001/health)
- [ ] Frontend rodando (http://localhost:3000)
- [ ] `.env` no backend preenchido
- [ ] `.env.local` no frontend preenchido
- [ ] `config/app.config.ts` com token Groq
- [ ] Tabela `recipes` existe no Neon
- [ ] DevTools (F12) aberto para ver erros

---

### Logs Úteis:

**Backend:**

- Ver terminal do backend
- Procurar por `❌` ou `Error`

**Frontend:**

- F12 → Console
- F12 → Network (ver requests falhando)

**Neon:**

- Neon Console → Monitoring
- Ver queries executadas

---

### Pedir Ajuda:

Ao pedir ajuda, forneça:

1. **Screenshot do erro**
2. **Logs do terminal (backend e frontend)**
3. **Console do browser (F12)**
4. **O que você estava tentando fazer**
5. **Versão do Node.js** (`node --version`)
6. **Sistema operacional** (Windows/Mac/Linux)

---

## 📞 Contatos

Durante o workshop:

- ✋ Levantar a mão
- 👨‍🏫 Chamar professor/monitor
- 🤝 Pedir ajuda a colega

Após o workshop:

- 📧 Email: [colocar aqui]
- 💬 Discord: [colocar link]
- 🐛 GitHub Issues: [colocar repo]

---

## 💡 Dicas de Prevenção

### Antes de Começar:

- ✅ Atualizar Node.js para versão LTS
- ✅ Verificar conexão de internet estável
- ✅ Ter credenciais do Neon e Groq prontas
- ✅ Fechar programas pesados (Chrome com 50 abas 😅)

### Durante Desenvolvimento:

- ✅ Salvar arquivos antes de testar
- ✅ Ler mensagens de erro completas
- ✅ Usar DevTools para debugar
- ✅ Commitar código funcionando (Git)

### Boas Práticas:

- ✅ Um terminal para backend, outro para frontend
- ✅ Reiniciar servers após mudanças em `.env`
- ✅ Limpar `.next` se build estiver bugado
- ✅ Testar em incógnito se cache causar problemas

---

## 🎓 Aprenda Mais

**Documentação Oficial:**

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [Neon Support](https://neon.tech/docs/introduction)
- [Groq API Docs](https://console.groq.com/docs)

**Comunidades:**

- Stack Overflow: tag `nextjs`, `neon-database`
- Discord do Neon
- Reddit r/nextjs

**Ferram entas Úteis:**

- [Next.js DevTools](https://nextjs.org/docs/advanced-features/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) para testar APIs

---

**✅ Boa sorte! A maioria dos problemas se resolve reiniciando os servers! 🔄**
