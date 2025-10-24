# 🎭 Personalidades do ReceitasIA

Esta pasta contém as diferentes personalidades que a IA pode assumir ao responder sobre receitas.

## 📁 Estrutura

- `index.ts` - Define todas as personalidades disponíveis
- `README.md` - Este arquivo (documentação)

## 🎯 Personalidades Disponíveis

### 1. 👨‍🍳 Chef Profissional (padrão)

**ID:** `profissional`

**Estilo:**

- Técnico e preciso
- Usa termos culinários profissionais
- Explica técnicas detalhadamente
- Educativo e informativo

**Quando usar:**

- Para aprender técnicas culinárias
- Quando quer precisão nas instruções
- Para entender fundamentos da culinária

**Exemplo de resposta:**

> "Execute o processo de mise en place antes de iniciar. Incorpore os ingredientes secos gradualmente para evitar grumos..."

---

### 2. 👵 Vovó Carinhosa

**ID:** `vovo`

**Estilo:**

- Muito afetiva e acolhedora
- Usa expressões carinhosas
- Conta histórias sobre as receitas
- Menciona tradições familiares

**Quando usar:**

- Para receitas tradicionais e caseiras
- Quando quer conforto emocional
- Para sentir o carinho da culinária de família

**Exemplo de resposta:**

> "Oi meu bem! 🥰 Deixa eu te contar um segredo que minha avó me ensinou... Com carinho e paciência, fica uma delícia! ❤️"

---

### 3. 🥗 Chef Saudável

**ID:** `saudavel`

**Estilo:**

- Focado em nutrição e saúde
- Menciona benefícios dos ingredientes
- Sugere substituições saudáveis
- Educativo sobre alimentação balanceada

**Quando usar:**

- Para cozinhar de forma mais saudável
- Quando quer entender nutrição
- Para opções balanceadas e nutritivas

**Exemplo de resposta:**

> "O abacate é rico em gorduras boas (ômega-3) e vitamina E! 🥑 Que tal substituir açúcar refinado por tâmaras? Mais fibras!"

---

## 🔧 Como Trocar de Personalidade

É super fácil! Só editar o arquivo `config/app.config.ts`:

```typescript
personalidade: {
  ativa: "profissional"; // ← Mude aqui!
  // Opções: "profissional", "vovo", "saudavel"
}
```

Salve o arquivo e pronto! A IA já vai usar a nova personalidade. 🎉

## ➕ Como Criar Novas Personalidades

Quer criar sua própria personalidade? É fácil!

### Passo 1: Editar `index.ts`

Adicione uma nova constante:

```typescript
export const minhaPersonalidade: Personalidade = {
  id: "minha",
  nome: "Meu Chef",
  emoji: "🍳",
  descricao: "Descrição do estilo",
  promptAdicional: `
## ESTILO DE COMUNICAÇÃO - MEU CHEF:
- Defina como a IA deve se comportar
- Liste características do estilo
- Dê exemplos de frases

EXEMPLOS:
- "Frase exemplo 1"
- "Frase exemplo 2"
`,
};
```

### Passo 2: Adicionar ao catálogo

No objeto `personalidades`, adicione:

```typescript
export const personalidades: Record<string, Personalidade> = {
  profissional: chefProfissional,
  vovo: vovoCarinhosa,
  saudavel: chefSaudavel,
  minha: minhaPersonalidade, // ← Nova personalidade
};
```

### Passo 3: Atualizar tipo no config

Em `app.config.ts`, adicione a nova opção:

```typescript
ativa: "profissional" as "profissional" | "vovo" | "saudavel" | "minha",
```

Pronto! Agora você pode usar `ativa: "minha"` no config! 🚀

## 💡 Dicas para Criar Personalidades

### 1. Seja Específico no Estilo

✅ **BOM:**

```
- Use SEMPRE maiúsculas para dar ênfase
- Termine frases com ponto de exclamação!
- Mencione curiosidades históricas
```

❌ **RUIM:**

```
- Seja legal
- Responda bem
```

### 2. Dê Exemplos Concretos

Inclua exemplos de como a IA deve falar:

```
EXEMPLOS:
- "Atenção! Este passo é CRUCIAL para o sucesso da receita!"
- "Curiosidade: Este prato tem origem na França do século XVIII..."
```

### 3. Use Emojis Estrategicamente

Defina quais emojis combina com a personalidade:

```typescript
// Chef Profissional: moderado
emoji: "👨‍🍳",
// Use: 👨‍🍳🔪📚

// Vovó Carinhosa: abundante
emoji: "👵",
// Use: ❤️🥰😊💕🤗

// Chef Saudável: temático
emoji: "🥗",
// Use: 🥗🥑🍎🥕🌿
```

## 🎨 Ideias de Personalidades

Inspire-se com essas ideias:

- 🌶️ **Chef Mexicano** - Picante e animado
- 🍣 **Sushi Master** - Zen e minimalista
- 🍝 **Nonna Italiana** - Apaixonada e expressiva
- ⚡ **Chef Rápido** - Objetivo e prático (receitas em 15 min)
- 🌱 **Chef Vegano** - Focado em plant-based
- 🎂 **Confeiteiro** - Doces e sobremesas
- 🔬 **Chef Molecular** - Científico e inovador

## 📚 Referências

- As personalidades afetam apenas o ESTILO, não as funcionalidades
- O prompt base (SYSTEM_PROMPT_BASE) é sempre usado
- A personalidade é ADICIONADA ao prompt base
- Funciona com qualquer modelo de IA (Groq, Gemini, etc.)

---

**🎓 Criado para o Workshop FATEC - Inteligência Artificial com MCP**
