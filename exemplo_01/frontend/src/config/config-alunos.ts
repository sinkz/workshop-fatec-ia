/**
 * 🎓 CONFIGURAÇÃO ÚNICA PARA ALUNOS
 *
 * Este é o ÚNICO arquivo que você precisa modificar!
 * Tudo sobre IA, MCP e Chat está aqui.
 */

// ============================================================================
// 🤖 CONFIGURAÇÃO COMPLETA - PERSONALIZE AQUI!
// ============================================================================

export const CONFIG_ALUNOS = {
  // Nome da sua IA
  nome: "Assistente de Vendas",

  // Personalidade (seja criativo!)
  personalidade: "profissional e amigável",

  // 🤖 CONFIGURAÇÃO DE IA - MULTI-PROVIDER
  ia: {
    // Provider ativo: 'groq' ou 'gemini'
    provider: (import.meta.env.VITE_IA_PROVIDER || "groq") as "groq" | "gemini",

    // Configuração Groq
    groq: {
      token: import.meta.env.VITE_GROQ_API_KEY || "configure-seu-token-no-env",
      modelo: "qwen/qwen3-32b",
      temperatura: 0.6,
      maxTokens: 4096,
    },

    // Configuração Gemini
    gemini: {
      token: import.meta.env.VITE_GEMINI_API_KEY || "",
      modelo: "gemini-1.5-flash",
      temperatura: 0.6,
      maxTokens: 4096,
    },
  },

  // 🚀 LEGADO: Mantido para compatibilidade (usa ia.groq)
  groq: {
    get token() {
      return CONFIG_ALUNOS.ia.groq.token;
    },
    get modelo() {
      return CONFIG_ALUNOS.ia.groq.modelo;
    },
    get temperatura() {
      return CONFIG_ALUNOS.ia.groq.temperatura;
    },
    get maxTokens() {
      return CONFIG_ALUNOS.ia.groq.maxTokens;
    },
  },

  // 🔌 CONFIGURAÇÃO MCP (usa backend como proxy)
  mcp: {
    url: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    timeout: 30000,
  },

  // 🛡️ ANTI-ALUCINAÇÃO (sempre ativo!)
  antiAlucinacao: true,

  // 💬 PROMPT PRINCIPAL - AQUI É ONDE A MÁGICA ACONTECE!
  prompt: `Você é um assistente especializado em vendas e produtos.

Sua personalidade: profissional e amigável
Sempre responda em português brasileiro de forma DIRETA e OBJETIVA.
Use emojis ocasionalmente para ser mais amigável.

REGRAS CRÍTICAS DE ANTI-ALUCINAÇÃO:
- SEMPRE use as ferramentas disponíveis para buscar dados reais
- NUNCA invente produtos, preços ou informações
- Se não tiver certeza, USE UMA FERRAMENTA para verificar
- Quando criar/modificar algo, USE A FERRAMENTA APROPRIADA
- NÃO mostre seu raciocínio interno (<think>), apenas a resposta final
- Seja conciso e direto ao ponto

IMPORTANTE: Você tem acesso a ferramentas que podem:
- Listar produtos e vendas
- Criar novos produtos
- Atualizar produtos existentes
- Registrar vendas
- Gerar análises e relatórios

Use-as SEMPRE que o usuário pedir para fazer algo com produtos ou vendas.`,

  // 👋 MENSAGEM DE BOAS-VINDAS
  boasVindas: `👋 Olá! Sou seu Assistente de Vendas.

Posso ajudar você com:
📦 Produtos (listar, criar, buscar)
💰 Vendas (registrar, consultar, analisar)
📊 Relatórios e métricas

Como posso ajudar hoje?`,
};

// ============================================================================
// 📚 GUIA RÁPIDO - COMO PERSONALIZAR
// ============================================================================

/**
 * EXERCÍCIOS PARA FAZER:
 *
 * 1. MUDE A PERSONALIDADE:
 *    - Altere 'personalidade' para "engraçado" ou "formal"
 *    - Modifique o 'prompt' para refletir a nova personalidade
 *    - Teste no chat e veja a diferença!
 *
 * 2. EXPERIMENTE MODELOS:
 *    - Troque 'modelo' para 'mixtral-8x7b-32768'
 *    - Compare velocidade vs qualidade
 *    - Volte para 'llama3-8b-8192' se preferir velocidade
 *
 * 3. AJUSTE CRIATIVIDADE:
 *    - temperatura: 0.1 = Muito preciso (recomendado)
 *    - temperatura: 0.5 = Balanceado
 *    - temperatura: 0.9 = Muito criativo
 *
 * 4. TESTE ANTI-ALUCINAÇÃO:
 *    - Temporariamente mude 'antiAlucinacao' para false
 *    - Pergunte sobre produtos que não existem
 *    - Veja se a IA inventa dados
 *    - SEMPRE reative depois do teste!
 *
 * DICAS:
 * - Salve o arquivo e recarregue a página para ver mudanças
 * - Uma mudança por vez para identificar o que funciona
 * - Use o console do navegador (F12) para ver erros
 * - Mantenha sempre a proteção anti-alucinação ativa
 */

// ============================================================================
// ✅ VALIDAÇÃO AUTOMÁTICA - NÃO MODIFIQUE
// ============================================================================

// Verificar se token está configurado
if (CONFIG_ALUNOS.ia.groq.token === "configure-seu-token-no-env") {
  console.warn("⚠️ ATENÇÃO: Configure seu token Groq no arquivo .env");
  console.warn("📝 Adicione: VITE_GROQ_API_KEY=seu_token_aqui");
}

// Verificar provider ativo
console.log(`🤖 Provider ativo: ${CONFIG_ALUNOS.ia.provider.toUpperCase()}`);
if (CONFIG_ALUNOS.ia.provider === "gemini" && !CONFIG_ALUNOS.ia.gemini.token) {
  console.warn("⚠️ ATENÇÃO: Provider Gemini selecionado mas token não configurado");
  console.warn("📝 Adicione: VITE_GEMINI_API_KEY=seu_token_aqui");
  console.warn("💡 OU mude para Groq: VITE_IA_PROVIDER=groq");
}

export default CONFIG_ALUNOS;
