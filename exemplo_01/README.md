# 🛒 Sistema de Vendas com MCP + Chat IA

> **Sistema completo de vendas integrado com Model Context Protocol (MCP) e chat inteligente usando Groq.ai ou Google Gemini**

[![Status](https://img.shields.io/badge/Status-Completo-brightgreen)]()
[![MCP](https://img.shields.io/badge/MCP-12%20Tools-blue)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61dafb)]()
[![Backend](https://img.shields.io/badge/Backend-Express-green)]()
[![Multi-Provider](https://img.shields.io/badge/IA-Groq%20%7C%20Gemini-orange)]()

## 🎯 Visão Geral

Este projeto demonstra uma implementação completa de um sistema de vendas moderno com chat inteligente, utilizando o **Model Context Protocol (MCP)** para conectar uma IA (Groq.ai ou Google Gemini) com dados reais de produtos e vendas.

> 📊 **[Ver Diagrama de Fluxo →](./FLUXO.md)** - Visualize como os componentes se comunicam

### ✨ Principais Características

- 🤖 **Chat IA Multi-Provider** - Suporte a Groq.ai e Google Gemini
- 🔄 **Troca Simples** - Mude de provider apenas editando .env
- 📦 **Gestão Completa** - Produtos, vendas, estoque e analytics
- 🛡️ **Anti-Alucinação** - Sistema robusto para prevenir dados inventados
- 🔧 **12 Ferramentas MCP** - Operações especializadas em português
- 🎨 **Interface Moderna** - React 18 + TypeScript + Tailwind CSS
- 📊 **Analytics Real-time** - Métricas e relatórios automáticos

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MCP Server    │
│   React + TS    │◄──►│   Express +     │◄──►│   12 Tools      │
│   Chat Interface│    │   JSON Server   │    │   Sales Context │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Groq/Gemini    │    │   Database      │    │   API Client    │
│  LLM Processing │    │   Products +    │    │   HTTP Requests │
│  Multi-Provider │    │   Sales Data    │    │   Error Handling│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Token de IA (escolha um):
  - **Groq.ai** ([Obter aqui](https://console.groq.com/)) - Recomendado para começar
  - **Google Gemini** ([Obter aqui](https://aistudio.google.com/app/apikey)) - Alternativa gratuita

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone <repo-url>
cd exemplo_01

# 2. Instale todas as dependências
# Backend
cd backend && npm install

# MCP Server
cd ../mcp-server && npm install

# Frontend
cd ../frontend && npm install

# 3. Configure o token de IA
cd frontend
cp env.example .env
# Edite .env e configure:
# - VITE_IA_PROVIDER=groq (ou gemini)
# - VITE_GROQ_API_KEY=seu-token (se usar Groq)
# - VITE_GEMINI_API_KEY=seu-token (se usar Gemini)

# 4. Execute tudo (3 terminais)
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd mcp-server && npm run dev
# Terminal 3: cd frontend && npm run dev
```

### Acesso

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:3001
- ⚙️ **MCP Server:** Ativo via stdio

## 🤖 Múltiplos Providers de IA

O sistema suporta **dois providers de IA** que podem ser trocados facilmente:

### Providers Disponíveis

| Provider   | Velocidade      | Custo                     | Uso Recomendado         |
| ---------- | --------------- | ------------------------- | ----------------------- |
| **Groq**   | ⚡ Muito Rápido | 💰 Gratuito (com limites) | Desenvolvimento e demos |
| **Gemini** | 🚀 Rápido       | 💚 Gratuito               | Produção e uso intenso  |

### Como Trocar de Provider

**Passo 1:** Edite o arquivo `.env` no frontend:

```bash
# Escolha o provider
VITE_IA_PROVIDER=gemini  # ou 'groq'

# Configure o token correspondente
VITE_GEMINI_API_KEY=sua-chave-aqui
# ou
VITE_GROQ_API_KEY=sua-chave-aqui
```

**Passo 2:** Recarregue a aplicação - pronto! ✅

### Obter Tokens

#### Groq (Recomendado para começar)

1. Acesse [console.groq.com](https://console.groq.com/)
2. Faça login com GitHub ou Google
3. Vá em "API Keys" → "Create API Key"
4. Copie e adicione no `.env`

#### Google Gemini (Gratuito e generoso)

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Get API Key" → "Create API Key"
4. Copie e adicione no `.env`

### Modelos Disponíveis

#### Groq

- `qwen/qwen3-32b` ⭐ **Padrão** - Rápido e preciso
- `llama3-8b-8192` - Alternativa balanceada
- `mixtral-8x7b-32768` - Mais poderoso

#### Gemini

- `gemini-2.0-flash-exp` ⭐ **Padrão** - Rápido e experimental
- `gemini-1.5-pro` - Mais poderoso e estável
- `gemini-exp-1206` - Experimental avançado

Para trocar o modelo, edite `frontend/src/config/config-alunos.ts`:

```typescript
ia: {
  provider: "gemini", // ou "groq"
  gemini: {
    modelo: "gemini-1.5-pro", // Trocar aqui
    // ...
  }
}
```

### Comparação Técnica

| Recurso          | Groq                | Gemini              |
| ---------------- | ------------------- | ------------------- |
| Function Calling | ✅ Sim              | ✅ Sim              |
| Velocidade       | ⚡⚡⚡              | ⚡⚡                |
| Rate Limits      | 30 req/min          | 60 req/min          |
| Context Window   | 8K-32K tokens       | 128K tokens         |
| Custo            | Gratuito (limitado) | Gratuito (generoso) |

### Vantagens da Arquitetura Multi-Provider

1. **Fallback Instantâneo** - Se um cair, muda para outro em segundos
2. **Sem Vendor Lock-in** - Não depende de um único fornecedor
3. **Educacional** - Alunos veem diferentes APIs de IA
4. **Extensível** - Fácil adicionar Claude, GPT-4, etc.
5. **Zero Mudança de Código** - Apenas variável de ambiente

## 🎮 Como Usar

### 1. 📦 Gestão de Produtos

- Navegue para **Produtos**
- Visualize, crie, edite produtos
- Controle estoque em tempo real
- Filtre por categoria, preço, estoque

### 2. 💰 Controle de Vendas

- Acesse **Vendas**
- Registre novas vendas
- Visualize analytics automáticos
- Acompanhe métricas de performance

### 3. 🤖 Chat Inteligente

- Vá para **Chat IA**
- Faça perguntas naturais:
  - _"Quantos produtos temos em estoque?"_
  - _"Mostre as vendas de hoje"_
  - _"Crie um produto chamado Smartphone Pro"_
  - _"Qual categoria vende mais?"_

## 🛠️ Ferramentas MCP Disponíveis

| 🔧 Ferramenta             | 📝 Descrição               | 💬 Exemplo de Uso            |
| ------------------------- | -------------------------- | ---------------------------- |
| `listar_produtos`         | Lista produtos com filtros | "Produtos em estoque baixo"  |
| `buscar_produto`          | Busca produto específico   | "Detalhes do produto ID 5"   |
| `criar_produto`           | Adiciona novo produto      | "Crie um notebook gamer"     |
| `atualizar_produto`       | Modifica produto existente | "Atualize preço para R$ 299" |
| `listar_vendas`           | Histórico de vendas        | "Vendas da última semana"    |
| `criar_venda`             | Registra nova venda        | "Venda 2 smartphones"        |
| `analisar_vendas`         | Métricas e relatórios      | "Relatório por categoria"    |
| `resumo_inventario`       | Status do estoque          | "Produtos com estoque baixo" |
| `listar_categorias`       | Categorias disponíveis     | "Quais categorias temos?"    |
| `atualizar_estoque`       | Controle de estoque        | "Adicione 10 unidades"       |
| `verificar_saude_sistema` | Status do sistema          | "Sistema funcionando?"       |

## 🎓 Para Educadores e Alunos

### 📚 Material Educacional Incluído

- 📖 **[Setup Completo](./SETUP_COMPLETO.md)** - Guia passo a passo
- 🎓 **[Roadmap Educacional](./docs/ROADMAP_EDUCACIONAL.md)** - Plano de aulas
- 👨‍🎓 **[Guia dos Alunos](./docs/GUIA_ALUNOS.md)** - Manual simplificado
- 🛠️ **[Exercícios Práticos](./docs/EXERCICIOS_PRATICOS.md)** - Atividades hands-on
- 🏛️ **[Arquitetura Educacional](./mcp-server/ARQUITETURA_EDUCACIONAL.md)** - Conceitos MCP
- ⚙️ **[Configuração Única](./frontend/src/config/config-alunos.ts)** - Arquivo único para alunos

### 🎯 Exercícios Sugeridos

1. **Personalização do Chat:**

   ```typescript
   // Edite: frontend/src/config/config-alunos.ts
   export const PROMPT_SISTEMA = `
   Você é um assistente especializado em...
   `;
   ```

2. **Novas Ferramentas MCP:**

   - Adicione ferramenta de desconto
   - Crie relatórios personalizados
   - Implemente busca avançada

3. **Interface Personalizada:**
   - Modifique cores e temas
   - Adicione novos componentes
   - Implemente funcionalidades extras

### 🔧 Configuração Ultra Simples para Alunos

**TUDO EM UM ARQUIVO:** Apenas IA e MCP - sem distrações!

Alunos modificam **apenas UM arquivo**:

```typescript
// frontend/src/config/config-alunos.ts

export const CONFIG_ALUNOS = {
  // 🤖 Personalidade da IA
  nome: "Assistente de Vendas",
  personalidade: "profissional e amigável",

  // 🚀 Configuração Groq.ai
  groq: {
    modelo: "llama3-8b-8192", // Experimente outros!
    temperatura: 0.1, // Ajuste criatividade!
  },

  // 🔌 Conexão MCP
  mcp: {
    url: "http://localhost:3003", // Dados reais!
  },

  // 💬 Prompt principal - AQUI É A MÁGICA!
  prompt: `Você é um assistente especializado...`,

  // 👋 Mensagem de boas-vindas
  boasVindas: `👋 Olá! Sou seu Assistente...`,
};
```

**Todas as outras configurações estão integradas no código.**

## 📊 Dados de Exemplo

O sistema vem pré-carregado com:

- ✅ **15 produtos** realistas em 5 categorias
- ✅ **25 vendas** com dados históricos
- ✅ **Métricas** calculadas automaticamente
- ✅ **Analytics** em tempo real

## 🔧 Stack Tecnológico

### Frontend

- **React 18** - Interface moderna
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Query** - Gerenciamento de estado
- **React Router** - Navegação
- **Zod** - Validação de dados

### Backend

- **Express.js** - Servidor web
- **JSON Server** - Database simulado
- **CORS** - Configuração de segurança
- **Morgan** - Logging de requisições

### MCP & IA

- **MCP SDK** - Protocol implementation
- **Groq.ai** - Processamento de linguagem
- **Winston** - Logging estruturado
- **Axios** - Cliente HTTP

## 🐛 Solução de Problemas

### ❌ Problemas Comuns

| Problema                   | Solução                                           |
| -------------------------- | ------------------------------------------------- |
| Token Groq não configurado | Configure `VITE_GROQ_API_KEY` no `.env`           |
| MCP Server não conecta     | Verifique se está rodando: `npm run dev`          |
| API não responde           | Teste: `curl http://localhost:3001/health`        |
| Frontend não carrega       | Limpe cache: `rm -rf node_modules && npm install` |

### 🔍 Debug

```bash
# Verificar logs
tail -f backend/logs/app.log
tail -f mcp-server/logs/mcp-combined.log

# Testar componentes
curl http://localhost:3001/api/products
echo '{"method": "tools/list"}' | cd mcp-server && npm run dev
```

## 📈 Status do Desenvolvimento

- ✅ **Backend API** - Completo com 15 endpoints
- ✅ **MCP Server** - 12 ferramentas funcionais
- ✅ **Frontend React** - Interface completa
- ✅ **Chat Integrado** - Groq + MCP funcionando
- ✅ **Anti-Alucinação** - Sistema robusto implementado
- ✅ **Error Handling** - Tratamento completo de erros
- ✅ **Documentação** - Guias detalhados
- ✅ **Testes** - Validação de componentes

## 🤝 Contribuição

Este projeto é educacional. Para contribuir:

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Precisa de ajuda?

1. 📖 Consulte o [Setup Completo](./SETUP_COMPLETO.md)
2. 🔍 Verifique os logs nos terminais
3. 🐛 Abra uma [Issue](./issues) com detalhes
4. 💬 Participe das [Discussions](./discussions)

---

<div align="center">

**🎉 Sistema pronto para uso educacional e demonstrações!**

[📖 Documentação](./SETUP_COMPLETO.md) • [🏛️ Arquitetura](./mcp-server/ARQUITETURA_EDUCACIONAL.md) • [⚙️ Configuração](./frontend/src/config/)

</div>
