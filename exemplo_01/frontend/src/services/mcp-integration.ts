/**
 * 🔌 INTEGRAÇÃO MCP + IA SIMPLIFICADA PARA ALUNOS
 *
 * Integração simples entre IA (Groq/Gemini) e MCP para o chat inteligente
 */

import { criarProviderIA, IAProvider } from "./ia-provider";
import MCPClientSimples from "./mcp";
import { FERRAMENTAS_MCP } from "./mcp-tools-definitions";

// ============================================================================
// 🔧 TIPOS SIMPLES
// ============================================================================

export interface RespostaChatMCP {
  conteudo: string;
  sucesso: boolean;
  usouMCP: boolean;
  erro?: string;
}

// ============================================================================
// 🤖 INTEGRAÇÃO CHAT + MCP SIMPLIFICADA
// ============================================================================

export class ChatMCPIntegrado {
  private iaProvider: IAProvider;
  private mcpClient: MCPClientSimples;
  private mcpConectado: boolean = false;
  private onStatusChange?: (status: boolean) => void;

  constructor(onStatusChange?: (status: boolean) => void) {
    this.iaProvider = criarProviderIA();
    this.mcpClient = new MCPClientSimples();
    this.onStatusChange = onStatusChange;
    this.inicializarMCP();
  }

  /**
   * Inicializar conexão MCP (verifica backend)
   */
  private async inicializarMCP(): Promise<void> {
    try {
      console.log("🔄 Verificando conexão com backend...");
      const conectado = await this.mcpClient.verificarConexao();
      this.mcpConectado = conectado;
      console.log(
        conectado
          ? "✅ Backend conectado, ferramentas MCP disponíveis"
          : "⚠️ Backend offline"
      );

      // Notificar mudança de status
      if (this.onStatusChange) {
        this.onStatusChange(conectado);
      }
    } catch (error) {
      console.error("❌ Erro ao verificar backend:", error);
      this.mcpConectado = false;

      // Notificar mudança de status
      if (this.onStatusChange) {
        this.onStatusChange(false);
      }
    }
  }

  /**
   * Processar mensagem com integração MCP usando function calling
   */
  async processarMensagem(mensagem: string): Promise<RespostaChatMCP> {
    try {
      console.log("💬 Processando mensagem:", mensagem);

      // SEMPRE enviar com ferramentas disponíveis
      // A IA decide se precisa usar ou não
      const resposta = await this.iaProvider.enviarMensagem(
        mensagem,
        FERRAMENTAS_MCP
      );

      // Se IA pediu para executar ferramentas
      if (resposta.precisaExecutarTools && resposta.toolCalls) {
        console.log(
          "🔧 IA solicitou executar",
          resposta.toolCalls.length,
          "ferramentas"
        );
        return await this.executarFerramentasEProcessar(
          mensagem,
          resposta.toolCalls
        );
      }

      // Resposta direta sem ferramentas
      return {
        conteudo: resposta.conteudo,
        sucesso: resposta.sucesso,
        usouMCP: false,
        erro: resposta.erro,
      };
    } catch (error) {
      console.error("❌ Erro na integração:", error);
      return {
        conteudo: "❌ Erro ao processar sua mensagem. Tente novamente.",
        sucesso: false,
        usouMCP: false,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Executar ferramentas solicitadas pelo Groq e processar resultado final
   */
  private async executarFerramentasEProcessar(
    _mensagemOriginal: string,
    toolCalls: any[]
  ): Promise<RespostaChatMCP> {
    try {
      console.log("🔧 Executando", toolCalls.length, "ferramentas...");

      // Executar cada ferramenta solicitada
      for (const toolCall of toolCalls) {
        const nomeFerramenta = toolCall.function.name;
        const argumentosStr = toolCall.function.arguments;

        console.log(`🔧 Executando: ${nomeFerramenta}`);
        console.log(`📝 Argumentos raw:`, argumentosStr);

        // Parse dos argumentos
        let argumentos = {};
        try {
          argumentos = JSON.parse(argumentosStr);
        } catch (e) {
          console.warn("⚠️ Erro ao parsear argumentos, usando vazio");
        }

        console.log(`📋 Argumentos parseados:`, argumentos);

        // Executar ferramenta via MCP client
        const resultado = await this.mcpClient.executarFerramenta(
          nomeFerramenta,
          argumentos
        );

        console.log(
          `${resultado.sucesso ? "✅" : "❌"} ${nomeFerramenta}:`,
          resultado.sucesso ? "Sucesso" : resultado.erro
        );

        // Adicionar resultado ao histórico da IA
        this.iaProvider.adicionarResultadoFerramenta(
          toolCall.id,
          nomeFerramenta,
          resultado.sucesso ? resultado.dados : { erro: resultado.erro }
        );
      }

      // Enviar de volta para IA para gerar resposta final
      console.log("🤖 Enviando resultados para IA gerar resposta final...");
      const respostaFinal = await this.iaProvider.enviarMensagem(
        "", // Mensagem vazia, IA usa histórico
        FERRAMENTAS_MCP
      );

      return {
        conteudo: respostaFinal.conteudo,
        sucesso: respostaFinal.sucesso,
        usouMCP: true,
        erro: respostaFinal.erro,
      };
    } catch (error) {
      console.error("❌ Erro ao executar ferramentas:", error);
      return {
        conteudo:
          "❌ Erro ao executar as ferramentas solicitadas. Tente novamente.",
        sucesso: false,
        usouMCP: true,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Verificar status da conexão MCP
   */
  async verificarStatusMCP(): Promise<boolean> {
    return this.mcpConectado;
  }

  /**
   * Reconectar MCP se necessário
   */
  async reconectarMCP(): Promise<void> {
    if (!this.mcpConectado) {
      await this.inicializarMCP();
    }
  }

  /**
   * Limpar histórico de conversas
   */
  limparHistorico(): void {
    this.iaProvider.limparHistorico();
    console.log("🗑️ Histórico da IA limpo");
  }
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA ALUNOS
// ============================================================================

/**
 * COMO USAR:
 *
 * ```typescript
 * const chat = new ChatMCPIntegrado();
 *
 * // Processar mensagem
 * const resposta = await chat.processarMensagem("Listar produtos");
 *
 * if (resposta.sucesso) {
 *   console.log(resposta.conteudo);
 *   console.log("Usou MCP:", resposta.usouMCP);
 * }
 * ```
 *
 * FUNCIONALIDADES:
 * - Detecta automaticamente quando usar MCP
 * - Integra dados reais nas respostas da IA
 * - Fallback para resposta sem MCP se necessário
 * - Configurações vêm do config-alunos.ts
 * - Suporta múltiplos providers (Groq, Gemini) via ia-provider
 *
 * TROCAR PROVIDER:
 * - Mude VITE_IA_PROVIDER no .env (groq ou gemini)
 * - Configure o token correspondente
 * - Recarregue a página
 */

export default ChatMCPIntegrado;
