/**
 * ⚙️ CONFIGURAÇÃO DO FRONTEND
 *

 *
 * Este é o ÚNICO arquivo que precisa ser configurado!
 */

// ========== IMPORTAR PERSONALIDADES ==========
/**
 * 🎭 SISTEMA MODULAR DE PERSONALIDADES
 *
 * As personalidades agora ficam em arquivos separados na pasta personalidades/
 *
 * COMO ADICIONAR UMA NOVA PERSONALIDADE:
 * 1. Crie um arquivo em personalidades/ (ex: genio.js)
 * 2. Siga o template dos arquivos existentes
 * 3. Importe no personalidades/index.js
 * 4. Adicione ao array PERSONALIDADES_DISPONIVEIS
 * 5. Pronto! Estará disponível aqui
 */
import PERSONALIDADES, {
  obterPersonalidade,
  personalidadeExiste,
  listarPersonalidades,
} from "./personalidades/index.js";

// ========== CONFIGURAÇÃO PRINCIPAL ==========
const CONFIG = {
  // 🤖 Configuração de IA - GROQ
  ia: {
    provider: "groq", // Provider único: Groq

    // Configuração Groq
    groq: {
      // Cole seu token aqui (obter em https://console.groq.com/)
      token: "seu-token-aqui",
      modelo: "meta-llama/llama-4-scout-17b-16e-instruct", // TPM 30K Free
      temperatura: 0.3, // 0.0 a 1.0
      maxTokens: 500, // 100 a 4096
    },
  },

  // 🤖 LEGADO: Mantido para compatibilidade (usa ia.groq)
  groq: {
    get token() {
      return CONFIG.ia.groq.token;
    },
    get modelo() {
      return CONFIG.ia.groq.modelo;
    },
    get temperatura() {
      return CONFIG.ia.groq.temperatura;
    },
    get maxTokens() {
      return CONFIG.ia.groq.maxTokens;
    },
  },

  // 🌐 URLs do sistema
  backend: {
    url: "http://localhost:3001",
  },

  // 🎭 PERSONALIDADE DA IA
  /**
   * Personalidades disponíveis:
   * - profissional: Formal e objetivo
   * - sarcastico: Irônico mas útil
   * - animado: Super empolgado! 🎉
   * - poeta: Linguagem poética
   * - minimalista: Conciso e direto
   *
   * ← Altere aqui no projetor com os alunos!
   */
  personalidade: "profissional",
};

// ========== APLICAR PERSONALIDADE ESCOLHIDA ==========
/**
 * 🎭 CARREGAR PERSONALIDADE SELECIONADA
 *
 * Busca a personalidade no Map e aplica prompt + boasVindas
 * Se não existir, usa "profissional" como fallback
 */
const personalidadeSelecionada =
  obterPersonalidade(CONFIG.personalidade) ||
  obterPersonalidade("profissional");

CONFIG.prompt = personalidadeSelecionada.prompt;
CONFIG.boasVindas = personalidadeSelecionada.boasVindas;

// ========== VALIDAÇÕES ==========
if (CONFIG.groq.token === "seu-token-aqui") {
  console.warn("⚠️ CONFIGURE SEU TOKEN GROQ NO ARQUIVO config.js");
}

if (!personalidadeExiste(CONFIG.personalidade)) {
  console.warn(
    `⚠️ Personalidade "${CONFIG.personalidade}" não encontrada. Usando "profissional".`
  );
  CONFIG.personalidade = "profissional";
}

// ========== LOGS DE INICIALIZAÇÃO ==========
console.log(`🎭 Personalidade ativa: ${CONFIG.personalidade}`);
console.log(
  `📚 Personalidades disponíveis:`,
  listarPersonalidades().map((p) => p.id)
);

// ========== EXPORTAR CONFIG ==========
export default CONFIG;
