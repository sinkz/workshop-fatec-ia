# ⚡ Quick Start: Sistema de Personalidades

> Guia ultra-rápido de 2 minutos

## 🔄 Trocar Personalidade

Abra `frontend/config.js`, linha 76:

```javascript
personalidade: "animado", // ← Troque aqui!
```

**Opções:**

- `profissional` - Formal e objetivo
- `sarcastico` - Irônico mas útil 🙄
- `animado` - Super empolgado! 🎉
- `poeta` - Linguagem poética 🌹
- `minimalista` - Conciso e direto

## ➕ Criar Nova Personalidade

### Método 1: Template (Recomendado)

```bash
# 1. Copiar template
cp personalidades/_TEMPLATE.js personalidades/genio.js

# 2. Editar genio.js (preencha id, nome, prompt, boasVindas)

# 3. Adicionar ao index.js
# - Importe: import genio from "./genio.js";
# - Adicione ao array: PERSONALIDADES_DISPONIVEIS
```

### Método 2: Do Zero

Crie `personalidades/genio.js`:

```javascript
export default {
  id: "genio",
  nome: "Gênio",
  descricao: "Assistente mágico",
  prompt: `Você é um gênio da lâmpada...`,
  boasVindas: `🧞 Seus desejos são ordens!`,
};
```

Registre em `personalidades/index.js`:

```javascript
import genio from "./genio.js";

const PERSONALIDADES_DISPONIVEIS = [
  // ... outros
  genio, // ← Adicione aqui
];
```

## 📚 Documentação Completa

- **Guia Completo:** `COMO_ADICIONAR_PERSONALIDADE.md`
- **Docs Técnicas:** `personalidades/README.md`
- **Template:** `personalidades/_TEMPLATE.js`

## 🔍 Estrutura

```
personalidades/
├── index.js           # Carregador (não mexer)
├── profissional.js    # Personalidade 1
├── sarcastico.js      # Personalidade 2
├── animado.js         # Personalidade 3
├── poeta.js           # Personalidade 4
├── minimalista.js     # Personalidade 5
└── _TEMPLATE.js       # Copie este para criar novas!
```

## ⚠️ Regras de Ouro

1. **ID único**: Use kebab-case sem espaços
2. **Prompt claro**: Defina comportamento e regras
3. **Sempre registrar**: Import + adicionar ao array
4. **Testar**: Abra index.html e verifique

## 🎯 Exemplo Completo (60 segundos)

```javascript
// personalidades/pirata.js
export default {
  id: "pirata",
  nome: "Pirata",
  descricao: "Assistente pirata dos sete mares",

  prompt: `Você é um pirata dos sete mares!

Use sotaque pirata e gírias marítimas.
Seja útil como um bom tripulante.

REGRAS:
- Use SEMPRE as ferramentas
- NUNCA invente dados`,

  boasVindas: `☠️ Ahoy, marujo!

Posso te ajudar com:
• 📦 Ver o carregamento (produtos)
• ➕ Adicionar mercadorias
• 💬 Responder tuas perguntas

Qual é tua ordem, capitão? ⚓`,
};
```

```javascript
// personalidades/index.js
import pirata from "./pirata.js"; // ← Adicione

const PERSONALIDADES_DISPONIVEIS = [
  profissional,
  sarcastico,
  animado,
  poeta,
  minimalista,
  pirata, // ← Adicione
];
```

```javascript
// config.js
personalidade: "pirata", // ← Use
```

**Pronto! 🎉**
