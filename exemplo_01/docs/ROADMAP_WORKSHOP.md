# 🗺️ Roadmap Workshop - MCP Server do Zero

> **Workshop de 4 horas para criar um servidor MCP completo com integração frontend** > **Nível:** Iniciante em TypeScript/Node.js
> **Objetivo:** Construir sistema de vendas com IA usando Model Context Protocol

---

## 📚 Índice

1. [Introdução](#-introdução-10-min)
2. [Bloco 1: Setup e Estrutura](#%EF%B8%8F-bloco-1-setup-e-estrutura-30-min)
3. [Bloco 2: Fundamentos MCP](#-bloco-2-fundamentos-mcp-40-min)
4. [Bloco 3: Ferramentas de Produtos](#-bloco-3-ferramentas-de-produtos-45-min)
5. [PAUSA](#%EF%B8%8F-pausa-15-min)
6. [Bloco 4: Ferramentas de Vendas](#-bloco-4-ferramentas-de-vendas-45-min)
7. [Bloco 5: Resources e Utils](#%EF%B8%8F-bloco-5-resources-e-utils-30-min)
8. [Bloco 6: Configuração Frontend](#-bloco-6-configuração-frontend-45-min)
9. [Bloco 7: Testes Finais](#-bloco-7-testes-finais-20-min)

---

## 📚 INTRODUÇÃO (10 min)

### O que é MCP?

**MCP (Model Context Protocol)** é um protocolo que permite que aplicações de chat (Claude, ChatGPT, etc.) se conectem com sistemas externos de forma padronizada e segura.

### Por que usar MCP?

#### ❌ Sem MCP (Problema)

```
Chat IA → Inventa dados → Alucinações → Informações falsas
```

#### ✅ Com MCP (Solução)

```
Chat IA → MCP Server → API Real → Dados verdadeiros → Respostas precisas
```

### Vantagens do MCP

1. **Descoberta Automática**: O chat descobre quais ferramentas estão disponíveis
2. **Validação Automática**: Parâmetros são validados pelo protocolo
3. **Contexto Semântico**: O chat entende o que cada ferramenta faz
4. **Segurança**: Controle granular sobre operações permitidas
5. **Padronização**: Interface consistente independente do backend

### Arquitetura Final

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   MCP Server    │    │   Backend API   │
│   React + Chat  │◄──►│   12 Tools      │◄──►│   Express +     │
│   Groq.ai       │    │   3 Resources   │    │   JSON Server   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### O que vamos construir?

- ✅ 12 ferramentas MCP em português
- ✅ 3 recursos educacionais
- ✅ Sistema completo de produtos e vendas
- ✅ Chat IA integrado com dados reais
- ✅ Sistema anti-alucinação

---

## ⚙️ BLOCO 1: SETUP E ESTRUTURA (30 min)

### 🎯 Objetivos

- Criar projeto do zero
- Configurar TypeScript e dependências
- Estrutura de pastas profissional

### Passo 1.1: Criar Projeto (5 min)

```bash
# 1. Criar pasta do projeto
mkdir mcp-server
cd mcp-server

# 2. Inicializar projeto Node.js
npm init -y
```

**✅ Checkpoint:** Arquivo `package.json` criado

### Passo 1.2: Configurar package.json (5 min)

Abra `package.json` e substitua o conteúdo:

```json
{
  "name": "sales-mcp-server",
  "version": "1.0.0",
  "description": "MCP Server for Sales API context",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "node --loader ts-node/esm src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "axios": "^1.6.0",
    "zod": "^3.22.4",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1"
  }
}
```

**📝 Explicação das Dependências:**

- `@modelcontextprotocol/sdk`: SDK oficial do MCP
- `axios`: Cliente HTTP para chamar nossa API
- `zod`: Validação de dados
- `winston`: Sistema de logging profissional

```bash
# 3. Instalar dependências
npm install
```

**✅ Checkpoint:** Dependências instaladas sem erros

### Passo 1.3: Configurar TypeScript (5 min)

Crie o arquivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**📝 Explicação:** Configuração TypeScript moderna com ES Modules

### Passo 1.4: Criar Estrutura de Pastas (10 min)

```bash
# Criar estrutura completa
mkdir -p src/{types,utils,tools,resources}
mkdir -p logs

# Criar arquivos vazios (vamos preencher depois)
touch src/index.ts
touch src/types/mcp.ts
touch src/types/api.ts
touch src/utils/api-client.ts
touch src/utils/logger.ts
touch src/utils/retry.ts
touch src/utils/tool-registry.ts
touch src/tools/produtos.ts
touch src/tools/vendas.ts
touch src/resources/documentacao.ts
```

**Estrutura Final:**

```
mcp-server/
├── src/
│   ├── index.ts                  # Servidor principal
│   ├── types/
│   │   ├── mcp.ts               # Tipos do MCP
│   │   └── api.ts               # Tipos da API
│   ├── utils/
│   │   ├── api-client.ts        # Cliente HTTP
│   │   ├── logger.ts            # Sistema de logs
│   │   ├── retry.ts             # Retry automático
│   │   └── tool-registry.ts     # Registro de ferramentas
│   ├── tools/
│   │   ├── produtos.ts          # 5 ferramentas de produtos
│   │   └── vendas.ts            # 6 ferramentas de vendas
│   └── resources/
│       └── documentacao.ts      # 3 recursos educacionais
├── logs/                         # Arquivos de log
├── package.json
└── tsconfig.json
```

**✅ Checkpoint Final:** Estrutura completa criada

### ⚠️ Possíveis Erros

| Erro                        | Solução                           |
| --------------------------- | --------------------------------- |
| `npm install` falha         | Verifique conexão internet        |
| Permissão negada no `mkdir` | Use `sudo` ou terminal como admin |
| TypeScript não reconhecido  | Execute `npm install` novamente   |

---

## 🔧 BLOCO 2: FUNDAMENTOS MCP (40 min)

### 🎯 Objetivos

- Entender tipos MCP
- Criar servidor básico
- Implementar primeira ferramenta

### 📖 Teoria: MCP Tools vs Resources (5 min)

#### 🔧 TOOLS (Ferramentas)

- **Executam AÇÕES** (criar, atualizar, deletar)
- **Modificam** o estado do sistema
- **Recebem parâmetros** dinâmicos
- **Exemplo:** `criar_produto`, `atualizar_estoque`

#### 📚 RESOURCES (Recursos)

- **Fornecem INFORMAÇÕES** estáticas
- **NÃO modificam** o sistema
- **Conteúdo fixo** (documentação, esquemas)
- **Exemplo:** Manual de uso, esquema de dados

#### Quando usar cada um?

- **Use TOOLS** quando precisa **FAZER** algo
- **Use RESOURCES** quando precisa **SABER** algo

### Passo 2.1: Criar Tipos MCP (10 min)

Abra `src/types/mcp.ts` e adicione:

```typescript
export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface MCPServerConfig {
  name: string;
  version: string;
  apiBaseUrl: string;
  timeout: number;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolHandler {
  (args: Record<string, any>): Promise<MCPToolResult>;
}

export interface MCPToolRegistry {
  [toolName: string]: {
    definition: MCPTool;
    handler: MCPToolHandler;
  };
}

export interface RecursoMCP {
  uri: string;
  nome: string;
  descricao: string;
  tipoMime: string;
}

export interface ConteudoRecursoMCP {
  uri: string;
  tipoMime: string;
  conteudo: string;
}
```

**📝 Explicação:**

- `MCPTool`: Define como uma ferramenta se parece (metadados)
- `MCPToolHandler`: Função que executa a ferramenta
- `MCPToolResult`: Formato de resposta padronizado
- `RecursoMCP`: Recursos estáticos (documentação)

**✅ Checkpoint:** Arquivo sem erros de TypeScript

### Passo 2.2: Criar Tipos da API (5 min)

Abra `src/types/api.ts`:

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  createdAt: string;
}

export interface Sale {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  customerName: string;
  saleDate: string;
  product?: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**📝 Explicação:** Tipos que representam nossos dados de negócio

### Passo 2.3: Criar Servidor MCP Básico (15 min)

Abra `src/index.ts` e adicione:

```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { MCPServerConfig } from "./types/mcp.js";

const configuracao: MCPServerConfig = {
  name: "servidor-mcp-vendas",
  version: "1.0.0",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
  timeout: 30000,
};

async function iniciarServidor(): Promise<void> {
  const servidor = new Server({
    name: configuracao.name,
    version: configuracao.version,
  });

  // Lista de ferramentas (vazio por enquanto)
  const ferramentas: any[] = [];

  // Handler para listar ferramentas
  servidor.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error(`[MCP] Listando ${ferramentas.length} ferramentas`);
    return { tools: ferramentas };
  });

  // Handler para executar ferramentas
  servidor.setRequestHandler(CallToolRequestSchema, async (requisicao) => {
    const { name: nome, arguments: argumentos } = requisicao.params;
    console.error(`[MCP] Executando ferramenta: ${nome}`);

    return {
      content: [
        {
          type: "text",
          text: `Ferramenta ${nome} ainda não implementada`,
        },
      ],
    };
  });

  // Iniciar servidor
  const transporte = new StdioServerTransport();
  await servidor.connect(transporte);

  console.error(`🚀 Servidor MCP ${configuracao.name} iniciado`);
  console.error(`🌐 URL da API: ${configuracao.apiBaseUrl}`);
}

// Tratamento de encerramento
process.on("SIGINT", async () => {
  console.error("🛑 Servidor MCP encerrando...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.error("🛑 Servidor MCP terminado");
  process.exit(0);
});

// Iniciar
iniciarServidor().catch((erro) => {
  console.error("❌ Falha ao iniciar servidor MCP:", erro);
  process.exit(1);
});
```

**📝 Explicação Detalhada:**

1. **Servidor MCP**: Criado com SDK oficial
2. **Stdio Transport**: Comunicação via stdin/stdout
3. **Handlers**: Respondem a requisições do chat
4. **Error Handling**: Tratamento robusto de erros

### Passo 2.4: Testar Servidor (5 min)

```bash
# Execute o servidor
npm run dev
```

**Saída Esperada:**

```
🚀 Servidor MCP servidor-mcp-vendas iniciado
🌐 URL da API: http://localhost:3001
```

**✅ Checkpoint:** Servidor inicia sem erros

**Pressione Ctrl+C para parar**

### ⚠️ Possíveis Erros

| Erro                 | Solução                         |
| -------------------- | ------------------------------- |
| `Cannot find module` | Execute `npm install` novamente |
| `Permission denied`  | Use `chmod +x src/index.ts`     |
| Porta em uso         | Mude `apiBaseUrl` no código     |

---

## 📦 BLOCO 3: FERRAMENTAS DE PRODUTOS (45 min)

### 🎯 Objetivos

- Implementar 5 ferramentas de produtos
- Entender padrão de ferramentas MCP
- Testar com dados reais

### 📖 Teoria: Anatomia de uma Ferramenta MCP (5 min)

Uma ferramenta MCP tem 2 partes:

#### 1. DEFINIÇÃO (Metadados)

```typescript
const ferramentaExemplo: MCPTool = {
  name: "nome_ferramenta", // Nome único
  description: "O que ela faz", // Descrição clara
  inputSchema: {
    // Parâmetros
    type: "object",
    properties: {
      parametro1: {
        type: "string",
        description: "Para que serve",
      },
    },
    required: ["parametro1"], // Obrigatórios
  },
};
```

#### 2. MANIPULADOR (Código)

```typescript
const manipulador: MCPToolHandler = async (args) => {
  try {
    // 1. Extrair parâmetros
    const { parametro1 } = args;

    // 2. Executar lógica
    const resultado = await fazerAlgo(parametro1);

    // 3. Retornar sucesso
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(resultado, null, 2),
        },
      ],
    };
  } catch (erro) {
    // 4. Retornar erro
    return {
      content: [
        {
          type: "text",
          text: `Erro: ${erro.message}`,
        },
      ],
      isError: true,
    };
  }
};
```

### Passo 3.1: Implementar tools/produtos.ts (35 min)

Abra `src/tools/produtos.ts` e adicione o código completo:

<details>
<summary><b>📄 Clique para ver código completo (produtos.ts)</b></summary>

```typescript
import { MCPTool, MCPToolHandler } from "../types/mcp";
import { SalesApiClient } from "../utils/api-client";

// ========== FERRAMENTA 1: LISTAR PRODUTOS ==========

export const ferramentaListarProdutos: MCPTool = {
  name: "listar_produtos",
  description:
    "Busca e lista produtos do sistema com filtros opcionais por categoria, preço, estoque ou texto",
  inputSchema: {
    type: "object",
    properties: {
      categoria: {
        type: "string",
        description: 'Filtrar produtos por categoria (ex: "Eletrônicos")',
      },
      precoMinimo: {
        type: "number",
        description: "Preço mínimo para filtrar produtos",
      },
      precoMaximo: {
        type: "number",
        description: "Preço máximo para filtrar produtos",
      },
      apenasEmEstoque: {
        type: "boolean",
        description: "Se true, mostra apenas produtos com estoque disponível",
      },
      buscarTexto: {
        type: "string",
        description: "Buscar produtos por nome ou descrição",
      },
    },
    required: [],
  },
};

export const manipuladorListarProdutos = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const {
        categoria,
        precoMinimo,
        precoMaximo,
        apenasEmEstoque,
        buscarTexto,
      } = argumentos;

      if (
        buscarTexto ||
        categoria ||
        precoMinimo ||
        precoMaximo ||
        apenasEmEstoque !== undefined
      ) {
        const resultado = await clienteApi.searchProducts({
          q: buscarTexto,
          category: categoria,
          minPrice: precoMinimo,
          maxPrice: precoMaximo,
          inStock: apenasEmEstoque,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Encontrados ${resultado.count} produtos`,
                  dados: resultado.products,
                },
                null,
                2
              ),
            },
          ],
        };
      } else {
        const produtos = await clienteApi.getProducts();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Listados ${produtos.length} produtos`,
                  dados: produtos,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao listar produtos: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 2: BUSCAR PRODUTO ==========

export const ferramentaBuscarProduto: MCPTool = {
  name: "buscar_produto",
  description:
    "Busca informações detalhadas de um produto específico pelo seu ID único",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID único do produto",
      },
    },
    required: ["id"],
  },
};

export const manipuladorBuscarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id } = argumentos;
      const produto = await clienteApi.getProduct(id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto ${id} encontrado`,
                dados: produto,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao buscar produto: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 3: CRIAR PRODUTO ==========

export const ferramentaCriarProduto: MCPTool = {
  name: "criar_produto",
  description: "Cria um novo produto no sistema de vendas",
  inputSchema: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome do produto (obrigatório)",
      },
      preco: {
        type: "number",
        description: "Preço do produto em reais (obrigatório)",
      },
      categoria: {
        type: "string",
        description: 'Categoria do produto (ex: "Eletrônicos")',
      },
      descricao: {
        type: "string",
        description: "Descrição detalhada do produto",
      },
      estoque: {
        type: "number",
        description: "Quantidade inicial em estoque",
      },
    },
    required: ["nome", "preco", "categoria", "descricao", "estoque"],
  },
};

export const manipuladorCriarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { nome, preco, categoria, descricao, estoque } = argumentos;

      const produto = await clienteApi.createProduct({
        name: nome,
        price: preco,
        category: categoria,
        description: descricao,
        stock: estoque,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto "${nome}" criado! ID: ${produto.id}`,
                dados: produto,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao criar produto: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 4: ATUALIZAR PRODUTO ==========

export const ferramentaAtualizarProduto: MCPTool = {
  name: "atualizar_produto",
  description: "Atualiza informações de um produto existente",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID do produto a ser atualizado",
      },
      nome: {
        type: "string",
        description: "Novo nome do produto (opcional)",
      },
      preco: {
        type: "number",
        description: "Novo preço (opcional)",
      },
      categoria: {
        type: "string",
        description: "Nova categoria (opcional)",
      },
      descricao: {
        type: "string",
        description: "Nova descrição (opcional)",
      },
      estoque: {
        type: "number",
        description: "Nova quantidade em estoque (opcional)",
      },
    },
    required: ["id"],
  },
};

export const manipuladorAtualizarProduto = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id, ...atualizacoes } = argumentos;

      const atualizacoesLimpas = Object.fromEntries(
        Object.entries(atualizacoes).filter(([_, valor]) => valor !== undefined)
      );

      const mapeamento: Record<string, string> = {
        nome: "name",
        preco: "price",
        categoria: "category",
        descricao: "description",
        estoque: "stock",
      };

      const atualizacoesApi = Object.fromEntries(
        Object.entries(atualizacoesLimpas).map(([chave, valor]) => [
          mapeamento[chave] || chave,
          valor,
        ])
      );

      const produto = await clienteApi.updateProduct(id, atualizacoesApi);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Produto ${id} atualizado`,
                dados: produto,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao atualizar produto: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 5: LISTAR CATEGORIAS ==========

export const ferramentaListarCategorias: MCPTool = {
  name: "listar_categorias",
  description: "Lista todas as categorias de produtos com estatísticas",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const manipuladorListarCategorias = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async () => {
    try {
      const categorias = await clienteApi.getCategories();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Encontradas ${categorias.length} categorias`,
                dados: categorias,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao listar categorias: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};
```

</details>

**📝 Explicação das 5 Ferramentas:**

1. **listar_produtos**: Lista produtos com filtros (categoria, preço, estoque)
2. **buscar_produto**: Busca produto específico por ID
3. **criar_produto**: Adiciona novo produto ao sistema
4. **atualizar_produto**: Modifica produto existente (atualização parcial)
5. **listar_categorias**: Lista categorias com estatísticas

**Padrão Português → Inglês:**

```typescript
// Interface em português (para o chat)
{
  nome, preco, categoria;
}

// API em inglês (backend)
{
  name, price, category;
}

// Mapeamento automático no manipulador
```

### Passo 3.2: Registrar Ferramentas no Servidor (5 min)

Volte ao `src/index.ts` e adicione no topo:

```typescript
import {
  ferramentaListarProdutos,
  manipuladorListarProdutos,
  ferramentaBuscarProduto,
  manipuladorBuscarProduto,
  ferramentaCriarProduto,
  manipuladorCriarProduto,
  ferramentaAtualizarProduto,
  manipuladorAtualizarProduto,
  ferramentaListarCategorias,
  manipuladorListarCategorias,
} from "./tools/produtos.js";
```

**Nota:** Precisaremos do `api-client` e `tool-registry` primeiro. Vamos implementar no Bloco 5 e voltar aqui.

**✅ Checkpoint:** Código compila sem erros TypeScript

---

## ☕ PAUSA (15 min)

### Durante a Pausa:

- ✅ Levante-se e estique
- ✅ Beba água
- ✅ Revisar dúvidas com o professor
- ✅ **NÃO trabalhe** (descanso é importante!)

---

## 💰 BLOCO 4: FERRAMENTAS DE VENDAS (45 min)

### 🎯 Objetivos

- Implementar 6 ferramentas de vendas
- Analytics e business intelligence
- Gestão de inventário

### Passo 4.1: Implementar tools/vendas.ts (40 min)

Abra `src/tools/vendas.ts`:

<details>
<summary><b>📄 Clique para ver código completo (vendas.ts)</b></summary>

```typescript
import { MCPTool, MCPToolHandler } from "../types/mcp";
import { SalesApiClient } from "../utils/api-client";

// ========== FERRAMENTA 1: LISTAR VENDAS ==========

export const ferramentaListarVendas: MCPTool = {
  name: "listar_vendas",
  description:
    "Lista todas as vendas do sistema com filtros opcionais por período",
  inputSchema: {
    type: "object",
    properties: {
      dataInicio: {
        type: "string",
        description: "Data de início (formato: YYYY-MM-DD)",
      },
      dataFim: {
        type: "string",
        description: "Data de fim (formato: YYYY-MM-DD)",
      },
      limite: {
        type: "number",
        description: "Número máximo de vendas a retornar",
      },
    },
    required: [],
  },
};

export const manipuladorListarVendas = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { dataInicio, dataFim, limite } = argumentos;

      if (dataInicio && dataFim) {
        const resultado = await clienteApi.getSalesByDateRange(
          dataInicio,
          dataFim
        );

        let vendas = resultado.sales;
        if (limite && limite > 0) {
          vendas = vendas.slice(0, limite);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Encontradas ${vendas.length} vendas`,
                  dados: vendas,
                  receitaTotal: resultado.totalRevenue,
                },
                null,
                2
              ),
            },
          ],
        };
      } else {
        let vendas = await clienteApi.getSales();

        if (limite && limite > 0) {
          vendas = vendas.slice(0, limite);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sucesso: true,
                  mensagem: `Listadas ${vendas.length} vendas`,
                  dados: vendas,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao listar vendas: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 2: BUSCAR VENDA ==========

export const ferramentaBuscarVenda: MCPTool = {
  name: "buscar_venda",
  description: "Busca informações detalhadas de uma venda específica",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID único da venda",
      },
    },
    required: ["id"],
  },
};

