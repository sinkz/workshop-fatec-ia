#!/bin/bash

# ========================================
# 🛑 SCRIPT PARA PARAR SERVIÇOS - EXEMPLO 03
# ========================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Parando todos os serviços do Exemplo 03...${NC}"
echo ""

# Voltar para pasta do exemplo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Ler PIDs e matar processos
if [ -f ".pids" ]; then
    while read -r pid; do
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${YELLOW}Parando processo $pid...${NC}"
            kill "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null
        fi
    done < ".pids"
    
    rm -f ".pids"
    echo -e "${GREEN}✓ Todos os processos foram encerrados${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum processo em execução (arquivo .pids não encontrado)${NC}"
fi

# Limpar logs
if ls logs_*.txt 1> /dev/null 2>&1; then
    rm -f logs_*.txt
    echo -e "${GREEN}✓ Logs limpos${NC}"
fi

echo ""
echo -e "${GREEN}✅ Exemplo 03 encerrado!${NC}"

