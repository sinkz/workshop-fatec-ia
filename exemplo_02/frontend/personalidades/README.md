# 🎭 Personalidades da IA

Sistema modular para gerenciar diferentes personalidades do assistente.

## 📁 Estrutura

```
personalidades/
├── index.js           ← Carregador principal (importa todas)
├── profissional.js    ← Personalidade formal
├── sarcastico.js      ← Personalidade irônica
├── animado.js         ← Personalidade empolgada
├── poeta.js           ← Personalidade poética
├── minimalista.js     ← Personalidade concisa
└── README.md          ← Este arquivo
```

## 🆕 Como Adicionar uma Nova Personalidade

### Passo 1: Criar o arquivo

Crie um arquivo na pasta `personalidades/` com o nome da personalidade:

```bash
# Exemplo: criar uma personalidade "genio"
personalidades/genio.js
```

### Passo 2: Seguir o template

Copie e adapte o template abaixo:

```javascript
/**
 * 🎭 PERSONALIDADE: GÊNIO
 *
 * Descrição curta da personalidade
 */

export default {
  // ID único (usado no config.js)
  id: "genio",

  // Nome amigável
  nome: "Gênio",

  // Descrição curta
  descricao: "Assistente que fala como um gênio da lâmpada",

  // Prompt do sistema (instruções para a IA)
  prompt: `Você é um assistente que fala como um gênio da lâmpada.

Responda em português brasileiro com linguagem mística.
Use referências a desejos e magia.
Seja dramático mas útil.

REGRAS IMPORTANTES:
- Use SEMPRE as ferramentas para dados reais
- NUNCA invente produtos
- Seja útil e misterioso ao mesmo tempo`,

  // Mensagem de boas-vindas
  boasVindas: `🧞 Saravá! Eu sou o Gênio dos Produtos!

Posso realizar três tipos de desejos:
• 📦 Revelar todos os produtos (1º desejo)
• ➕ Materializar novos produtos (2º desejo)
• 💬 Responder suas perguntas (3º desejo... e quantos mais quiser!)

Qual será seu primeiro desejo? ✨`,
};
```

### Passo 3: Importar no index.js

Abra `personalidades/index.js` e adicione:

```javascript
// 1. Importar o arquivo
import genio from "./genio.js";

// 2. Adicionar ao array
const PERSONALIDADES_DISPONIVEIS = [
  profissional,
  sarcastico,
  animado,
  poeta,
  minimalista,
  genio, // ← Adicione aqui!
];
```

### Passo 4: Usar no config.js

Agora você pode usar a nova personalidade:

```javascript
// config.js
const CONFIG = {
  // ...
  personalidade: "genio", // ← Pronto!
};
```

## 📝 Campos Obrigatórios

Cada personalidade **DEVE** ter:

| Campo        | Tipo   | Descrição                          |
| ------------ | ------ | ---------------------------------- |
| `id`         | string | ID único (kebab-case, sem espaços) |
| `nome`       | string | Nome amigável para exibição        |
| `descricao`  | string | Descrição curta da personalidade   |
| `prompt`     | string | Instruções do sistema para a IA    |
| `boasVindas` | string | Mensagem inicial no chat           |

## ✅ Boas Práticas

### Prompt do Sistema

- ✅ Seja claro sobre o comportamento esperado
- ✅ Inclua regras sobre uso de ferramentas
- ✅ Proíba invenção de dados (anti-alucinação)
- ✅ Defina tom e estilo de linguagem
- ❌ Não seja muito restritivo (deixe a IA respirar)
- ❌ Evite prompts gigantes (máximo 500 palavras)

### Mensagem de Boas-Vindas

- ✅ Seja acolhedor e amigável
- ✅ Explique brevemente o que a IA pode fazer
- ✅ Use emojis para clareza visual
- ✅ Seja consistente com a personalidade
- ❌ Não seja longo demais (máximo 6 linhas)
- ❌ Evite jargões técnicos

## 🎯 Exemplos de Personalidades

### Profissional ✓

```javascript
{
  id: "profissional",
  prompt: "Assistente formal, cortês e objetivo",
  estilo: "Formal, sem gírias, emojis ocasionais"
}
```

### Sarcástico ✓

```javascript
{
  id: "sarcastico",
  prompt: "Assistente irônico mas útil",
  estilo: "Ironia leve, piadas sutis, emojis 🙄 😏"
}
```

### Animado ✓

```javascript
{
  id: "animado",
  prompt: "Assistente SUPER empolgado",
  estilo: "MUITA energia! Exclamações! 🎉"
}
```

### Poeta ✓

```javascript
{
  id: "poeta",
  prompt: "Assistente com alma de poeta",
  estilo: "Metáforas, versos, linguagem lírica"
}
```

### Minimalista ✓

```javascript
{
  id: "minimalista",
  prompt: "Assistente conciso e direto",
  estilo: "Poucas palavras. Um emoji máximo."
}
```

## 🚀 Testando Sua Personalidade

1. Crie o arquivo seguindo o template
2. Importe no `index.js`
3. Configure no `config.js`
4. Abra `index.html` no navegador
5. Teste no chat:
   - "Olá" (testar boas-vindas)
   - "Liste os produtos" (testar ação)
   - "Quantos produtos temos?" (testar raciocínio)

## 💡 Dicas

- **Consistência**: Mantenha o tom da personalidade em todas as respostas
- **Utilidade**: Mesmo personalidades engraçadas devem ser ÚTEIS
- **Anti-alucinação**: SEMPRE reforce o uso de ferramentas para dados reais
- **Criatividade**: Explore tons diferentes (técnico, infantil, filosófico, etc)

## 🔧 Troubleshooting

### Personalidade não carrega

```javascript
// Verifique se:
// 1. O arquivo está em personalidades/
// 2. O export default existe
// 3. Foi importado no index.js
// 4. Foi adicionado ao array PERSONALIDADES_DISPONIVEIS
// 5. O ID está correto no config.js
```

### Prompt não funciona como esperado

```javascript
// Dicas:
// - Seja mais específico nas instruções
// - Adicione exemplos de respostas esperadas
// - Reforce regras importantes com MAIÚSCULAS
// - Teste com diferentes mensagens
```

## 📚 Referências

- [Guia de Prompting](https://www.promptingguide.ai/)
- [Groq Documentation](https://console.groq.com/docs)
- [Best Practices for System Messages](https://platform.openai.com/docs/guides/prompt-engineering)

---

**🎉 Divirta-se criando personalidades únicas!**
