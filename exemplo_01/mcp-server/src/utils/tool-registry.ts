import {
  MCPTool,
  MCPToolHandler,
  MCPToolRegistry,
  MCPToolResult,
} from "../types/mcp";
import {
  logToolStart,
  logToolSuccess,
  logToolError,
  logServerEvent,
} from "./logger.js";

/**
 * REGISTRO DE FERRAMENTAS MCP
 *
 * Esta classe gerencia o registro e execução de ferramentas MCP com logging abrangente.
 *
 * CONCEITOS IMPORTANTES:
 * - Cada ferramenta tem uma DEFINIÇÃO (metadados) e um MANIPULADOR (código)
 * - O registro permite descoberta dinâmica de funcionalidades
 * - Logging detalhado para debugging e monitoramento
 */
export class ToolRegistry {
  private tools: MCPToolRegistry = {};

  /**
   * Registra uma nova ferramenta MCP
   * @param definicao Metadados da ferramenta (nome, descrição, esquema)
   * @param manipulador Função que executa a ferramenta
   */
  registerTool(definicao: MCPTool, manipulador: MCPToolHandler): void {
    this.tools[definicao.name] = {
      definition: definicao,
      handler: manipulador,
    };
    logServerEvent("ferramenta_registrada", { nomeFerramente: definicao.name });
  }

  /**
   * Obtém todas as definições de ferramentas registradas
   * Usado pelo chat para descobrir funcionalidades disponíveis
   */
  getToolDefinitions(): MCPTool[] {
    return Object.values(this.tools).map((ferramenta) => ferramenta.definition);
  }

  /**
   * Executa uma ferramenta pelo nome com logging abrangente e tratamento de erros
   * @param nome Nome da ferramenta a executar
   * @param argumentos Parâmetros para a ferramenta
   * @returns Resultado da execução da ferramenta
   */
  async executeTool(
    name: string,
    args: Record<string, any>
  ): Promise<MCPToolResult> {
    const startTime = Date.now();
    const tool = this.tools[name];

    if (!tool) {
      const availableTools = Object.keys(this.tools).join(", ");
      logToolError(
        name,
        new Error(`Tool not found. Available: ${availableTools}`),
        0
      );
      return {
        content: [
          {
            type: "text",
            text: `Error: Tool '${name}' not found. Available tools: ${availableTools}`,
          },
        ],
        isError: true,
      };
    }

    logToolStart(name, args);

    try {
      const result = await tool.handler(args);
      const executionTime = Date.now() - startTime;
      logToolSuccess(name, executionTime);
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const toolError =
        error instanceof Error ? error : new Error("Unknown error");
      logToolError(name, toolError, executionTime);

      return {
        content: [
          {
            type: "text",
            text: `Error executing tool '${name}': ${toolError.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Check if tool exists
   */
  hasTool(name: string): boolean {
    return name in this.tools;
  }

  /**
   * Get tool count
   */
  getToolCount(): number {
    return Object.keys(this.tools).length;
  }

  /**
   * Get tool names
   */
  getToolNames(): string[] {
    return Object.keys(this.tools);
  }
}
