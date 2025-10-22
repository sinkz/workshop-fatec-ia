# ⚙️ Guia de Configuração - ReceitasIA

**Para Alunos do Workshop**

Este guia mostra EXATAMENTE o que você precisa fazer para rodar o sistema na sua máquina.

---

## 📋 Checklist Rápida

Você vai precisar de:

- [ ] Node.js 18+ instalado
- [ ] Conta gratuita no Neon (https://neon.tech)
- [ ] Conta gratuita no Groq (https://console.groq.com)
- [ ] Editor de código (VS Code recomendado)
- [ ] Terminal/Prompt de Comando

**Tempo estimado:** 15-20 minutos

---

## 1️⃣ Criar Conta no Neon Database

### Passo 1: Criar Conta

1. Acesse: https://neon.tech
2. Clique em "Sign Up"
3. Use GitHub, Google ou email
4. **NÃO precisa de cartão de crédito** ✅
5. Verifique seu email se necessário

### Passo 2: Criar Projeto

1. Após login, clique em "Create Project"
2. Preencha:
   - **Project name:** `fatec-workspace`
   - **Region:** `US East (Ohio)` ou mais próxima
   - **PostgreSQL version:** Deixar padrão (16)
3. Clique em "Create Project"
4. Aguarde alguns segundos (cria automaticamente)

### Passo 3: Copiar Connection String

1. No dashboard do projeto, procure por "Connection Details"
2. Copie a **Connection String** completa
3. Deve ser algo como:
   ```
   postgresql://usuario:senha@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **IMPORTANTE:** Cole em um arquivo temporário (Bloco de Notas), você vai precisar!

### Passo 4: Obter API Key

1. No canto superior direito, clique no seu avatar
2. Vá em "Account Settings"
3. Menu lateral: "API Keys"
4. Clique em "Generate New Key"
5. Nome: `workshop-fatec`
6. Copie a key (começa com `napi_`)
7. **IMPORTANTE:** Cole junto com a connection string!

### Passo 5: Criar Tabela

1. No dashboard do projeto, clique em "SQL Editor" (menu lateral)
2. Cole este SQL e execute (botão "Run"):

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

INSERT INTO recipes (titulo, descricao, ingredientes, modo_preparo, tempo_preparo, porcoes, dificuldade, categoria) VALUES
('Bolo de Chocolate', 'Bolo fofinho e delicioso',
 ARRAY['2 ovos', '1 xícara de açúcar', '1 xícara de farinha', '1/2 xícara de chocolate em pó', '1/2 xícara de óleo', '1 xícara de água quente', '1 colher de fermento'],
 'Misture os ingredientes secos. Adicione os ovos e o óleo. Por último, adicione a água quente. Leve ao forno a 180°C por 40 minutos.',
 40, 8, 'medio', 'doce'),

('Salada Caesar', 'Salada clássica refrescante',
 ARRAY['1 pé de alface romana', '200g de frango grelhado', '1/2 xícara de croutons', '50g de parmesão ralado', '4 colheres de molho Caesar'],
 'Corte a alface em tiras. Corte o frango em cubos. Monte a salada com alface, frango, croutons e parmesão. Finalize com molho Caesar.',
 15, 2, 'facil', 'salgado'),

('Brigadeiro', 'Doce tradicional brasileiro',
 ARRAY['1 lata de leite condensado', '2 colheres de chocolate em pó', '1 colher de manteiga', 'Chocolate granulado para decorar'],
 'Em uma panela, misture o leite condensado, chocolate em pó e manteiga. Cozinhe em fogo baixo mexendo sempre até desgrudar do fundo. Deixe esfriar, faça bolinhas e passe no granulado.',
 20, 30, 'facil', 'doce');
```

3. Deve aparecer "Success" ✅
4. Executar para verificar:
   ```sql
   SELECT * FROM recipes;
   ```
5. Deve mostrar 3 receitas criadas!

**✅ Neon configurado!**

---

## 2️⃣ Criar Conta no Groq (IA)

### Passo 1: Criar Conta

1. Acesse: https://console.groq.com
2. Clique em "Sign Up"
3. Use Google, GitHub ou email
4. **Também é gratuito!** ✅

### Passo 2: Obter API Key

1. Após login, vá em "API Keys" no menu
2. Clique em "Create API Key"
3. Nome: `workshop-receitas`
4. Copie a chave gerada
5. **IMPORTANTE:** Cole no seu arquivo temporário!

**✅ Groq configurado!**

---

## 3️⃣ Configurar Backend

### Passo 1: Abrir Pasta do Projeto

Abra o terminal/prompt e navegue até o projeto:

```bash
cd exemplo_03/backend
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Aguarde... (pode demorar 1-2 minutos)

### Passo 3: Criar Arquivo .env

**Windows:**

```bash
copy env.example .env
```

**Mac/Linux:**

```bash
cp env.example .env
```

### Passo 4: Editar .env

Abra o arquivo `.env` no VS Code (ou qualquer editor)

Você vai ver:

```env
NEON_DATABASE_URL="postgresql://..."
NEON_API_KEY="..."
```

**Cole as credenciais que você copiou do Neon:**

```env
NEON_DATABASE_URL="postgresql://[COLE AQUI A CONNECTION STRING]"
NEON_API_KEY="[COLE AQUI A API KEY]"
```

**Exemplo preenchido:**

```env
NEON_DATABASE_URL="postgresql://usuario:senha@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEON_API_KEY="napi_pkexs7k1ldya3n7h70bwp8dueh2m2tz47p49qw641hib7tdkbk05ynwhg0bmepgi"
```

**Salve o arquivo!**

### Passo 5: Iniciar Backend

```bash
npm start
```

**Deve aparecer:**

```
✅ Conectado ao Neon MCP Server!
🌉 Backend Proxy MCP rodando na porta 3001
```

**Testar:** Abra navegador em http://localhost:3001/health

Deve mostrar:

```json
{
  "status": "ok",
  "neonMCP": "connected"
}
```

**✅ Backend funcionando!**

**IMPORTANTE:** Deixe este terminal aberto rodando o backend!

---

## 4️⃣ Configurar Frontend

### Passo 1: Abrir Nova Aba do Terminal

- **Deixe o backend rodando** no terminal anterior
- Abra **nova aba/janela** do terminal

### Passo 2: Navegar para Frontend

```bash
cd exemplo_03/frontend
```

### Passo 3: Instalar Dependências

```bash
npm install
```

Aguarde... (pode demorar 2-3 minutos)

### Passo 4: Criar .env.local

**Windows:**

```bash
copy env.example .env.local
```

**Mac/Linux:**

```bash
cp env.example .env.local
```

### Passo 5: Editar .env.local

Abra o arquivo `.env.local` no editor

Cole a **MESMA connection string** do backend:

```env
NEON_DATABASE_URL="postgresql://[MESMA DO BACKEND]"
```

**Salve o arquivo!**

### Passo 6: Configurar Token do Groq

Abra o arquivo `config/app.config.ts`

Encontre a linha:

```typescript
apiKey: "COLE_SEU_TOKEN_GROQ_AQUI",
```

Substitua por:

```typescript
apiKey: "[COLE AQUI SEU TOKEN DO GROQ]",
```

**Exemplo:**

```typescript
apiKey: "gsk_ABC123XYZ789...",
```

**Salve o arquivo!**

### Passo 7: Iniciar Frontend

```bash
npm run dev
```

**Deve aparecer:**

```
  ▲ Next.js 15.5.6
  - Local:        http://localhost:3000

✓ Starting...
✓ Ready in 2.3s
```

**Abrir:** http://localhost:3000

**Deve ver:** Interface do ReceitasIA com as 3 receitas!

**✅ Frontend funcionando!**

---

## 5️⃣ Testar o Sistema

### Teste 1: Ver Receitas

1. Abra http://localhost:3000
2. Deve ver 3 cards de receitas
3. Clique em "Ver" em qualquer receita
4. Deve abrir modal com detalhes

✅ Se funcionou, continue!

### Teste 2: Criar Receita Manual

1. Clique em "Nova Receita" (botão laranja no topo)
2. Preencha:

   - **Título:** Pão de Queijo
   - **Ingredientes:** (um por linha)
     ```
     1 xícara de polvilho
     1/2 xícara de leite
     1 ovo
     100g de queijo
     ```
   - **Modo de Preparo:** Misture tudo e asse por 20 minutos
   - **Tempo:** 30
   - **Porções:** 20
   - **Dificuldade:** Fácil
   - **Categoria:** salgado

3. Clique em "Salvar Receita"
4. Deve aparecer novo card de "Pão de Queijo"

✅ Se criou, perfeito!

### Teste 3: Chat com IA

1. No lado direito da tela, veja o chat
2. Digite: `Quais receitas doces eu tenho?`
3. Envie
4. IA deve responder listando Bolo de Chocolate e Brigadeiro

✅ Se respondeu, chat funciona!

### Teste 4: IA Sugerir Receita

1. No chat, digite: `Me sugira uma receita de mousse de maracujá`
2. Aguarde (pode demorar 5-10 segundos)
3. IA deve:

   - Consultar estrutura do banco
   - Gerar receita compatível
   - Mostrar preview com botões

4. Clique em "💾 Salvar no Banco"
5. Receita deve aparecer na lista à esquerda!

✅ Se salvou, sistema completo funcionando!

---

## ❓ Resolução de Problemas

### Erro: "NEON_DATABASE_URL não configurada"

**Solução:**

- Verifique se criou o arquivo `.env` no backend
- Verifique se copiou a connection string corretamente
- Reinicie o backend (Ctrl+C e `npm start` novamente)

---

### Erro: "Backend não conectado"

**Solução:**

1. Verifique se o backend está rodando (http://localhost:3001/health)
2. Se não estiver, volte ao terminal do backend
3. Veja se apareceu algum erro
4. Comum: connection string errada → copie novamente do Neon

---

### Erro: "Token do Groq inválido"

**Solução:**

- Verifique se colou o token em `config/app.config.ts`
- Token deve estar entre aspas: `"gsk_..."`
- Gere novo token no Groq se necessário
- Reinicie o frontend (Ctrl+C e `npm run dev`)

---

### Chat não responde

**Soluções:**

1. Verifique se backend está rodando (porta 3001)
2. Abra DevTools (F12) → Console → veja erros
3. Verifique token do Groq
4. Tente mensagem mais simples: `Olá`

---

### Frontend não carrega receitas

**Soluções:**

1. Verifique se criou `.env.local` no frontend
2. Connection string deve ser a MESMA do backend
3. Abra DevTools → Console → veja erros
4. Verifique se tabela `recipes` existe no Neon

---

## 📞 Precisa de Ajuda?

Durante o workshop:

- ✋ Levante a mão
- 👨‍🏫 Chame o professor
- 🤝 Peça ajuda a um colega

Após o workshop:

- 📧 Email: [colocar email]
- 💬 Discord: [colocar link]
- 🐛 GitHub Issues: [colocar repo]

---

## 🎉 Sistema Funcionando!

Parabéns! Você tem agora:

✅ Backend conectado ao Neon
✅ Frontend Next.js 15 rodando
✅ CRUD funcionando
✅ Chat IA com Function Calling
✅ Integração MCP com banco de dados

**Próximo passo:** Explorar, modificar e aprender! 🚀

---

## 📚 Quer Saber Mais?

**Arquivos Importantes:**

- `backend/server.js` - Backend proxy MCP
- `frontend/app/page.tsx` - Página principal
- `frontend/app/actions/receitas.ts` - Server Actions (CRUD)
- `frontend/lib/groq-client.ts` - Cliente IA
- `frontend/config/app.config.ts` - Suas configurações

**Documentação:**

- [Roadmap do Workshop](./ROADMAP_WORKSHOP.md) - Cronograma completo
- [Troubleshooting](./TROUBLESHOOTING.md) - Problemas comuns
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)

**Bom workshop! 🎓**
