#!/bin/bash

# ========================================
# 🚀 SCRIPT DE EXECUÇÃO - EXEMPLO 01
# ========================================
# Inicia todos os serviços do projeto
# Backend + MCP Server + Frontend

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 INICIANDO - Workshop FATEC IA         ║${NC}"
echo -e "${BLUE}║  Exemplo 01: Sistema de Vendas            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Voltar para pasta do exemplo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Limpar arquivo de PIDs anterior
rm -f .pids

# Verificar se dependências foram instaladas
check_deps() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${RED}❌ Dependências não instaladas em: $dir${NC}"
        echo -e "${YELLOW}Execute primeiro: ./configurar.sh${NC}"
        exit 1
    fi
}

echo -e "${BLUE}🔍 Verificando dependências...${NC}"
check_deps "backend"
check_deps "mcp-server"
check_deps "frontend"
echo -e "${GREEN}✓ Todas as dependências OK!${NC}"
echo ""

# Função para iniciar serviço
start_service() {
    local dir=$1
    local name=$2
    local command=$3
    local color=$4
    
    echo -e "${color}▶ Iniciando ${name}...${NC}"
    
    cd "$dir" || exit 1
    
    # Iniciar serviço em background e redirecionar output
    $command > "../logs_${dir}.txt" 2>&1 &
    
    local pid=$!
    echo "$pid" >> "../.pids"
    
    cd - > /dev/null
    
    echo -e "${GREEN}  ✓ ${name} iniciado (PID: $pid)${NC}"
    sleep 2
}

echo -e "${YELLOW}Iniciando serviços... ⏳${NC}"
echo ""

# Iniciar Backend (porta 3002)
start_service "backend" "Backend + JSON Server" "npm run dev:full" "$CYAN"

# Iniciar MCP Server (porta 3003)
start_service "mcp-server" "MCP Server" "npm run dev" "$CYAN"

# Iniciar Frontend (porta 5173)
start_service "frontend" "Frontend (Vite)" "npm run dev" "$CYAN"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ TODOS OS SERVIÇOS INICIADOS!          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URLs disponíveis:${NC}"
echo -e "  ${CYAN}Frontend:${NC}    http://localhost:5173"
echo -e "  ${CYAN}Backend:${NC}     http://localhost:3002"
echo -e "  ${CYAN}MCP Server:${NC}  http://localhost:3003"
echo ""
echo -e "${YELLOW}📋 Logs salvos em:${NC}"
echo -e "  logs_backend.txt, logs_mcp-server.txt, logs_frontend.txt"
echo ""
echo -e "${RED}⚠️  Para parar todos os serviços:${NC}"
echo -e "  ${YELLOW}./parar.sh${NC}"
echo ""
echo -e "${BLUE}Aguardando serviços iniciarem... (15 segundos)${NC}"
sleep 15

# Tentar abrir o navegador (funciona no macOS e Linux)
if command -v open &> /dev/null; then
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
fi

echo -e "${GREEN}✨ Tudo pronto! Bom workshop! 🚀${NC}"

