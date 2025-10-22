/**
 * 🤖 CLIENTE GEMINI SIMPLIFICADO PARA ALUNOS
 *
 * Cliente simples que usa apenas as configurações dos alunos
 * Compatível com a interface do GroqClientSimples
 */

import {
  GoogleGenerativeAI,
  Content,
  FunctionCall,
  Part,
} from "@google/generative-ai";
import CONFIG_ALUNOS from "../config/config-alunos";

// ============================================================================
// 🔧 TIPOS SIMPLES
// ============================================================================

export interface MensagemGemini {
  role: "user" | "model" | "function";
  parts: Array<{ text?: string; functionCall?: any; functionResponse?: any }>;
}

export interface GeminiToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface GeminiTool {
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

export interface RespostaGemini {
  conteudo: string;
  sucesso: boolean;
  erro?: string;
  toolCalls?: GeminiToolCall[];
  precisaExecutarTools?: boolean;
}

// ============================================================================
// 🤖 CLIENTE GEMINI SIMPLIFICADO
// ============================================================================

export class GeminiClientSimples {
  private genAI: GoogleGenerativeAI;
  private apiKey: string;
  private historico: Content[] = [];
  private toolCallIdCounter = 0;

  constructor() {
    this.apiKey = CONFIG_ALUNOS.ia.gemini.token;

    if (!this.apiKey) {
      throw new Error(
        "Token Gemini não configurado. Configure VITE_GEMINI_API_KEY no .env"
      );
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  /**
   * Enviar mensagem para Gemini com suporte a function calling
   */
  async enviarMensagem(
    mensagemUsuario: string,
    ferramentasDisponiveis?: GeminiTool[]
  ): Promise<RespostaGemini> {
    try {
      // Configurar o modelo
      const modelConfig: any = {
        model: CONFIG_ALUNOS.ia.gemini.modelo,
        generationConfig: {
          temperature: CONFIG_ALUNOS.ia.gemini.temperatura,
          maxOutputTokens: CONFIG_ALUNOS.ia.gemini.maxTokens,
        },
        // IMPORTANTE: System instruction com as regras para usar ferramentas
        systemInstruction: CONFIG_ALUNOS.prompt,
      };

      // Adicionar ferramentas se disponíveis
      if (ferramentasDisponiveis && ferramentasDisponiveis.length > 0) {
        const geminiTools = this.converterToolsParaGemini(
          ferramentasDisponiveis
        );
        modelConfig.tools = geminiTools;
        console.log(
          "🛠️ Enviando",
          ferramentasDisponiveis.length,
          "ferramentas para Gemini"
        );
      }

      const model = this.genAI.getGenerativeModel(modelConfig);

      // Se há histórico, usar chat com histórico
      let result;
      if (this.historico.length > 0) {
        // Criar sessão de chat com histórico existente
        const chat = model.startChat({
          history: this.historico,
        });

        // Enviar mensagem (vazia se for continuação após tool call)
        if (mensagemUsuario.trim()) {
          result = await chat.sendMessage(mensagemUsuario);
        } else {
          // Continuação após tool calls - enviar mensagem vazia
          result = await chat.sendMessage("");
        }
      } else {
        // Primeira mensagem - criar chat novo
        const chat = model.startChat({
          history: [],
        });
        result = await chat.sendMessage(mensagemUsuario);
      }

      const response = result.response;
      const candidate = response.candidates?.[0];

      if (!candidate) {
        throw new Error("Resposta vazia do Gemini");
      }

      // Adicionar mensagem do usuário ao histórico (se não vazia)
      if (mensagemUsuario.trim()) {
        this.historico.push({
          role: "user",
          parts: [{ text: mensagemUsuario }],
        });
      }

      // Verificar se há function calls
      const functionCalls = this.extrairFunctionCalls(candidate);

      if (functionCalls.length > 0) {
        console.log(
          "🔧 Gemini solicitou",
          functionCalls.length,
          "chamadas de ferramentas"
        );

        // Adicionar resposta do modelo ao histórico
        this.historico.push({
          role: "model",
          parts: candidate.content.parts,
        });

        // Converter para formato compatível
        const toolCalls = functionCalls.map((fc) => ({
          id: this.gerarToolCallId(),
          type: "function" as const,
          function: {
            name: fc.name,
            arguments: JSON.stringify(fc.args),
          },
        }));

        return {
          conteudo: "",
          sucesso: true,
          toolCalls,
          precisaExecutarTools: true,
        };
      }

      // Resposta normal (sem function calls)
      const texto = candidate.content.parts
        .map((part: Part) => part.text || "")
        .join("");

      // Limpar tags de raciocínio do modelo
      const conteudoLimpo = this.limparTagsRaciocinio(texto);

      // Adicionar resposta ao histórico
      this.historico.push({
        role: "model",
        parts: [{ text: conteudoLimpo }],
      });

      // Verificação anti-alucinação simples
      if (
        CONFIG_ALUNOS.antiAlucinacao &&
        this.detectarAlucinacao(conteudoLimpo)
      ) {
        return {
          conteudo:
            "⚠️ Desculpe, não tenho informações suficientes para responder com precisão. Por favor, consulte os dados do sistema.",
          sucesso: false,
          erro: "Possível alucinação detectada",
        };
      }

      return {
        conteudo: conteudoLimpo,
        sucesso: true,
      };
    } catch (error) {
      console.error("Erro no cliente Gemini:", error);
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
    _toolCallId: string,
    nomeFerramenta: string,
    resultado: any
  ): void {
    // Gemini usa formato específico para function responses
    // O campo "response" deve conter um objeto simples, não arrays
    this.historico.push({
      role: "function",
      parts: [
        {
          functionResponse: {
            name: nomeFerramenta,
            response: {
              result: resultado,
            },
          },
        },
      ],
    });
  }

  /**
   * Limpar histórico
   */
  limparHistorico(): void {
    this.historico = [];
    this.toolCallIdCounter = 0;
  }

  /**
   * Converter tools de formato Groq (OpenAI) para formato Gemini
   */
  private converterToolsParaGemini(groqTools: GeminiTool[]): any[] {
    const functionDeclarations = groqTools.map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      parameters: tool.function.parameters,
    }));

    return [{ functionDeclarations }];
  }

  /**
   * Extrair function calls da resposta do Gemini
   */
  private extrairFunctionCalls(candidate: any): FunctionCall[] {
    const functionCalls: FunctionCall[] = [];

    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.functionCall) {
          functionCalls.push(part.functionCall);
        }
      }
    }

    return functionCalls;
  }

  /**
   * Gerar ID único para tool call (compatibilidade com Groq)
   */
  private gerarToolCallId(): string {
    return `call_gemini_${++this.toolCallIdCounter}`;
  }

  /**
   * Limpar tags de raciocínio interno do modelo
   */
  private limparTagsRaciocinio(conteudo: string): string {
    if (!conteudo) return "";

    // Remove tags <think>...</think> e <thinking>...</thinking>
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
 * const cliente = new GeminiClientSimples();
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
 *
 * COMPATIBILIDADE:
 * - Interface idêntica ao GroqClientSimples
 * - Suporta function calling (tools)
 * - Histórico de conversação mantido
 */

export default GeminiClientSimples;
