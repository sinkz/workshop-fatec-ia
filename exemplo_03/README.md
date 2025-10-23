# 🍳 ReceitasIA - Sistema de Receitas com Inteligência Artificial

> **Sistema completo de gerenciamento de receitas com IA + Neon PostgreSQL + Next.js 15**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-green)](https://neon.tech)
[![Groq](https://img.shields.io/badge/Groq-IA-orange)](https://groq.com)

---

## 🎯 Sobre Este Projeto

**ReceitasIA** é um sistema educacional completo que demonstra como integrar:

- 🤖 **Inteligência Artificial** (Groq) com **Function Calling**
- 🗄️ **Database PostgreSQL** (Neon) serverless e gratuito
- 🔌 **Protocolo MCP** (Model Context Protocol) para IA ↔ Database
- ⚡ **Next.js 15** com **Server Actions** e **App Router**
- 🎨 **UI Moderna** com Tailwind CSS e design culinário

> 📊 **[Ver Diagrama de Fluxo →](./FLUXO.md)** - Veja como Next.js unifica tudo

### Funcionalidades

#### CRUD Manual (UI Tradicional)

- ✅ Listar receitas em grid responsivo
- ✅ Criar nova receita via formulário
- ✅ Editar receita existente
- ✅ Deletar receita com confirmação
- ✅ Ver detalhes completos

#### Chat com IA

- ✅ Conversar em linguagem natural
- ✅ Buscar receitas no banco ("Quais receitas doces tenho?")
- ✅ Pedir sugestões de receitas
- ✅ IA consulta estrutura do banco via MCP
- ✅ Preview de receitas sugeridas
- ✅ Salvar receita da IA (opcional)

**Objetivo Educacional:** Ensinar integração moderna entre IA e Databases usando MCP.

---

## 🏗️ Arquitetura

```
┌────────────────────────────────────────────────┐
│  Frontend (Next.js 15) - Porta 3000            │
│  ├─ CRUD Manual → @neondatabase/serverless    │
│  │  └─ Server Actions (direto ao Neon)        │
│  │                                             │
│  └─ Chat IA (Groq) → Backend Proxy            │
│     └─ Function Calling + MCP                 │
└──────────────────┬─────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
     (HTTP)               (HTTP)
        │                     │
        v                     v
┌───────────────┐   ┌────────────────────┐
│  Neon DB      │   │  Backend Proxy     │
│  (cloud)      │   │  Porta 3001        │
│               │   │  ├─ Express        │
│  PostgreSQL   │◄──┤  └─ stdio → Neon   │
│  Serverless   │   │    MCP Server      │
└───────────────┘   └────────────────────┘
```

### Como Funciona:

**CRUD Manual (Lado Esquerdo):**

1. Usuário interage com formulário/botões
2. Frontend chama **Server Actions** do Next.js 15
3. Server Action conecta **diretamente** ao Neon via `@neondatabase/serverless`
4. Dados persistem no PostgreSQL
5. UI atualiza automaticamente (revalidação)

**Chat IA (Lado Direito):**

1. Usuário envia mensagem no chat
2. Frontend → **Groq** com Function Calling
3. Groq decide usar ferramentas MCP (ex: `run_sql`, `describe_table_schema`)
4. Frontend → **Backend Proxy** (HTTP)
5. Backend → **Neon MCP Server** (stdio)
6. MCP Server → **Neon Database** (executa SQL)
7. Resultado volta e IA gera resposta natural
8. Se IA sugerir receita, usuário pode salvar

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Conta gratuita no [Neon](https://neon.tech) (criar antes)
- Token do [Groq](https://console.groq.com)

### 1. Setup Neon Database

**Criar conta e database:**

1. Acesse https://neon.tech e crie conta gratuita
2. Crie novo projeto "receitas-workshop"
3. Copie a Connection String
4. Em Settings → API Keys → Gere novo API Key

**Criar tabela de receitas:**

No console SQL do Neon, execute:

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

-- Dados iniciais
INSERT INTO recipes (titulo, ingredientes, modo_preparo, tempo_preparo, porcoes, dificuldade, categoria) VALUES
('Bolo de Chocolate', ARRAY['2 ovos', '1 xícara açúcar', '1 xícara farinha', '1/2 xícara chocolate em pó'],
 'Misture tudo e leve ao forno por 30 minutos a 180°C', 40, 8, 'medio', 'doce'),
('Salada Caesar', ARRAY['Alface', 'Frango grelhado', 'Croutons', 'Parmesão', 'Molho Caesar'],
 'Corte a alface, adicione o frango em cubos, croutons e finalize com molho', 15, 2, 'facil', 'salgado');
```

### 2. Configurar Backend

```bash
cd backend
```

**Copie `env-example.txt` para `.env` e edite:**

```env
NEON_DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/receitas?sslmode=require"
NEON_API_KEY="seu_api_key_aqui"
```

**Inicie o backend:**

```bash
npm start
```

**Deve mostrar:**

```
✅ Conectado ao Neon MCP Server!
🌉 Backend Proxy MCP rodando na porta 3001
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

**Edite `src/config/config.ts`:**

```typescript
groq: {
  token: "COLOCAR_SEU_TOKEN_GROQ_AQUI",  // ← Cole seu token aqui
}
```

**Inicie o frontend:**

```bash
npm run dev
```

**Acesse:** `http://localhost:3000`

**🎉 Sistema funcionando!**

---

## 📸 Screenshots

### Página Principal

![Tela Principal](https://via.placeholder.com/800x400/ff6b35/ffffff?text=Grid+de+Receitas+%2B+Chat+IA)

_Grid de receitas responsivo + Chat IA integrado_

### Chat com IA

![Chat IA](https://via.placeholder.com/800x400/f7931e/ffffff?text=Chat+IA+com+Function+Calling)

_IA consulta banco via MCP e sugere receitas_

### Detalhes da Receita

![Detalhes](https://via.placeholder.com/800x400/ffd166/000000?text=Modal+de+Detalhes)

_Visualização completa com ingredientes e modo de preparo_

---

## 📁 Estrutura

```
exemplo_03/
├── backend/                    # Proxy MCP (porta 3001)
│   ├── server.js              # Express + Neon MCP Client
│   ├── env-example.txt        # Template de configuração
│   └── package.json
│
├── frontend/                   # React + Vite (porta 3000)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Groq, MCP, API
│   │   ├── config/            # ← Config para alunos
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── docs/                       # Documentação do workshop
│   ├── SETUP_NEON.md
│   ├── GUIA_WORKSHOP.md
│   └── CONFIGURACAO_ALUNOS.md
│
└── README.md                   # Este arquivo
```

---

## 🎓 Para o Workshop

### O Que os Alunos Vão Configurar:

1. **Criar conta no Neon** (5 min)
2. **Criar database e tabela** (10 min)
3. **Configurar backend/.env** (2 min)
4. **Configurar frontend/src/config/config.ts** (1 min)
5. **Rodar e testar** (5 min)

**Total: ~25 minutos de setup**

### O Que Vem Pronto:

- ✅ Todo código do frontend
- ✅ Todo código do backend
- ✅ Componentes UI
- ✅ Integração MCP
- ✅ Chat com IA

---

## 🧪 Funcionalidades Detalhadas

### CRUD Manual (Interface Tradicional)

| Ação             | Descrição                         | Tecnologia                |
| ---------------- | --------------------------------- | ------------------------- |
| **Listar**       | Grid responsivo com cards visuais | Server Actions + Tailwind |
| **Criar**        | Formulário completo com validação | React Hook Form + Zod     |
| **Editar**       | Modal de edição inline            | Server Actions            |
| **Deletar**      | Confirmação antes de remover      | Server Actions            |
| **Ver Detalhes** | Modal com receita completa        | React Portal              |

### Chat com IA (Linguagem Natural)

**Exemplos de Comandos:**

```bash
# Buscar receitas existentes
👤: "Quais receitas doces eu tenho?"
🤖: "Encontrei 2 receitas doces: Bolo de Chocolate e Brigadeiro..."

# Consultar estrutura do banco
👤: "Qual é a estrutura da tabela recipes?"
🤖: "A tabela recipes tem os seguintes campos: id, titulo, ingredientes..."

# Pedir sugestão de receita
👤: "Me sugira uma receita de mousse de maracujá"
🤖: [Gera receita compatível com schema do banco]
    [Exibe preview com botões "Salvar" ou "Apenas Ver"]

# Comandos avançados
👤: "Quais receitas levam menos de 30 minutos?"
👤: "Me mostre receitas de sobremesa"
👤: "Quantas receitas eu tenho cadastradas?"
```

**Fluxo do Chat:**

1. IA consulta schema do banco (via MCP)
2. IA gera receita no formato correto
3. Usuário visualiza preview
4. Usuário decide: salvar OU apenas ver
5. Se salvar, receita aparece na lista!

---

## 🎓 Para Workshops e Ensino

Este projeto foi desenvolvido especialmente para **workshops educacionais** sobre IA e Databases.

### 📚 Documentação Completa

- **[ROADMAP_WORKSHOP.md](./docs/ROADMAP_WORKSHOP.md)** - Cronograma de 4 horas para professores
- **[CONFIGURACAO_ALUNOS.md](./docs/CONFIGURACAO_ALUNOS.md)** - Guia passo-a-passo para alunos
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Problemas comuns e soluções
- **[COMO_RODAR.md](./COMO_RODAR.md)** - Instruções rápidas de instalação

### 🎯 O Que os Alunos Aprendem

1. **Next.js 15 Avançado**

   - Server Actions
   - App Router
   - Server Components vs Client Components

2. **Database Real (Neon PostgreSQL)**

   - Conexão serverless
   - SQL queries
   - Migrações de schema

3. **Inteligência Artificial**

   - Function Calling
   - Prompt engineering
   - Integração com LLMs

4. **Protocolo MCP**

   - Como IA "enxerga" databases
   - Tools e Resources
   - Arquitetura cliente-servidor

5. **Boas Práticas**
   - TypeScript strict
   - Atomic Design
   - Configuração didática isolada
   - Clean Architecture

### 📊 Comparação com Outros Exemplos

| Aspecto          | exemplo_01      | exemplo_02      | **exemplo_03**               |
| ---------------- | --------------- | --------------- | ---------------------------- |
| **Tema**         | Vendas          | Produtos        | **Receitas**                 |
| **Database**     | JSON Server     | Mock (RAM)      | **Neon Postgres (cloud)**    |
| **MCP Server**   | Customizado     | Customizado     | **Neon Oficial**             |
| **Frontend**     | React + TS      | HTML Vanilla    | **Next.js 15 + Tailwind**    |
| **Backend**      | Express + Proxy | Express simples | **Express Proxy MCP**        |
| **UI**           | Bootstrap-like  | CSS puro        | **Design System completo**   |
| **Complexidade** | ⭐⭐⭐⭐⭐      | ⭐⭐            | ⭐⭐⭐⭐                     |
| **Aprende**      | MCP completo    | MCP conceitos   | **Database Real + IA + MCP** |

---

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React com Server Actions
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **@neondatabase/serverless** - Cliente Neon para edge

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **@modelcontextprotocol/sdk** - SDK MCP oficial
- **dotenv** - Gerenciamento de variáveis de ambiente

### Database

- **Neon PostgreSQL** - PostgreSQL serverless
- **Neon MCP Server** - Servidor MCP oficial do Neon

### IA

- **Groq** - LLM rápido com Function Calling
- **groq-sdk** - SDK oficial do Groq

---

## 🌟 Diferenciais

### 1. Database Real na Nuvem

- ✅ Não é mock ou arquivo JSON
- ✅ PostgreSQL de verdade (Neon)
- ✅ Persiste entre sessões
- ✅ Escalável e gratuito

### 2. MCP Server Oficial

- ✅ Mantido pelo Neon
- ✅ Produção-ready
- ✅ Mais ferramentas disponíveis
- ✅ Atualizações automáticas

### 3. Design System Profissional

- ✅ Tema culinário atrativo
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade
- ✅ Loading states e animações

### 4. Configuração Didática

- ✅ Arquivo config.ts isolado para alunos
- ✅ Comentários explicativos
- ✅ Documentação completa
- ✅ Troubleshooting detalhado

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Este é um projeto educacional open-source.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Ideias de Melhorias

- [ ] Autenticação de usuários (NextAuth)
- [ ] Upload de imagens de receitas
- [ ] Sistema de avaliações (estrelas)
- [ ] Compartilhamento social
- [ ] PWA para uso offline
- [ ] Suporte a múltiplos idiomas
- [ ] Modo escuro

---

## 📄 Licença

Este projeto é open-source e está sob a licença MIT. Use livremente para fins educacionais.

---

## 🙏 Agradecimentos

- **Neon** - Por fornecer PostgreSQL serverless gratuito
- **Groq** - Por LLMs rápidos e acessíveis
- **Anthropic** - Pelo protocolo MCP open-source
- **Vercel** - Por Next.js 15 incrível
- **Comunidade Open Source** - Por compartilhar conhecimento

---

## 📞 Contato e Suporte

**Durante Workshop:**

- ✋ Levantar a mão
- 👨‍🏫 Chamar professor
- 🤝 Pedir ajuda a colega

**Após Workshop:**

- 📧 Email: [adicionar aqui]
- 💬 Discord: [adicionar link]
- 🐛 Issues: [GitHub Issues](./issues)
- 📚 Docs: Ver pasta `docs/`

---

## 🎉 Pronto para Começar!

1. Siga o **[COMO_RODAR.md](./COMO_RODAR.md)** para setup rápido
2. Leia a **[CONFIGURACAO_ALUNOS.md](./docs/CONFIGURACAO_ALUNOS.md)** se for aluno
3. Professores vejam o **[ROADMAP_WORKSHOP.md](./docs/ROADMAP_WORKSHOP.md)**

**Explore o poder de IA + Database Real com MCP! 🚀**

**⭐ Se gostou, dê uma star no repositório!**
