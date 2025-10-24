#!/bin/bash

# ========================================
# 🔧 SCRIPT DE CONFIGURAÇÃO - EXEMPLO 01
# ========================================
# Instala todas as dependências do projeto
# Backend + MCP Server + Frontend

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔧 CONFIGURAÇÃO - Workshop FATEC IA      ║${NC}"
echo -e "${BLUE}║  Exemplo 01: Sistema de Vendas            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo -e "${YELLOW}Por favor, instale o Node.js: https://nodejs.org${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js encontrado: $(node -v)${NC}"
echo -e "${GREEN}✓ npm encontrado: $(npm -v)${NC}"
echo ""

# Função para instalar dependências
install_deps() {
    local dir=$1
    local name=$2
    
    echo -e "${BLUE}📦 Instalando dependências: ${name}${NC}"
    
    if [ ! -d "$dir" ]; then
        echo -e "${RED}❌ Pasta não encontrada: $dir${NC}"
        return 1
    fi
    
    cd "$dir" || exit 1
    
    if npm install; then
        echo -e "${GREEN}✓ ${name} - Dependências instaladas!${NC}"
        cd - > /dev/null
        return 0
    else
        echo -e "${RED}❌ ${name} - Erro ao instalar dependências${NC}"
        cd - > /dev/null
        return 1
    fi
}

# Voltar para pasta do exemplo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Instalar dependências
echo -e "${YELLOW}Instalando dependências... Isso pode demorar alguns minutos ⏳${NC}"
echo ""

FAILED=0

# Backend
install_deps "backend" "Backend (API + JSON Server)" || FAILED=1
echo ""

# MCP Server
install_deps "mcp-server" "MCP Server" || FAILED=1
echo ""

# Frontend
install_deps "frontend" "Frontend (React + Vite)" || FAILED=1
echo ""

# Verificar arquivos .env
echo -e "${BLUE}📝 Verificando arquivos de configuração...${NC}"

if [ ! -f "frontend/.env.local" ] && [ -f "frontend/env.example" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.local não encontrado no frontend${NC}"
    echo -e "${YELLOW}   Copie frontend/env.example para frontend/.env.local e configure${NC}"
fi

echo ""

# Resultado final
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Próximo passo:${NC}"
    echo -e "  ${YELLOW}./rodar.sh${NC}  - Para iniciar todos os serviços"
    echo ""
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ ERRO NA CONFIGURAÇÃO                   ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Verifique os erros acima e tente novamente.${NC}"
    exit 1
fi

