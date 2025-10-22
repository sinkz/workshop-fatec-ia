/**
 * TIPOS MCP - Model Context Protocol
 *
 * O MCP é um protocolo que permite que aplicações de chat (como Claude, ChatGPT)
 * se conectem com sistemas externos de forma padronizada e segura.
 *
 * Por que usar MCP em vez de chamadas REST diretas no chat?
 * 1. CONTEXTO DINÂMICO: O chat entende automaticamente quais ferramentas estão disponíveis
 * 2. VALIDAÇÃO AUTOMÁTICA: Os argumentos são validados automaticamente pelo protocolo
 * 3. DESCOBERTA DE RECURSOS: O chat pode explorar e entender o que cada ferramenta faz
 * 4. SEGURANÇA: Controle fino sobre quais operações o chat pode executar
 * 5. PADRONIZAÇÃO: Interface consistente independente do sistema backend
 *
 * RECURSOS MCP vs FERRAMENTAS MCP
 *
 * FERRAMENTAS (Tools):
 * - Executam AÇÕES (criar, atualizar, deletar)
 * - Modificam o estado do sistema
 * - Exemplo: criar_produto, atualizar_estoque
 *
 * RECURSOS (Resources):
 * - Fornecem INFORMAÇÕES estáticas ou semi-estáticas
 * - Não modificam o estado
 * - Exemplo: documentação da API, esquemas de dados, configurações
 */

// Interfaces compatíveis com o SDK MCP oficial
export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface MCPServerConfig {
  name: string;
  version: string;
  apiBaseUrl: string;
  timeout: number;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolHandler {
  (args: Record<string, any>): Promise<MCPToolResult>;
}

export interface MCPToolRegistry {
  [toolName: string]: {
    definition: MCPTool;
    handler: MCPToolHandler;
  };
}

// Interfaces para recursos MCP (demonstração educacional)
export interface RecursoMCP {
  uri: string;
  nome: string;
  descricao: string;
  tipoMime: string;
}

export interface ConteudoRecursoMCP {
  uri: string;
  tipoMime: string;
  conteudo: string;
}
