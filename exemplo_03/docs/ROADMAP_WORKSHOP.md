# 📅 Roadmap do Workshop - Sistema de Receitas com IA

**Duração Total**: 4 horas
**Público**: Alunos de desenvolvimento web
**Nível**: Intermediário
**Tecnologias**: Next.js 15, Neon PostgreSQL, Groq IA, MCP (Model Context Protocol)

---

## 🎯 Objetivos do Workshop

Ao final deste workshop, os alunos serão capazes de:

1. ✅ Conectar uma aplicação Next.js diretamente ao Neon PostgreSQL
2. ✅ Implementar CRUD completo usando Server Actions (Next.js 15)
3. ✅ Integrar IA (Groq) com Function Calling
4. ✅ Usar o protocolo MCP para comunicação IA ↔ Banco de Dados
5. ✅ Criar uma aplicação full-stack moderna e responsiva

---

## 📋 Pré-requisitos

### Conhecimentos Necessários:

- React básico (componentes, hooks, state)
- TypeScript básico
- SQL básico (SELECT, INSERT, UPDATE, DELETE)
- Terminal/linha de comando

### Ferramentas Instaladas:

- Node.js 18+
- npm ou yarn
- Git
- Editor de código (VS Code recomendado)

### Contas Necessárias:

- Conta gratuita no [Neon](https://neon.tech) (criar antes)
- Conta gratuita no [Groq](https://console.groq.com) (criar antes)

---

## ⏱️ Cronograma Detalhado

### **FASE 1: Setup e Configuração** (45 min)

#### 1.1 Apresentação do Projeto (10 min)

**O que fazer:**

1. Demonstrar o sistema funcionando:

   - Listar receitas
   - Criar nova receita via formulário
   - Pedir receita para a IA no chat
   - Salvar receita sugerida pela IA
   - Ver a receita aparecer na lista

2. Explicar a arquitetura:

   ```
   Frontend (Next.js) ──────┐
                            │
                            ├─ CRUD Manual → Neon Database (Server Actions)
                            │
                            └─ Chat IA → Backend Proxy → Neon MCP Server → Database
   ```

3. Destacar as tecnologias:
   - **Next.js 15**: Server Actions, App Router
   - **Neon Database**: PostgreSQL serverless, gratuito
   - **Groq**: IA rápida com Function Calling
   - **MCP**: Protocolo para IA entender databases

**Recursos:**

- Slides com diagramas de arquitetura
- Demo ao vivo do sistema funcionando

---

#### 1.2 Setup Neon Database (20 min)

**Passo a Passo:**

1. **Criar Conta (3 min)**

   - Acessar https://neon.tech
   - Sign up gratuito (sem cartão de crédito)
   - Verificar email

2. **Criar Projeto (3 min)**

   - Clicar em "Create Project"
   - Nome: `fatec-workspace`
   - Region: `US East (Ohio)` (mais rápida)
   - PostgreSQL version: 16
   - Clicar em "Create Project"

3. **Copiar Connection String (2 min)**

   - No dashboard, clicar em "Connection Details"
   - Copiar a connection string completa
   - Formato: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`
   - Guardar em arquivo temporário

4. **Obter API Key (2 min)**

   - Ir em Settings → API Keys
   - Clicar em "Generate New Key"
   - Nome: `workshop-fatec`
   - Copiar a key (começa com `napi_`)

5. **Criar Tabela recipes (10 min)**
   - No dashboard Neon, abrir "SQL Editor"
   - Copiar e executar o SQL:

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

**Verificar:**

- Executar `SELECT * FROM recipes;`
- Deve retornar 3 receitas

---

#### 1.3 Configurar Backend (10 min)

**Passo a Passo:**

1. **Navegar para pasta backend (1 min)**

   ```bash
   cd exemplo_03/backend
   ```

2. **Instalar dependências (2 min)**

   ```bash
   npm install
   ```

3. **Criar arquivo .env (2 min)**

   - Copiar `env.example` para `.env`
   - Windows: `copy env.example .env`
   - Mac/Linux: `cp env.example .env`

4. **Editar .env (3 min)**

   - Abrir `.env` no editor
   - Colar connection string do Neon
   - Colar API key do Neon
   - Salvar

5. **Iniciar backend (2 min)**
   ```bash
   npm start
   ```

**Verificar:**

- Terminal deve mostrar:
  ```
  ✅ Conectado ao Neon MCP Server!
  🌉 Backend Proxy MCP rodando na porta 3001
  ```
- Abrir navegador: `http://localhost:3001/health`
- Deve retornar: `{"status":"ok","neonMCP":"connected"}`

---

#### 1.4 Configurar Frontend (5 min)

**Passo a Passo:**

1. **Abrir nova aba do terminal (1 min)**

   - Deixar backend rodando
   - Abrir nova aba/janela

2. **Navegar para pasta frontend (1 min)**

   ```bash
   cd exemplo_03/frontend
   ```

3. **Instalar dependências (1 min)**

   ```bash
   npm install
   ```

4. **Criar .env.local (1 min)**

   - Copiar `env.example` para `.env.local`
   - Colar a MESMA connection string do backend

5. **Configurar Token Groq (1 min)**

   - Abrir `config/app.config.ts`
   - Acessar https://console.groq.com/keys
   - Criar API key
   - Colar em `groq.apiKey`
   - Salvar

6. **Iniciar frontend (1 min)**
   ```bash
   npm run dev
   ```

**Verificar:**

- Terminal mostra: `Ready on http://localhost:3000`
- Abrir navegador: `http://localhost:3000`
- Deve ver interface do ReceitasIA

---

### **FASE 2: Explorar CRUD Manual** (30 min)

**Objetivo:** Entender Server Actions e conexão direta com Neon

#### 2.1 Listar Receitas (5 min)

**Demonstrar:**

1. Ver as 3 receitas iniciais no grid
2. Abrir DevTools → Network
3. Mostrar que não há chamadas HTTP tradicionais
4. Explicar Server Actions do Next.js 15

**Código para Explicar:**

- `app/actions/receitas.ts` → `listarReceitas()`
- Mostra conexão direta com Neon via `@neondatabase/serverless`

---

#### 2.2 Criar Receita (10 min)

**Hands-on:**

1. Clicar em "Nova Receita"
2. Preencher formulário:

   - Título: "Pão de Queijo"
   - Ingredientes (um por linha):
     ```
     1 xícara de polvilho azedo
     1/2 xícara de leite
     1/4 xícara de óleo
     1 ovo
     100g de queijo ralado
     Sal a gosto
     ```
   - Modo de Preparo:
     ```
     Ferva o leite com óleo e sal. Adicione o polvilho e misture bem.
     Deixe esfriar, adicione ovo e queijo. Faça bolinhas e asse a 180°C
     por 20 minutos.
     ```
   - Tempo: 30 minutos
   - Porções: 20
   - Dificuldade: Fácil
   - Categoria: salgado

3. Clicar em "Salvar Receita"
4. Ver receita aparecer no grid

**Verificar no Neon:**

- Abrir SQL Editor no Neon
- Executar: `SELECT * FROM recipes ORDER BY id DESC LIMIT 1;`
- Deve mostrar o Pão de Queijo recém-criado

---

#### 2.3 Editar e Deletar (10 min)

**Hands-on:**

1. Clicar em "Ver" em qualquer receita
2. Ver detalhes completos no modal
3. Clicar em "Editar"
4. Modificar algo (ex: aumentar tempo)
5. Salvar
6. Ver mudança refletida

7. Clicar em "Deletar" em outra receita
8. Confirmar
9. Ver receita sumir da lista

---

#### 2.4 Explorar Código (5 min)

**Arquivos para Mostrar:**

1. **Server Actions** (`app/actions/receitas.ts`)

   - Mostrar `'use server'` directive
   - Conexão com Neon
   - Uso de `revalidatePath()` para atualização automática

2. **Componentes**
   - `components/ReceitaCard.tsx` - Card visual
   - `components/ReceitaForm.tsx` - Formulário
   - `app/page.tsx` - Página principal

**Perguntas e Respostas**

---

### **FASE 3: Entender MCP e Chat IA** (60 min)

**Objetivo:** Compreender protocolo MCP e Function Calling

#### 3.1 O que é MCP? (15 min)

**Apresentação Teórica:**

1. **Problema que MCP resolve:**

   - IA tradicionalmente "cega" para dados externos
   - Cada integração precisa código custom
   - Difícil para IA entender estruturas de dados

2. **Solução MCP:**

   - Protocolo padronizado
   - IA pode "ver" e "interagir" com ferramentas
   - Servidores MCP expõem tools e resources

3. **Arquitetura MCP:**

   ```
   ┌──────────────┐
   │  LLM (Groq)  │ "Quero consultar o banco"
   └──────┬───────┘
          │
          │ Function Calling
          │
   ┌──────▼───────┐
   │  MCP Client  │ "Executa run_sql"
   │  (Frontend)  │
   └──────┬───────┘
          │
          │ HTTP
          │
   ┌──────▼───────┐
   │ Backend      │ "Traduz HTTP → stdio"
   │ Proxy        │
   └──────┬───────┘
          │
          │ stdio (JSON-RPC)
          │
   ┌──────▼───────┐
   │ Neon MCP     │ "Executa SQL no banco"
   │ Server       │
   └──────┬───────┘
          │
   ┌──────▼───────┐
   │ Neon DB      │
   └──────────────┘
   ```

4. **Ferramentas do Neon MCP:**
   - `run_sql` - Executar queries SQL
   - `describe_table_schema` - Ver estrutura de tabelas
   - `list_tables` - Listar tabelas do banco
   - `create_branch` - Criar branch do database (avançado)

**Demonstração Prática:**

Testar ferramentas MCP via Postman/curl:

```bash
# Listar ferramentas disponíveis
curl http://localhost:3001/tools

# Executar SQL via MCP
curl -X POST http://localhost:3001/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "run_sql",
    "arguments": {
      "sql": "SELECT titulo, categoria FROM recipes LIMIT 3"
    }
  }'
```

---

#### 3.2 Como Funciona o Chat (20 min)

**Demonstração ao Vivo:**

1. **Abrir Chat no sistema**

2. **Enviar mensagem simples:**

   ```
   Olá!
   ```

   - IA responde sem usar tools

3. **Enviar consulta ao banco:**

   ```
   Quais receitas doces eu tenho?
   ```

   - Abrir DevTools → Network
   - Mostrar chamadas:
     1. POST ao Groq (decisão de usar tool)
     2. POST ao backend MCP (executar `run_sql`)
     3. Novo POST ao Groq (com resultado)
   - IA responde com dados reais do banco

4. **Pedir para IA consultar schema:**
   ```
   Qual é a estrutura da tabela recipes?
   ```
   - IA usa `describe_table_schema`
   - Retorna colunas, tipos, constraints

**Código para Explicar:**

1. **Groq Client** (`lib/groq-client.ts`)

   - Inicialização do Groq SDK
   - Function Calling
   - Loop de tool calls

2. **Prompt System:**

   ```typescript
   const SYSTEM_PROMPT = `
   Você é um assistente de receitas.
   Você tem acesso ao banco via ferramentas MCP.
   
   IMPORTANTE:
   - NUNCA salve receitas diretamente
   - Sempre gere receitas para usuário VER PRIMEIRO
   - Usuário decide se quer salvar
   `;
   ```

3. **MCP Client** (`lib/mcp-client.ts`)
   - Fetch ao backend proxy
   - Tradução HTTP ↔ MCP

---

#### 3.3 Receita Sugerida pela IA (15 min)

**Hands-on:**

1. **Pedir receita no chat:**

   ```
   Me sugira uma receita de mousse de maracujá
   ```

2. **Observar comportamento:**

   - IA consulta schema (describe_table_schema)
   - IA gera receita compatível com estrutura do banco
   - IA retorna receita em JSON + texto explicativo
   - Frontend exibe preview bonito da receita

3. **Ver Preview:**

   - Card especial com badge "SUGESTÃO DA IA"
   - Mostra ingredientes, modo de preparo
   - Dois botões: "Salvar no Banco" e "Apenas Ver"

4. **Salvar Receita:**
   - Clicar em "💾 Salvar no Banco"
   - Ver loading
   - Ver mensagem de sucesso no chat
   - Ver receita aparecer na lista à esquerda

**Verificar no Banco:**

```sql
SELECT * FROM recipes WHERE titulo ILIKE '%mousse%';
```

---

#### 3.4 Experimentação Livre (10 min)

**Desafios para Alunos:**

1. **Buscar receitas:**

   - "Quais receitas fáceis eu tenho?"
   - "Mostre receitas que levam menos de 20 minutos"
   - "Quais categorias de receitas existem?"

2. **Pedir múltiplas receitas:**

   - "Me sugira 3 receitas de sobremesa"

3. **Testar limites:**
   - "Delete todas as receitas" (IA deve recusar)
   - "Altere o título da receita X" (IA deve recusar)

**Discussão:**

- Por que a IA não executa comandos destrutivos?
- Como o prompt system protege o banco?

---

### **FASE 4: Customização e Extensões** (90 min)

**Objetivo:** Modificar e estender o sistema

#### 4.1 Adicionar Novo Campo (30 min)

**Tarefa:** Adicionar campo "origem" (país da receita)

**Passo a Passo:**

1. **Modificar schema SQL (5 min)**

   - No Neon SQL Editor:

   ```sql
   ALTER TABLE recipes
   ADD COLUMN origem VARCHAR(100);

   -- Atualizar receitas existentes
   UPDATE recipes SET origem = 'Brasil' WHERE categoria = 'doce';
   ```

2. **Atualizar tipos TypeScript (5 min)**

   - Editar `types/receita.ts`:

   ```typescript
   export interface Receita {
     // ... campos existentes
     origem?: string;
   }
   ```

3. **Atualizar Server Actions (5 min)**

   - Editar `app/actions/receitas.ts`:
   - Adicionar `origem` em INSERT e UPDATE

4. **Atualizar formulário (10 min)**

   - Editar `components/ReceitaForm.tsx`:
   - Adicionar input para origem

   ```tsx
   <input
     type="text"
     value={formData.origem}
     onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
     placeholder="Ex: Brasil, Itália, México..."
   />
   ```

5. **Testar (5 min)**
   - Criar nova receita com origem
   - Ver campo salvo no banco
   - Editar receita existente e adicionar origem

---

#### 4.2 Melhorar UI (30 min)

**Tarefa 1: Adicionar Filtros (15 min)**

- Adicionar botões de filtro por categoria
- Adicionar select de dificuldade
- Implementar busca por texto

**Tarefa 2: Melhorar Responsividade (15 min)**

- Testar em mobile (DevTools)
- Ajustar grid de cards
- Melhorar tabs em telas pequenas

---

#### 4.3 Expandir Chat (30 min)

**Tarefa 1: Buscar por Ingrediente (15 min)**

Ensinar IA a buscar receitas que contenham um ingrediente:

1. **Criar nova ferramenta (conceitual):**

   ```typescript
   {
     name: "buscar_por_ingrediente",
     description: "Busca receitas que contenham um ingrediente específico",
     parameters: {
       ingrediente: "string"
     }
   }
   ```

2. **Atualizar prompt:**

   ```
   Quando usuário perguntar "o que posso fazer com X",
   use run_sql com:
   SELECT * FROM recipes WHERE 'X' = ANY(ingredientes)
   ```

3. **Testar:**
   - "O que posso fazer com chocolate?"
   - "Quais receitas usam leite?"

**Tarefa 2: Dicas de Cozinha (15 min)**

- Ensinar IA a dar dicas
- Pedir conversões (xícara → ml)
- Sugerir substituições de ingredientes

---

### **FASE 5: Deploy e Próximos Passos** (15 min)

#### 5.1 Opções de Deploy (5 min)

**Frontend (Next.js):**

- Vercel (recomendado - gratuito)
- Netlify
- GitHub Pages

**Backend (Node.js):**

- Railway (gratuito)
- Render
- Digital Ocean

**Database:**

- Neon já está na nuvem! ✅

**Demonstrar Deploy na Vercel:**

1. Conectar repositório GitHub
2. Configurar env vars
3. Deploy automático

---

#### 5.2 Próximos Passos Sugeridos (5 min)

**Funcionalidades para Implementar:**

1. **Autenticação:**

   - NextAuth.js
   - Receitas privadas por usuário

2. **Upload de Imagens:**

   - Cloudinary ou Uploadthing
   - Fotos reais das receitas

3. **Avaliações:**

   - Sistema de estrelas
   - Comentários

4. **Compartilhamento:**

   - Share em redes sociais
   - QR Code da receita

5. **Modo Offline:**
   - PWA
   - Cache local

---

#### 5.3 Recursos Adicionais (5 min)

**Documentação:**

- [Neon Docs](https://neon.tech/docs)
- [Neon MCP Server](https://neon.tech/docs/ai/neon-mcp-server)
- [Next.js 15](https://nextjs.org/docs)
- [Groq SDK](https://console.groq.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)

**Comunidade:**

- Discord do Neon
- Discord do MCP
- Stack Overflow
- GitHub Issues

**Certificados (opcional):**

- Gerar certificado de participação
- Badge "Completed ReceitasIA Workshop"

---

## ✅ Checklist do Professor

### Antes do Workshop:

- [ ] Testar sistema completo em ambiente local
- [ ] Preparar slides de apresentação
- [ ] Criar conta Neon para demonstração
- [ ] Criar conta Groq para demonstração
- [ ] Ter código de backup em caso de problemas
- [ ] Preparar certificados (se aplicável)

### Durante o Workshop:

- [ ] Começar no horário
- [ ] Verificar que todos conseguiram criar conta Neon
- [ ] Pausar para dúvidas após cada fase
- [ ] Circular pela sala auxiliando alunos
- [ ] Tirar screenshots de erros comuns
- [ ] Manter energia e entusiasmo!

### Após o Workshop:

- [ ] Coletar feedback dos alunos
- [ ] Compartilhar link do código no GitHub
- [ ] Enviar certificados
- [ ] Compartilhar recursos adicionais
- [ ] Responder dúvidas via email/Discord

---

## 🎉 Conclusão

Este workshop oferece uma experiência hands-on completa de desenvolvimento moderno com IA. Os alunos saem com:

- ✅ Aplicação full-stack funcionando
- ✅ Conhecimento de Next.js 15 (Server Actions)
- ✅ Experiência com PostgreSQL (Neon)
- ✅ Entendimento de IA + Function Calling
- ✅ Introdução ao protocolo MCP
- ✅ Projeto para portfolio

**Boa sorte e bom workshop! 🚀**
