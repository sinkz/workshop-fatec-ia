/**
 * 🤖 CLIENTE GROQ.AI SIMPLIFICADO PARA ALUNOS
 *
 * Cliente simples que usa apenas as configurações dos alunos
 */

import CONFIG_ALUNOS from "../config/config-alunos";

// ============================================================================
// 🔧 TIPOS SIMPLES
// ============================================================================

export interface MensagemGroq {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  name?: string;
}

export interface GroqToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface GroqTool {
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
}

export interface RespostaGroq {
  conteudo: string;
  sucesso: boolean;
  erro?: string;
  toolCalls?: GroqToolCall[];
  precisaExecutarTools?: boolean;
}

// ============================================================================
// 🤖 CLIENTE GROQ SIMPLIFICADO
// ============================================================================

export class GroqClientSimples {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";
  private historico: MensagemGroq[] = [];

  constructor() {
    this.apiKey = CONFIG_ALUNOS.groq.token;

    if (!this.apiKey || this.apiKey === "configure-seu-token-no-env") {
      throw new Error(
        "Token Groq.ai não configurado. Configure VITE_GROQ_API_KEY no .env"
      );
    }

    // Adicionar system prompt ao histórico
    this.historico.push({
      role: "system",
      content: CONFIG_ALUNOS.prompt,
    });
  }

  /**
   * Enviar mensagem para Groq.ai com suporte a function calling
   */
  async enviarMensagem(
    mensagemUsuario: string,
    ferramentasDisponiveis?: GroqTool[]
  ): Promise<RespostaGroq> {
    try {
      // Adicionar mensagem do usuário ao histórico
      this.historico.push({
        role: "user",
        content: mensagemUsuario,
      });

      // Preparar request body
      const requestBody: any = {
        model: CONFIG_ALUNOS.groq.modelo,
        messages: this.historico,
        temperature: CONFIG_ALUNOS.groq.temperatura,
        max_tokens: CONFIG_ALUNOS.groq.maxTokens,
      };

      // Adicionar ferramentas se disponíveis
      if (ferramentasDisponiveis && ferramentasDisponiveis.length > 0) {
        requestBody.tools = ferramentasDisponiveis;
        requestBody.tool_choice = "auto"; // Deixa o modelo decidir
        console.log(
          "🛠️ Enviando",
          ferramentasDisponiveis.length,
          "ferramentas para Groq"
        );
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Erro Groq: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message;

      if (!message) {
        throw new Error("Resposta vazia do Groq");
      }

      // Verificar se há tool_calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(
          "🔧 Groq solicitou",
          message.tool_calls.length,
          "chamadas de ferramentas"
        );

        // Adicionar mensagem do assistente ao histórico
        this.historico.push({
          role: "assistant",
          content: message.content || "",
        });

        return {
          conteudo: message.content || "",
          sucesso: true,
          toolCalls: message.tool_calls,
          precisaExecutarTools: true,
        };
      }

      // Resposta normal (sem tool calls)
      let conteudo = message.content || "Erro: resposta vazia";

      // Limpar tags de raciocínio do modelo
      conteudo = this.limparTagsRaciocinio(conteudo);

      // Adicionar resposta ao histórico
      this.historico.push({
        role: "assistant",
        content: conteudo,
      });

      // Verificação anti-alucinação simples
      if (CONFIG_ALUNOS.antiAlucinacao && this.detectarAlucinacao(conteudo)) {
        return {
          conteudo:
            "⚠️ Desculpe, não tenho informações suficientes para responder com precisão. Por favor, consulte os dados do sistema.",
          sucesso: false,
          erro: "Possível alucinação detectada",
        };
      }

      return {
        conteudo,
        sucesso: true,
      };
    } catch (error) {
      console.error("Erro no cliente Groq:", error);
      return {
        conteudo:
          "❌ Erro ao processar sua solicitação. Verifique sua conexão e configurações.",
        sucesso: false,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Adicionar resultado de ferramenta ao histórico
   */
  adicionarResultadoFerramenta(
    toolCallId: string,
    nomeFerramenta: string,
    resultado: any
  ): void {
    this.historico.push({
      role: "tool",
      tool_call_id: toolCallId,
      name: nomeFerramenta,
      content: JSON.stringify(resultado),
    });
  }

  /**
   * Limpar histórico
   */
  limparHistorico(): void {
    this.historico = [
      {
        role: "system",
        content: CONFIG_ALUNOS.prompt,
      },
    ];
  }

  /**
   * Limpar tags de raciocínio interno do modelo (Qwen usa <think>)
   */
  private limparTagsRaciocinio(conteudo: string): string {
    if (!conteudo) return "";

    // Remove tags <think>...</think> e <thinking>...</thinking>
    // Usa flag 's' (dotall) para que . capture quebras de linha
    let limpo = conteudo;

    // Remove todas as ocorrências de <think>
    limpo = limpo.replace(/<think>.*?<\/think>/gis, "");
    limpo = limpo.replace(/<thinking>.*?<\/thinking>/gis, "");

    // Remove tags órfãs (caso apareçam sozinhas)
    limpo = limpo.replace(/<\/?think>/gi, "");
    limpo = limpo.replace(/<\/?thinking>/gi, "");

    // Limpar múltiplas quebras de linha e espaços extras
    limpo = limpo.replace(/\n{3,}/g, "\n\n").trim();

    return limpo;
  }

  /**
   * Detecção simples de alucinação
   */
  private detectarAlucinacao(conteudo: string): boolean {
    if (!CONFIG_ALUNOS.antiAlucinacao) return false;

    const indicadores = [
      /inventei|criei|imaginei/i,
      /não tenho certeza, mas/i,
      /provavelmente|talvez|possivelmente/i,
      /baseado na minha experiência/i,
    ];

    return indicadores.some((indicador) => indicador.test(conteudo));
  }
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA ALUNOS
// ============================================================================

/**
 * COMO USAR:
 *
 * ```typescript
 * const cliente = new GroqClientSimples();
 * const resposta = await cliente.enviarMensagem("Olá!");
 *
 * if (resposta.sucesso) {
 *   console.log(resposta.conteudo);
 * } else {
 *   console.error(resposta.erro);
 * }
 * ```
 *
 * CONFIGURAÇÕES:
 * - Todas as configurações vêm do config-alunos.ts
 * - Token, modelo, temperatura, etc.
 * - Anti-alucinação sempre ativo se configurado
 */

export default GroqClientSimples;
