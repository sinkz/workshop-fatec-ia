# 🚀 Como Rodar - ReceitasIA

**Guia Rápido de Instalação e Execução**

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ **Node.js 18 ou superior** ([baixar](https://nodejs.org))
- ✅ **npm** (vem com Node.js)
- ✅ **Git** (opcional, para clonar o repositório)

E precisa criar contas gratuitas em:

- ✅ **Neon** (https://neon.tech) - Database PostgreSQL
- ✅ **Groq** (https://console.groq.com) - IA

---

## ⚡ Quick Start (5 minutos)

### 1. Setup Neon Database

```bash
# Acesse https://neon.tech
# 1. Crie conta gratuita
# 2. Crie projeto "fatec-workspace"
# 3. Copie Connection String
# 4. Gere API Key
# 5. Execute SQL para criar tabela (ver abaixo)
```

**SQL para executar no Neon SQL Editor:**

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
 ARRAY['2 ovos', '1 xícara de açúcar', '1 xícara de farinha', '1/2 xícara de chocolate em pó'],
 'Misture tudo e leve ao forno a 180°C por 40 minutos.', 40, 8, 'medio', 'doce'),
('Salada Caesar', 'Salada clássica',
 ARRAY['Alface', 'Frango', 'Croutons', 'Parmesão'],
 'Monte a salada e finalize com molho.', 15, 2, 'facil', 'salgado'),
('Brigadeiro', 'Doce brasileiro',
 ARRAY['Leite condensado', 'Chocolate', 'Manteiga'],
 'Cozinhe mexendo sempre. Enrole e passe no granulado.', 20, 30, 'facil', 'doce');
```

### 2. Configurar Backend

```bash
# Navegar para pasta backend
cd exemplo_03/backend

# Instalar dependências
npm install

# Criar arquivo .env
cp env.example .env  # Mac/Linux
# OU
copy env.example .env  # Windows

# Editar .env e adicionar suas credenciais Neon
# NEON_DATABASE_URL="postgresql://..."
# NEON_API_KEY="napi_..."

# Iniciar backend
npm start
```

**Deve aparecer:**

```
✅ Conectado ao Neon MCP Server!
🌉 Backend Proxy MCP rodando na porta 3001
```

### 3. Configurar Frontend (nova aba do terminal)

```bash
# Navegar para pasta frontend
cd exemplo_03/frontend

# Instalar dependências
npm install

# Criar .env.local
cp env.example .env.local  # Mac/Linux
# OU
copy env.example .env.local  # Windows

# Editar .env.local
# NEON_DATABASE_URL="postgresql://..." (mesma do backend)

# Editar config/app.config.ts
# Colar seu token do Groq em groq.apiKey

# Iniciar frontend
npm run dev
```

**Deve aparecer:**

```
Ready on http://localhost:3000
```

### 4. Abrir no Navegador

```
http://localhost:3000
```

**Pronto! Sistema funcionando! 🎉**

---

## 📁 Estrutura do Projeto

```
exemplo_03/
├── backend/                 # Backend Express (porta 3001)
│   ├── server.js           # Servidor proxy MCP
│   ├── env.example         # Template de configuração
│   └── package.json
│
├── frontend/               # Frontend Next.js 15 (porta 3000)
│   ├── app/               # App Router Next.js
│   │   ├── actions/       # Server Actions (CRUD)
│   │   ├── page.tsx       # Página principal
│   │   └── layout.tsx     # Layout global
│   ├── components/        # Componentes React
│   │   ├── ReceitaCard.tsx
│   │   ├── ReceitaForm.tsx
│   │   ├── ReceitaDetalhes.tsx
│   │   ├── ReceitaPreview.tsx
│   │   └── Chat.tsx
│   ├── lib/              # Bibliotecas e utilitários
│   │   ├── mcp-client.ts   # Cliente MCP
│   │   ├── groq-client.ts  # Cliente Groq IA
│   │   └── utils.ts        # Funções utilitárias
│   ├── types/            # Tipos TypeScript
│   │   └── receita.ts
│   ├── config/           # 📍 CONFIGURAÇÃO ALUNOS
│   │   └── app.config.ts
│   ├── env.example       # Template .env.local
│   └── package.json
│
└── docs/                 # Documentação
    ├── ROADMAP_WORKSHOP.md
    ├── CONFIGURACAO_ALUNOS.md
    └── TROUBLESHOOTING.md
```

---

## 🔧 Variáveis de Ambiente

### Backend (.env)

```env
# Connection String do Neon PostgreSQL
NEON_DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# API Key do Neon (para operações administrativas via MCP)
NEON_API_KEY="napi_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Como obter:**

1. Connection String: Neon Console → Connection Details
2. API Key: Neon Console → Settings → API Keys

### Frontend (.env.local)

```env
# Mesma connection string do backend
NEON_DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Frontend (config/app.config.ts)

```typescript
export const appConfig = {
  groq: {
    // Token do Groq IA
    apiKey: "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  },
  backend: {
    url: "http://localhost:3001",
  },
};
```

**Como obter:**

- Groq Token: https://console.groq.com/keys → Create API Key

---

## 🧪 Testar o Sistema

### Teste 1: Backend Funcionando

```bash
curl http://localhost:3001/health
```

**Resposta esperada:**

```json
{
  "status": "ok",
  "neonMCP": "connected",
  "timestamp": "2025-01-21T..."
}
```

### Teste 2: Listar Receitas (MCP)

```bash
curl -X POST http://localhost:3001/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "run_sql",
    "arguments": {
      "sql": "SELECT titulo, categoria FROM recipes"
    }
  }'
```

### Teste 3: Frontend

1. Abrir http://localhost:3000
2. Ver 3 receitas no grid
3. Clicar em "Ver" em qualquer receita
4. Formulário de "Nova Receita" funciona

### Teste 4: Chat IA

1. No chat, digitar: `Quais receitas doces eu tenho?`
2. IA deve responder listando Bolo de Chocolate e Brigadeiro
3. Pedir: `Me sugira uma receita de mousse`
4. IA deve gerar receita + preview com botão salvar

---

## 🐛 Problemas Comuns

### Backend não conecta ao Neon

**Solução:**

- Verificar connection string (sem espaços, com `?sslmode=require`)
- Verificar API key
- Tentar gerar nova senha no Neon Console

### Frontend não carrega receitas

**Solução:**

- Verificar se backend está rodando (porta 3001)
- Verificar `.env.local` tem connection string
- Abrir DevTools (F12) → Console para ver erro

### Chat não responde

**Solução:**

- Verificar token do Groq em `config/app.config.ts`
- Verificar se backend está rodando
- Ver console do browser (F12) para erros

**📖 Ver guia completo:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

---

## 📦 Comandos Úteis

### Backend

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Limpar e reinstalar
rm -rf node_modules
npm install
```

### Frontend

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (porta 3000)
npm run dev

# Build de produção
npm run build
npm start

# Limpar cache Next.js
rm -rf .next

# Limpar e reinstalar tudo
rm -rf node_modules .next
npm install
```

---

## 🌐 Acessar o Sistema

Após iniciar backend e frontend:

- **Frontend:** http://localhost:3000
- **Backend Health:** http://localhost:3001/health
- **Backend Tools:** http://localhost:3001/tools

---

## 📚 Documentação Adicional

- **[ROADMAP_WORKSHOP.md](./docs/ROADMAP_WORKSHOP.md)** - Cronograma completo do workshop (4h)
- **[CONFIGURACAO_ALUNOS.md](./docs/CONFIGURACAO_ALUNOS.md)** - Guia passo-a-passo para alunos
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Problemas comuns e soluções

### Documentação Externa

- [Neon Database](https://neon.tech/docs)
- [Neon MCP Server](https://neon.tech/docs/ai/neon-mcp-server)
- [Next.js 15](https://nextjs.org/docs)
- [Groq API](https://console.groq.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

## 🎯 Funcionalidades

### CRUD Manual (UI Tradicional)

- ✅ Listar receitas em grid responsivo
- ✅ Criar nova receita via formulário
- ✅ Editar receita existente
- ✅ Deletar receita com confirmação
- ✅ Ver detalhes completos em modal

### Chat com IA (Groq)

- ✅ Conversar em linguagem natural
- ✅ Buscar receitas no banco ("Quais receitas doces tenho?")
- ✅ Pedir sugestões de receitas
- ✅ IA consulta schema do banco via MCP
- ✅ Preview de receitas sugeridas
- ✅ Salvar receita da IA no banco (opcional)

### Tecnologias

- ✅ Next.js 15 (App Router + Server Actions)
- ✅ PostgreSQL (Neon Database serverless)
- ✅ Groq IA com Function Calling
- ✅ Model Context Protocol (MCP)
- ✅ TypeScript + Tailwind CSS
- ✅ Responsivo (mobile-friendly)

---

## 🚢 Deploy (Opcional)

### Frontend (Vercel - Recomendado)

1. Push código para GitHub
2. Conectar repositório na Vercel
3. Configurar variáveis de ambiente:
   - `NEON_DATABASE_URL`
4. Deploy automático! ✅

### Backend (Railway/Render)

1. Push código para GitHub
2. Conectar repositório
3. Configurar variáveis:
   - `NEON_DATABASE_URL`
   - `NEON_API_KEY`
4. Atualizar `frontend/config/app.config.ts` com nova URL do backend

### Database

Neon já está na nuvem! Nada a fazer. ✅

---

## 📞 Suporte

**Durante o workshop:**

- ✋ Levantar a mão
- 👨‍🏫 Chamar professor
- 🤝 Pedir ajuda a colega

**Após o workshop:**

- 📧 Email: [adicionar aqui]
- 💬 Discord: [adicionar link]
- 🐛 GitHub Issues: [adicionar repo]

---

## 📄 Licença

Este projeto é educacional e open-source.

---

**✅ Pronto para começar! Boa sorte! 🚀**
