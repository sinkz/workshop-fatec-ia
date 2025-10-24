# 🚀 Como Usar os Scripts de Instalação

## 📋 Visão Geral

Cada exemplo do workshop possui **3 scripts automatizados** para facilitar a configuração e execução:

1. **`configurar.sh`** - Instala todas as dependências
2. **`rodar.sh`** - Inicia todos os serviços
3. **`parar.sh`** - Encerra todos os serviços

---

## 🎯 Passo a Passo Rápido

### Para qualquer exemplo (01, 02 ou 03):

```bash
# 1. Entre na pasta do exemplo
cd exemplo_01  # ou exemplo_02 ou exemplo_03

# 2. Configure (instale dependências)
./configurar.sh

# 3. Inicie os serviços
./rodar.sh

# 4. Para parar tudo
./parar.sh
```

---

## 📦 O que cada script faz?

### 🔧 `configurar.sh`

**Executa automaticamente:**
- ✅ Verifica se Node.js está instalado
- ✅ Instala dependências com `npm install` em todas as pastas
- ✅ Verifica arquivos de configuração (.env)
- ✅ Exibe mensagens coloridas de sucesso/erro

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

### 🚀 `rodar.sh`

**Executa automaticamente:**
- ✅ Verifica se dependências foram instaladas
- ✅ Inicia Backend em background
- ✅ Inicia MCP Server em background (quando aplicável)
- ✅ Inicia Frontend em background
- ✅ Salva PIDs dos processos em `.pids`
- ✅ Cria logs em `logs_*.txt`
- ✅ Abre navegador automaticamente
- ✅ Exibe URLs de acesso

**URLs padrão:**
- **Exemplo 01:** Frontend (5173), Backend (3002), MCP (3003)
- **Exemplo 02:** Frontend (3000), Backend (3001), MCP (3003)
- **Exemplo 03:** Frontend (3000), Backend (3001)

### 🛑 `parar.sh`

**Executa automaticamente:**
- ✅ Encerra todos os processos salvos em `.pids`
- ✅ Remove arquivo `.pids`
- ✅ Limpa logs temporários
- ✅ Confirma encerramento

---

## 🎓 Para Professores/Instrutores

### Exemplo 01 - Sistema de Vendas

```bash
cd exemplo_01
./configurar.sh  # React + MCP + Backend
./rodar.sh       # Acesse: http://localhost:5173
```

**Tecnologias:**
- Frontend: React + Vite (porta 5173)
- Backend: Express + JSON Server (porta 3002)
- MCP Server: SSE (porta 3003)

### Exemplo 02 - Produtos Simples

```bash
cd exemplo_02
./configurar.sh  # HTML puro + MCP + Backend
./rodar.sh       # Acesse: http://localhost:3000
```

**Tecnologias:**
- Frontend: HTML + http-server (porta 3000)
- Backend: Express simples (porta 3001)
- MCP Server: SSE (porta 3003)

### Exemplo 03 - Receitas

```bash
cd exemplo_03
./configurar.sh  # Next.js + Proxy Neon
./rodar.sh       # Acesse: http://localhost:3000
```

**Tecnologias:**
- Frontend: Next.js (porta 3000)
- Backend: Proxy MCP Neon (porta 3001)

**⚠️ IMPORTANTE:** Exemplo 03 requer configuração de `.env` com credenciais Neon!

---

## 🐛 Troubleshooting

### ❌ Erro: "Node.js não encontrado"

```bash
# Instalar Node.js
# macOS:
brew install node

# Ou baixe de: https://nodejs.org
```

### ❌ Erro: "Dependências não instaladas"

```bash
./configurar.sh  # Execute novamente
```

### ❌ Erro: "Porta já em uso"

```bash
# Parar processos antigos
./parar.sh

# Ou matar porta manualmente:
lsof -ti:3000 | xargs kill -9  # Substitua 3000 pela porta
```

### ❌ Scripts não executam (permissão negada)

```bash
# Tornar executável
chmod +x *.sh
```

### 📋 Ver logs de erro

```bash
# Logs são salvos automaticamente:
cat logs_backend.txt
cat logs_mcp-server.txt
cat logs_frontend.txt
```

---

## 🎯 Dicas para Alunos Iniciantes

### Nunca usou terminal antes?

1. **Abrir terminal:**
   - macOS: Cmd + Espaço → digite "Terminal"
   - Windows: Git Bash ou WSL
   - Linux: Ctrl + Alt + T

2. **Navegar entre pastas:**
   ```bash
   cd nome-da-pasta      # Entrar em uma pasta
   cd ..                 # Voltar uma pasta
   ls                    # Ver arquivos na pasta atual
   pwd                   # Ver onde estou
   ```

3. **Executar os scripts:**
   ```bash
   ./configurar.sh       # ./ significa "execute este arquivo"
   ```

### Ordem correta:

```
1️⃣ ./configurar.sh  (primeira vez)
2️⃣ ./rodar.sh       (sempre que quiser iniciar)
3️⃣ ./parar.sh       (quando terminar)
```

---

## 📚 Arquivos Criados

Após rodar os scripts, você verá:

```
exemplo_0X/
├── .pids              ← IDs dos processos (para parar depois)
├── logs_backend.txt   ← Logs do backend
├── logs_mcp-server.txt ← Logs do MCP (se houver)
└── logs_frontend.txt  ← Logs do frontend
```

**💡 Dica:** Esses arquivos são temporários e recriados toda vez!

---

## 🎉 Sucesso!

Se tudo deu certo, você verá:

```
╔════════════════════════════════════════════╗
║  ✅ TODOS OS SERVIÇOS INICIADOS!          ║
╚════════════════════════════════════════════╝

🌐 URLs disponíveis:
  Frontend:    http://localhost:XXXX
  Backend:     http://localhost:XXXX
  MCP Server:  http://localhost:XXXX
```

O navegador abrirá automaticamente! 🎊

---

## 💬 Precisa de Ajuda?

1. Veja os logs: `cat logs_*.txt`
2. Consulte o professor/instrutor
3. Veja documentação específica em cada `exemplo_0X/README.md`

---

**Criado para o Workshop FATEC - IA com MCP** 🚀

