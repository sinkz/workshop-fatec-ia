/**
 * 🔌 PROVIDER ABSTRATO DE IA PARA ALUNOS
 *
 * Interface unificada para múltiplos providers (Groq, Gemini, etc.)
 * Permite trocar de provider apenas mudando variável de ambiente
 */

import CONFIG_ALUNOS from "../config/config-alunos";
import GroqClientSimples from "./groq-client";
import GeminiClientSimples from "./gemini-client";

// ============================================================================
// 🔧 INTERFACE UNIFICADA
// ============================================================================

export interface RespostaIA {
  conteudo: string;
  sucesso: boolean;
  erro?: string;
  toolCalls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
  precisaExecutarTools?: boolean;
}

export interface IAProvider {
  /**
   * Enviar mensagem para IA com suporte opcional a ferramentas
   */
  enviarMensagem(
    mensagem: string,
    ferramentas?: Array<{
      type: "function";
      function: {
        name: string;
        description: string;
        parameters: {
          type: "object";
          properties: Record<string, any>;
          required?: string[];
        };
      };
    }>
  ): Promise<RespostaIA>;

  /**
   * Adicionar resultado de ferramenta ao histórico
   */
  adicionarResultadoFerramenta(
    toolCallId: string,
    nomeFerramenta: string,
    resultado: any
  ): void;

  /**
   * Limpar histórico de conversação
   */
  limparHistorico(): void;
}

// ============================================================================
// 🎭 ADAPTER PARA GROQ
// ============================================================================

class GroqProviderAdapter implements IAProvider {
  private client: GroqClientSimples;

  constructor() {
    this.client = new GroqClientSimples();
  }

  async enviarMensagem(
    mensagem: string,
    ferramentas?: any[]
  ): Promise<RespostaIA> {
    return this.client.enviarMensagem(mensagem, ferramentas);
  }

  adicionarResultadoFerramenta(
    toolCallId: string,
    nomeFerramenta: string,
    resultado: any
  ): void {
    this.client.adicionarResultadoFerramenta(
      toolCallId,
      nomeFerramenta,
      resultado
    );
  }

  limparHistorico(): void {
    this.client.limparHistorico();
  }
}

// ============================================================================
// 🎭 ADAPTER PARA GEMINI
// ============================================================================

class GeminiProviderAdapter implements IAProvider {
  private client: GeminiClientSimples;

  constructor() {
    this.client = new GeminiClientSimples();
  }

  async enviarMensagem(
    mensagem: string,
    ferramentas?: any[]
  ): Promise<RespostaIA> {
    return this.client.enviarMensagem(mensagem, ferramentas);
  }

  adicionarResultadoFerramenta(
    toolCallId: string,
    nomeFerramenta: string,
    resultado: any
  ): void {
    this.client.adicionarResultadoFerramenta(
      toolCallId,
      nomeFerramenta,
      resultado
    );
  }

  limparHistorico(): void {
    this.client.limparHistorico();
  }
}

// ============================================================================
// 🏭 FACTORY FUNCTION
// ============================================================================

/**
 * Criar provider de IA baseado na configuração
 *
 * Lê CONFIG_ALUNOS.ia.provider para decidir qual cliente usar
 */
export function criarProviderIA(): IAProvider {
  const provider = CONFIG_ALUNOS.ia.provider;

  console.log(`🤖 Criando provider: ${provider.toUpperCase()}`);

  switch (provider) {
    case "groq":
      console.log("✅ Provider Groq inicializado");
      return new GroqProviderAdapter();

    case "gemini":
      console.log("✅ Provider Gemini inicializado");
      return new GeminiProviderAdapter();

    default:
      console.warn(
        `⚠️ Provider desconhecido: ${provider}. Usando Groq como fallback.`
      );
      return new GroqProviderAdapter();
  }
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA ALUNOS
// ============================================================================

/**
 * COMO USAR:
 *
 * ```typescript
 * // Criar provider (automaticamente escolhe Groq ou Gemini)
 * const provider = criarProviderIA();
 *
 * // Usar normalmente (mesma interface para ambos)
 * const resposta = await provider.enviarMensagem("Olá!");
 *
 * if (resposta.sucesso) {
 *   console.log(resposta.conteudo);
 * }
 * ```
 *
 * TROCAR DE PROVIDER:
 * 1. Edite o arquivo .env
 * 2. Mude VITE_IA_PROVIDER=groq para VITE_IA_PROVIDER=gemini
 * 3. Configure VITE_GEMINI_API_KEY se usar Gemini
 * 4. Recarregue a página
 *
 * VANTAGENS:
 * - Zero mudança no código do chat
 * - Fácil adicionar novos providers (Claude, GPT-4, etc.)
 * - Interface unificada para todos
 * - Alunos trocam apenas no .env
 */

export default criarProviderIA;