export const manipuladorBuscarVenda = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { id } = argumentos;
      const venda = await clienteApi.getSale(id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Venda ${id} encontrada`,
                dados: venda,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao buscar venda: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 3: CRIAR VENDA ==========

export const ferramentaCriarVenda: MCPTool = {
  name: "criar_venda",
  description: "Registra uma nova venda no sistema",
  inputSchema: {
    type: "object",
    properties: {
      idProduto: {
        type: "number",
        description: "ID do produto sendo vendido",
      },
      quantidade: {
        type: "number",
        description: "Quantidade de produtos vendidos",
      },
      nomeCliente: {
        type: "string",
        description: "Nome do cliente",
      },
      precoTotal: {
        type: "number",
        description: "Preço total (opcional, será calculado se não fornecido)",
      },
    },
    required: ["idProduto", "quantidade", "nomeCliente"],
  },
};

export const manipuladorCriarVenda = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { idProduto, quantidade, nomeCliente, precoTotal } = argumentos;

      let precoFinal = precoTotal;
      if (!precoFinal) {
        const produto = await clienteApi.getProduct(idProduto);
        precoFinal = produto.price * quantidade;
      }

      const venda = await clienteApi.createSale({
        productId: idProduto,
        quantity: quantidade,
        customerName: nomeCliente,
        totalPrice: precoFinal,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Venda registrada para "${nomeCliente}"! ID: ${venda.id}`,
                dados: venda,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao criar venda: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 4: ANALISAR VENDAS ==========

export const ferramentaAnaliseVendas: MCPTool = {
  name: "analisar_vendas",
  description: "Gera análise completa de vendas com métricas e insights",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const manipuladorAnaliseVendas = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async () => {
    try {
      const analise = await clienteApi.getSalesAnalytics();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: "Análise de vendas gerada",
                dados: analise,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao gerar análise: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 5: RESUMO INVENTÁRIO ==========

export const ferramentaResumoInventario: MCPTool = {
  name: "resumo_inventario",
  description:
    "Gera resumo completo do inventário com alertas de estoque baixo",
  inputSchema: {
    type: "object",
    properties: {
      limiteEstoqueBaixo: {
        type: "number",
        description: "Limite para alertas de estoque baixo (padrão: 20)",
      },
    },
    required: [],
  },
};

export const manipuladorResumoInventario = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { limiteEstoqueBaixo = 20 } = argumentos;

      const [resumo, produtosEstoqueBaixo] = await Promise.all([
        clienteApi.getInventorySummary(),
        clienteApi.getLowStockProducts(limiteEstoqueBaixo),
      ]);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: "Resumo de inventário gerado",
                dados: {
                  ...resumo,
                  alertasEstoqueBaixo: produtosEstoqueBaixo,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao gerar resumo: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};

// ========== FERRAMENTA 6: ATUALIZAR ESTOQUE ==========

export const ferramentaAtualizarEstoque: MCPTool = {
  name: "atualizar_estoque",
  description:
    "Atualiza o estoque de um produto (adicionar, subtrair ou definir)",
  inputSchema: {
    type: "object",
    properties: {
      idProduto: {
        type: "number",
        description: "ID do produto",
      },
      quantidade: {
        type: "number",
        description: "Quantidade para a operação",
      },
      operacao: {
        type: "string",
        enum: ["adicionar", "subtrair", "definir"],
        description: 'Tipo: "adicionar", "subtrair" ou "definir"',
      },
      motivo: {
        type: "string",
        description: "Motivo da alteração (opcional)",
      },
    },
    required: ["idProduto", "quantidade", "operacao"],
  },
};

export const manipuladorAtualizarEstoque = (
  clienteApi: SalesApiClient
): MCPToolHandler => {
  return async (argumentos) => {
    try {
      const { idProduto, quantidade, operacao, motivo } = argumentos;

      const mapeamentoOperacoes: Record<string, string> = {
        adicionar: "add",
        subtrair: "subtract",
        definir: "set",
      };

      const operacaoApi = mapeamentoOperacoes[operacao] || operacao;

      const resultado = await clienteApi.updateStock(
        idProduto,
        quantidade,
        operacaoApi as any,
        motivo
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sucesso: true,
                mensagem: `Estoque atualizado para produto ${idProduto}`,
                dados: resultado,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (erro) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao atualizar estoque: ${
              erro instanceof Error ? erro.message : "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }
  };
};
```

</details>

**📝 Explicação das 6 Ferramentas:**

1. **listar_vendas**: Lista vendas com filtro por período
2. **buscar_venda**: Busca venda específica
3. **criar_venda**: Registra nova venda (calcula preço automaticamente)
4. **analisar_vendas**: Analytics completo de vendas
5. **resumo_inventario**: Status do inventário + alertas
6. **atualizar_estoque**: Gestão de estoque (add/subtract/set)

**✅ Checkpoint:** 11 ferramentas implementadas (5 produtos + 6 vendas)

---

## 🛠️ BLOCO 5: RESOURCES E UTILS (30 min)

### 🎯 Objetivos

- Implementar utilitários (api-client, logger, retry, tool-registry)
- Criar recursos educacionais
- Finalizar servidor completo

### Passo 5.1: Implementar utils/api-client.ts (10 min)

O `api-client.ts` é muito extenso (290 linhas). Use o código de referência em `CODIGO_COMPLETO_REFERENCIA.md` ou:

```typescript
// src/utils/api-client.ts
// COLE O CÓDIGO DO ARQUIVO DE REFERÊNCIA AQUI
// (Ver CODIGO_COMPLETO_REFERENCIA.md seção "utils/api-client.ts")
```

**📝 Principais Funcionalidades:**

- Cliente HTTP com Axios
- Métodos para produtos, vendas, analytics, inventário
- Interceptors para logging
- Tratamento de erros

### Passo 5.2: Implementar utils/logger.ts (5 min)

```typescript
// src/utils/logger.ts
// COLE O CÓDIGO DO ARQUIVO DE REFERÊNCIA AQUI
```

**📝 O que faz:**

- Winston logger profissional
- Logs estruturados (JSON)
- Saída em console + arquivos
- Níveis: debug, info, warn, error

### Passo 5.3: Implementar utils/retry.ts (5 min)

```typescript
// src/utils/retry.ts
// COLE O CÓDIGO DO ARQUIVO DE REFERÊNCIA AQUI
```

**📝 O que faz:**

- Retry automático com exponential backoff
- Timeout configurável
- Ideal para chamadas de API

### Passo 5.4: Implementar utils/tool-registry.ts (5 min)

```typescript
// src/utils/tool-registry.ts
// COLE O CÓDIGO DO ARQUIVO DE REFERÊNCIA AQUI
```

**📝 O que faz:**

- Registra ferramentas dinamicamente
- Executa ferramentas com logging
- Tratamento de erros centralizado

### Passo 5.5: Implementar resources/documentacao.ts (5 min)

```typescript
// src/resources/documentacao.ts
// COLE O CÓDIGO DO ARQUIVO DE REFERÊNCIA AQUI
```

**📝 Os 3 Recursos:**

1. **api-schema**: Esquema completo da API (JSON)
2. **guia-uso**: Manual de uso do sistema (Markdown)
3. **exemplos-mcp**: Exemplos práticos Tools vs Resources (Markdown)

**✅ Checkpoint:** Todos os arquivos criados

---

## 🌐 BLOCO 6: CONFIGURAÇÃO FRONTEND (45 min)

Veja o documento separado: `CONFIGURACAO_FRONTEND.md`

**Resumo:**

1. Configurar .env com token Groq
2. Atualizar config-alunos.ts
3. Integrar MCP com chat
4. Testar ferramentas

---

## ✅ BLOCO 7: TESTES FINAIS (20 min)

### Teste 1: Servidor MCP (5 min)

```bash
cd mcp-server
npm run dev
```

**Deve mostrar:**

```
🚀 Servidor MCP servidor-mcp-vendas v1.0.0 iniciado
🌐 URL da API: http://localhost:3001
🛠️ Ferramentas registradas (12): listar_produtos, buscar_produto, ...
📚 Recursos disponíveis (3): Esquema da API, Guia de Uso, Exemplos MCP
```

### Teste 2: Frontend + Chat (5 min)

```bash
cd frontend
npm run dev
```

Acesse http://localhost:3000/chat

**Teste no chat:**

```
"Liste todos os produtos"
"Crie um produto chamado iPhone 15 por R$ 5000"
"Mostre as vendas de hoje"
"Analise as vendas"
```

### Teste 3: Validação Completa (10 min)

**Checklist Final:**

- [ ] Backend rodando (porta 3001)
- [ ] MCP Server rodando (npm run dev)
- [ ] Frontend rodando (porta 3000)
- [ ] Chat responde com dados reais
- [ ] Produtos aparecem corretamente
- [ ] Vendas são registradas
- [ ] Analytics funcionando

**🎉 PARABÉNS! Sistema completo funcionando!**

---

## 📚 Próximos Passos

1. **Experimentar**: Modifique prompts, adicione ferramentas
2. **Estudar**: Leia ARQUITETURA_EDUCACIONAL.md
3. **Praticar**: Exercícios em EXERCICIOS_PRATICOS.md
4. **Compartilhar**: Mostre para amigos!

---

## 🆘 Troubleshooting

### Servidor MCP não inicia

```bash
# Verificar dependências
npm install

# Rebuild
npm run build

# Limpar e reinstalar
rm -rf node_modules dist
npm install
```

### Frontend não conecta ao MCP

1. Verificar .env configurado
2. Backend deve estar rodando
3. MCP Server deve estar rodando
4. Porta correta em config-alunos.ts

### Chat não responde

1. Token Groq configurado?
2. Console do navegador tem erros?
3. Network tab mostra requests?

---

**👨‍🏫 Fim do Workshop! Dúvidas? Consulte o professor!**
