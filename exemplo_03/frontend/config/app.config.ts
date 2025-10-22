/**
 * ⚙️ CONFIGURAÇÕES DO APLICATIVO
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * IMPORTANTE: Este arquivo contém as configurações que você
 * precisa ajustar para o sistema funcionar.
 *
 * Este é o ÚNICO arquivo que você precisa editar no frontend!
 * (Além do .env.local com a connection string do Neon)
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export const appConfig = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🤖 CONFIGURAÇÃO DO CHAT IA (GROQ)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  groq: {
    /**
     * 🔑 API KEY DO GROQ
     *
     * Como obter:
     * 1. Acesse: https://console.groq.com/keys
     * 2. Faça login ou crie uma conta gratuita
     * 3. Clique em "Create API Key"
     * 4. Dê um nome (ex: "workshop-fatec")
     * 5. Copie a chave gerada
     * 6. Cole abaixo substituindo "COLE_SEU_TOKEN_GROQ_AQUI"
     */
    apiKey: "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",

    /**
     * 🧠 MODELO DE IA
     *
     * Opções disponíveis (do mais rápido ao mais preciso):
     * - "llama-3.3-70b-versatile" (recomendado - equilibrado) ✅
     * - "llama-3.1-70b-versatile" (alternativa estável)
     * - "mixtral-8x7b-32768" (mais rápido, menor contexto)
     * - "llama3-groq-70b-8192-tool-use-preview" (otimizado para tools)
     *
     * Não precisa alterar, mas pode testar outros modelos!
     */

    model: "llama-3.3-70b-versatile",

    /**
     * 🌡️ TEMPERATURA
     *
     * Controla a criatividade da IA:
     * - 0.0 = Muito preciso e determinístico
     * - 0.5 = Equilibrado
     * - 1.0 = Muito criativo e variado
     *
     * Para receitas, 0.7 é um bom balanço!
     */
    temperature: 0.7,

    /**
     * 📏 TOKENS MÁXIMOS
     *
     * Limite de tokens na resposta da IA.
     * Quanto maior, mais longa a resposta pode ser.
     */
    maxTokens: 2000,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌉 CONFIGURAÇÃO DO BACKEND MCP
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  backend: {
    /**
     * 🔗 URL DO BACKEND PROXY MCP
     *
     * O backend deve estar rodando antes de iniciar o frontend.
     *
     * Para iniciar o backend:
     *   cd backend
     *   npm start
     *
     * Não precisa alterar esta URL (a menos que mude a porta do backend).
     */
    url: "http://localhost:3001",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🗄️ CONFIGURAÇÃO DO NEON DATABASE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  neon: {
    /**
     * 🆔 PROJECT ID DO NEON
     *
     * Como obter:
     * 1. Acesse: https://console.neon.tech
     * 2. Selecione seu projeto
     * 3. Na URL você verá: /app/projects/[PROJECT_ID]
     * 4. Ou vá em "Project settings" → copie o Project ID
     *
     * Deixe como "auto" para usar o primeiro projeto disponível.
     * Isso funciona bem se você tem apenas 1 projeto no Neon.
     */
    projectId: "auto",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 CONFIGURAÇÃO VISUAL DO APP
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app: {
    /**
     * 📛 NOME DO APLICATIVO
     *
     * Aparece no header e no título da página.
     */
    nome: "ReceitasIA",

    /**
     * 📝 DESCRIÇÃO
     *
     * Descrição curta do sistema.
     */
    descricao: "Sistema de receitas com inteligência artificial",

    /**
     * 🎭 EMOJIS DE CATEGORIAS
     *
     * Emojis que aparecem ao lado de cada categoria de receita.
     */
    categoriasEmojis: {
      doce: "🍰",
      salgado: "🍕",
      bebida: "🥤",
      sobremesa: "🍮",
      entrada: "🥗",
      prato_principal: "🍛",
      lanche: "🥪",
      outro: "🍽️",
    },
  },
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ✅ CHECKLIST DE CONFIGURAÇÃO
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * [ ] 1. Configurei o .env.local com NEON_DATABASE_URL
 * [ ] 2. Colei meu token do Groq em groq.apiKey acima
 * [ ] 3. O backend está rodando (npm start na pasta backend)
 * [ ] 4. Instalei as dependências (npm install)
 * [ ] 5. Posso rodar o frontend (npm run dev)
 *
 * Tudo certo? Bora testar! 🚀
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
