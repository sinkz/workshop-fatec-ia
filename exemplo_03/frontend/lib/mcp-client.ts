/**
 * 🔌 CLIENTE MCP
 *
 * Cliente HTTP para comunicação com o backend proxy MCP.
 * O backend (porta 3001) faz a ponte entre o frontend (HTTP)
 * e o Neon MCP Server (stdio).
 */

import { appConfig } from "@/config/app.config";

const BACKEND_URL = appConfig.backend.url;

/**
 * Interface para ferramenta MCP
 */
export interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

/**
 * Interface para resposta do backend
 */
interface MCPResponse {
  tools?: MCPTool[];
  result?: any;
  error?: string;
}

/**
 * 📋 Buscar ferramentas disponíveis no Neon MCP Server
 *
 * Retorna lista de tools que a IA pode usar para interagir
 * com o banco de dados (execute_sql, describe_table_schema, etc)
 *
 * @returns Promise<MCPTool[]> - Lista de ferramentas
 */
export async function buscarFerramentasMCP(): Promise<MCPTool[]> {
  try {
    console.log("🔍 Buscando ferramentas MCP do backend...");

    const response = await fetch(`${BACKEND_URL}/tools`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MCPResponse = await response.json();

    if (!data.tools || !Array.isArray(data.tools)) {
      throw new Error("Resposta inválida do backend (tools não encontrado)");
    }

    console.log(`✅ ${data.tools.length} ferramentas MCP encontradas`);

    return data.tools;
  } catch (error) {
    console.error("❌ Erro ao buscar ferramentas MCP:", error);
    throw new Error(
      "Falha ao conectar com o backend MCP. " +
        "Verifique se o backend está rodando na porta 3001."
    );
  }
}

/**
 * 🔧 Executar ferramenta do Neon MCP Server
 *
 * Envia comando para o backend executar uma ferramenta MCP.
 * Exemplo: run_sql para executar queries SQL.
 *
 * @param name - Nome da ferramenta (ex: "run_sql")
 * @param args - Argumentos da ferramenta (ex: { query: "SELECT * FROM recipes" })
 * @returns Promise<any> - Resultado da execução
 */
export async function executarFerramentaMCP(
  name: string,
  args: Record<string, any>
): Promise<any> {
  try {
    console.log(`🔧 Executando ferramenta MCP: ${name}`);
    console.log("📦 Argumentos:", JSON.stringify(args).slice(0, 200));

    const response = await fetch(`${BACKEND_URL}/tools/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        arguments: args,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: MCPResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    console.log("✅ Ferramenta executada com sucesso");

    return data.result;
  } catch (error) {
    console.error(`❌ Erro ao executar ${name}:`, error);
    throw error;
  }
}

/**
 * 🏥 Verificar saúde do backend MCP
 *
 * @returns Promise<boolean> - True se backend está funcionando
 */
export async function verificarBackendMCP(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.status === "ok" && data.neonMCP === "connected";
  } catch (error) {
    console.error("❌ Backend MCP não está acessível:", error);
    return false;
  }
}

/**
 * 🔍 Obter schema da tabela recipes (helper)
 *
 * Usa a ferramenta describe_table_schema do Neon MCP para
 * obter a estrutura da tabela recipes.
 *
 * @returns Promise<any> - Schema da tabela
 */
export async function obterSchemaReceitas(): Promise<any> {
  try {
    return await executarFerramentaMCP("describe_table_schema", {
      table: "recipes",
      schema: "public",
    });
  } catch (error) {
    console.error("Erro ao obter schema de receitas:", error);
    throw error;
  }
}

/**
 * 📊 Executar SQL via MCP (helper)
 *
 * @param query - Query SQL a executar
 * @returns Promise<any> - Resultado da query
 */
export async function executarSQL(query: string): Promise<any> {
  try {
    return await executarFerramentaMCP("run_sql", {
      sql: query,
    });
  } catch (error) {
    console.error("Erro ao executar SQL via MCP:", error);
    throw error;
  }
}
