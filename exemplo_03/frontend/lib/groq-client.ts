/**
 * 🤖 CLIENTE GROQ
 *
 * Cliente para chat com IA (Groq) usando Function Calling.
 * A IA pode executar ferramentas do Neon MCP para interagir
 * com o banco de dados e sugerir receitas.
 */

import Groq from "groq-sdk";
import { appConfig } from "@/config/app.config";
import {
  buscarFerramentasMCP,
  executarFerramentaMCP,
  type MCPTool,
} from "./mcp-client";
import type { ReceitaInput } from "@/types/receita";
import { obterPersonalidade } from "@/personalidades";

// Inicializar cliente Groq
const groq = new Groq({
  apiKey: appConfig.groq.apiKey,
  dangerouslyAllowBrowser: true, // Necessário para rodar no browser
});

/**
 * Prompt system BASE que guia a IA
 * A personalidade escolhida em app.config.ts será adicionada a este prompt
 */
const SYSTEM_PROMPT_BASE = `Você é um assistente especializado em receitas culinárias chamado ReceitasIA.

Você tem acesso ao banco de dados de receitas através de ferramentas MCP do Neon Database.

## SUA MISSÃO:
1. Buscar receitas no banco de dados quando solicitado
2. Sugerir novas receitas criativas quando solicitado
3. SEMPRE distinguir entre BUSCAR (banco) vs CRIAR (nova receita)

## QUANDO USAR FERRAMENTAS (run_sql):
✅ USE ferramentas SQL quando o usuário:
- Quiser VER receitas que JÁ EXISTEM no banco
- Usar verbos: "mostre", "liste", "busque", "encontre", "quais", "quantas"
- Exemplos: "mostre receitas de bolo", "quais receitas doces tenho?", "liste todas as receitas"
- Pedir detalhes de uma receita ESPECÍFICA por ID ou título

❌ NÃO USE ferramentas quando o usuário:
- Pedir para CRIAR/SUGERIR/INVENTAR uma receita NOVA
- Usar verbos: "crie", "sugira", "invente", "me dê uma ideia"
- Enviar saudações ou perguntas genéricas
- Apenas conversar

## REGRA CRÍTICA - BUSCAR vs CRIAR:
🔍 BUSCAR no banco (usar run_sql):
- "mostre receitas de bolo" → SELECT * FROM receitas WHERE titulo ILIKE '%bolo%'
- "quais receitas eu tenho?" → SELECT * FROM receitas
- "lista receitas doces" → SELECT * FROM receitas WHERE categoria = 'doce'
- "busque torta de chocolate" → SELECT * FROM receitas WHERE titulo ILIKE '%torta%chocolate%'

✨ CRIAR nova receita (SEM ferramenta, gerar JSON):
- "sugira uma receita de bolo" → Gerar receita criativa com JSON
- "crie uma receita vegana" → Gerar receita criativa com JSON
- "me dê uma ideia de sobremesa" → Gerar receita criativa com JSON

🎯 REGRAS IMPORTANTES PARA SQL:
- SEMPRE use ILIKE (case-insensitive) ao invés de = para buscar por título
- Use % para busca parcial: WHERE titulo ILIKE '%termo%'
- Para múltiplas palavras: WHERE titulo ILIKE '%palavra1%' AND titulo ILIKE '%palavra2%'
- Nunca use = para comparar títulos, apenas ILIKE

## IMPORTANTE SOBRE CRIAR RECEITAS NOVAS:
- NUNCA salve receitas diretamente no banco usando run_sql INSERT
- Quando CRIAR uma receita nova, você DEVE:
  1. Gerar uma receita criativa e original
  2. SEMPRE incluir um bloco JSON no final da resposta
  3. O JSON deve estar dentro de: \`\`\`json { ... } \`\`\`
  4. O usuário verá um botão para salvar a receita no banco

## FORMATO OBRIGATÓRIO DA RESPOSTA PARA RECEITAS:

Quando sugerir uma receita, SEMPRE termine sua resposta com:

\`\`\`json
{
  "titulo": "Nome da Receita",
  "descricao": "Descrição breve e atrativa",
  "ingredientes": [
    "quantidade + ingrediente 1",
    "quantidade + ingrediente 2"
  ],
  "modo_preparo": "Passo 1: ...\nPasso 2: ...\nPasso 3: ...",
  "tempo_preparo": 30,
  "porcoes": 4,
  "dificuldade": "facil",
  "categoria": "salgado"
}
\`\`\`

CATEGORIAS válidas: "doce", "salgado", "bebida", "sobremesa", "entrada", "prato_principal", "lanche"
DIFICULDADE válidas: "facil", "medio", "dificil"

## EXEMPLOS DE CONVERSA:

👤: "Oi!"
🤖: Responde SEM usar ferramentas → "Olá! 👋 Sou o ReceitasIA! Posso BUSCAR receitas que você já salvou no banco ou CRIAR receitas novas para você. O que prefere?"

👤: "Quais receitas doces eu tenho?" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE categoria = 'doce' → "Encontrei 3 receitas doces no seu banco: ..."

👤: "Mostre receitas de bolo" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE titulo ILIKE '%bolo%' → "Achei 2 receitas de bolo salvas: ..."

👤: "Busque torta de chocolate" ← BUSCAR
🤖: USA ferramenta run_sql → SELECT * FROM receitas WHERE titulo ILIKE '%torta%' AND titulo ILIKE '%chocolate%' → "Encontrei uma Torta de Chocolate! 🍫..."

👤: "Me sugira uma receita de bolo de chocolate" ← CRIAR NOVA
🤖: Gera receita SEM ferramentas → "Aqui está uma deliciosa receita de Bolo de Chocolate! 🍰 [texto explicativo] \`\`\`json { \"titulo\": \"Bolo de Chocolate\", ... } \`\`\`"

👤: "Crie uma receita vegana para mim" ← CRIAR NOVA
🤖: Gera receita SEM ferramentas → "Que tal essa receita vegana? 🌱 [texto] \`\`\`json { ... } \`\`\`"

## REGRAS PARA CHAMAR FERRAMENTAS:
- Números (tempo_preparo, porcoes) devem ser enviados como números, não strings
- NÃO envie projectId - o sistema injeta automaticamente
- Use ILIKE para buscas de texto: WHERE titulo ILIKE '%termo%'
- Exemplos CORRETOS:
  ✅ {"sql": "SELECT * FROM receitas WHERE titulo ILIKE '%bolo%'"}
  ✅ {"sql": "SELECT * FROM receitas WHERE categoria = 'doce' LIMIT 10"}
  ❌ {"sql": "SELECT * FROM receitas WHERE titulo = 'Bolo de Chocolate'", "projectId": "xxx"}

## ESTILO PADRÃO:
- Responda em português brasileiro
- Seja criativo nas sugestões
- Sempre pergunte se o usuário quer mais detalhes

OBSERVAÇÃO: Você tem uma personalidade específica definida abaixo que sobrescreve o estilo padrão.`;

/**
 * Interface para mensagens
 */
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Interface para resposta do chat
 */
export interface ChatResponse {
  message: string;
  receitaSugerida?: ReceitaInput;
  toolsUsed?: string[];
}

/**
 * 💬 Enviar mensagem para a IA
 *
 * @param userMessage - Mensagem do usuário
 * @param conversationHistory - Histórico da conversa
 * @returns Promise<ChatResponse> - Resposta da IA
 */
export async function enviarMensagemGroq(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<ChatResponse> {
  try {
    console.log("💬 Enviando mensagem para Groq:", userMessage);

    // 🎭 Obter personalidade configurada
    const personalidade = obterPersonalidade(appConfig.personalidade.ativa);
    console.log(
      `🎭 Usando personalidade: ${personalidade.nome} ${personalidade.emoji}`
    );

    // 📝 Construir prompt completo (base + personalidade)
    const SYSTEM_PROMPT =
      SYSTEM_PROMPT_BASE + "\n\n" + personalidade.promptAdicional;

    // Buscar ferramentas MCP disponíveis
    const mcpTools = await buscarFerramentasMCP();

    // 🎯 FILTRAR apenas ferramentas relevantes para receitas (reduzir tokens)
    // Neon MCP tem 23 ferramentas, mas só precisamos de 4 para SQL básico
    const ferramentasRelevantes = [
      "run_sql", // Executar queries SQL
      "run_sql_transaction", // Executar múltiplas queries em transação
      "get_database_tables", // Listar tabelas
      "describe_table_schema", // Ver estrutura da tabela
    ];

    const toolsFiltradas = mcpTools.filter((tool) =>
      ferramentasRelevantes.includes(tool.name)
    );

    console.log(
      `🎯 Usando ${toolsFiltradas.length} de ${mcpTools.length} ferramentas (otimizado para tokens)`
    );

    // 🔄 ADAPTAR schemas do Neon MCP para formato Groq
    // Neon MCP envolve parâmetros em { params: { ... } }, mas Groq espera parâmetros diretos
    const tools = toolsFiltradas.map((tool) => {
      const schema = tool.inputSchema;

      // Extrair propriedades do objeto "params"
      const paramsSchema = schema?.properties?.params || {
        type: "object",
        properties: {},
      };

      // Remover projectId dos campos obrigatórios (será injetado automaticamente)
      const requiredFields = (paramsSchema.required || []).filter(
        (field: string) => field !== "projectId"
      );

      return {
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description || "",
          // Usar schema interno (sem o wrapper "params")
          parameters: {
            type: "object",
            properties: paramsSchema.properties || {},
            required: requiredFields,
          },
        },
      };
    });

    // Construir mensagens
    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    // Primeira chamada à IA (pode decidir usar tools)
    let response = await groq.chat.completions.create({
      model: appConfig.groq.model,
      messages: messages as any,
      tools,
      tool_choice: "auto",
      temperature: appConfig.groq.temperature,
      max_tokens: appConfig.groq.maxTokens,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.0,
    });

    const toolsUsed: string[] = [];
    let finalMessage = "";
    let receitaSugerida: ReceitaInput | undefined;

    // Loop para executar tool calls (pode haver múltiplos)
    while (response.choices[0].finish_reason === "tool_calls") {
      const toolCalls = response.choices[0].message.tool_calls;

      if (!toolCalls) break;

      console.log(`🔧 IA solicitou ${toolCalls.length} tool call(s)`);

      // Executar cada tool call
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const toolName = toolCall.function.name;
          let toolArgs = JSON.parse(toolCall.function.arguments);

          console.log(`  → Executando: ${toolName}`);
          console.log(`  → Args recebidos do Groq:`, toolArgs);
          toolsUsed.push(toolName);

          try {
            // 🔄 ADAPTAR args do Groq para formato Neon MCP
            // Groq envia: { sql: "...", projectId: "..." }
            // Neon espera: { params: { sql: "...", projectId: "..." } }

            // Injetar projectId automaticamente se não fornecido
            // TODO: Obter do backend ou configuração
            if (!toolArgs.projectId) {
              toolArgs.projectId = appConfig.neon?.projectId || "auto";
            }

            // Envolver em "params" para Neon MCP
            const neonArgs = { params: toolArgs };

            console.log(`  → Args adaptados para Neon:`, neonArgs);

            const result = await executarFerramentaMCP(toolName, neonArgs);

            return {
              tool_call_id: toolCall.id,
              role: "tool" as const,
              content: JSON.stringify(result),
            };
          } catch (error: any) {
            return {
              tool_call_id: toolCall.id,
              role: "tool" as const,
              content: JSON.stringify({ error: error.message }),
            };
          }
        })
      );

      // Adicionar tool calls e resultados ao histórico
      messages.push(response.choices[0].message as any);
      // Truncar conteúdo das tools para reduzir tokens
      const toolResultsTrunc = toolResults.map((t) => ({
        ...t,
        content:
          typeof t.content === "string" && t.content.length > 1200
            ? t.content.slice(0, 1200) + "…"
            : t.content,
      }));
      messages.push(...(toolResultsTrunc as any));

      // Nova chamada à IA com os resultados dos tools – força finalização
      response = await groq.chat.completions.create({
        model: appConfig.groq.model,
        messages: messages as any,
        tools,
        tool_choice: "none",
        temperature: appConfig.groq.temperature,
        max_tokens: appConfig.groq.maxTokens,
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0.0,
      });
    }

    // Resposta final da IA
    finalMessage = response.choices[0].message.content || "";

    // 🔄 FALLBACK: Detectar tool calls no formato texto (compatibilidade com modelos antigos)
    // Alguns modelos retornam: <function/run_sql>{"sql": "..."}</function>
    if (
      finalMessage.includes("<function/") &&
      finalMessage.includes("</function>")
    ) {
      console.warn(
        "⚠️ Modelo retornou tool call em formato texto. Use um modelo com melhor suporte a function calling."
      );

      // Extrair nome da função e argumentos
      const match = finalMessage.match(
        /<function\/(\w+)>(\{.*?\})<\/function>/
      );
      if (match) {
        const [, toolName, argsJson] = match;
        console.log(`🔧 Detectado tool call manual: ${toolName}`);

        try {
          const toolArgs = JSON.parse(argsJson);

          // Injetar projectId se necessário
          if (!toolArgs.projectId) {
            toolArgs.projectId = appConfig.neon?.projectId || "auto";
          }

          const neonArgs = { params: toolArgs };
          const result = await executarFerramentaMCP(toolName, neonArgs);

          toolsUsed.push(toolName);

          // Formatar resultado de forma amigável
          if (Array.isArray(result)) {
            finalMessage = `Encontrei ${
              result.length
            } receita(s):\n\n${JSON.stringify(result, null, 2)}`;
          } else {
            finalMessage = JSON.stringify(result, null, 2);
          }
        } catch (error: any) {
          finalMessage = `Erro ao executar ferramenta: ${error.message}`;
        }
      }
    }

    console.log("✅ Resposta da IA recebida");
    console.log("🔧 Tools usadas:", toolsUsed);

    // Tentar extrair receita sugerida da resposta (se houver JSON)
    receitaSugerida = extrairReceitaDoTexto(finalMessage);

    return {
      message: finalMessage,
      receitaSugerida,
      toolsUsed,
    };
  } catch (error: any) {
    console.error("❌ Erro ao comunicar com Groq:", error);

    // Tratar erros comuns
    if (error.message?.includes("API key")) {
      throw new Error(
        "Token do Groq inválido ou não configurado. " +
          "Edite o arquivo config/app.config.ts e adicione seu token."
      );
    }

    throw new Error(`Erro ao processar mensagem: ${error.message}`);
  }
}

/**
 * 🔍 Extrair receita do texto da IA
 *
 * Tenta encontrar um JSON de receita na resposta da IA.
 * A IA pode incluir a receita em formato JSON para ser salva.
 *
 * @param text - Texto da resposta da IA
 * @returns ReceitaInput | undefined
 */
function extrairReceitaDoTexto(text: string): ReceitaInput | undefined {
  try {
    console.log("🔍 Tentando extrair receita do texto...");

    // 1. Procurar por blocos ```json ... ```
    let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonMatch) {
      console.log("✅ Encontrado bloco ```json");
      const jsonText = jsonMatch[1].trim();
      const parsed = JSON.parse(jsonText);

      if (validarReceita(parsed)) {
        console.log("✅ Receita válida extraída!");
        return parsed as ReceitaInput;
      }
    }

    // 2. Procurar por qualquer code block ```
    jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      console.log("✅ Encontrado code block genérico");
      try {
        const jsonText = jsonMatch[1].trim();
        const parsed = JSON.parse(jsonText);

        if (validarReceita(parsed)) {
          console.log("✅ Receita válida extraída!");
          return parsed as ReceitaInput;
        }
      } catch (e) {
        console.log("❌ Code block não é JSON válido");
      }
    }

    // 3. Procurar por JSON direto no texto (sem code blocks)
    const jsonDireto = text.match(/\{[\s\S]*?"titulo"[\s\S]*?\}/);
    if (jsonDireto) {
      console.log("✅ Encontrado JSON direto no texto");
      const parsed = JSON.parse(jsonDireto[0]);

      if (validarReceita(parsed)) {
        console.log("✅ Receita válida extraída!");
        return parsed as ReceitaInput;
      }
    }

    console.log("ℹ️ Nenhuma receita em formato JSON encontrada na resposta");
  } catch (error) {
    console.log(
      "❌ Erro ao extrair receita:",
      error instanceof Error ? error.message : error
    );
  }

  return undefined;
}

/**
 * Validar se o objeto tem os campos essenciais de uma receita
 */
function validarReceita(obj: any): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.titulo === "string" &&
    obj.titulo.trim() !== "" &&
    Array.isArray(obj.ingredientes) &&
    obj.ingredientes.length > 0 &&
    typeof obj.modo_preparo === "string" &&
    obj.modo_preparo.trim() !== ""
  );
}

/**
 * 🧪 Testar conexão com Groq
 *
 * @returns Promise<boolean>
 */
export async function testarGroq(): Promise<boolean> {
  try {
    await groq.chat.completions.create({
      model: appConfig.groq.model,
      messages: [{ role: "user", content: "teste" }],
      max_tokens: 5,
    });
    return true;
  } catch (error) {
    console.error("Erro ao testar Groq:", error);
    return false;
  }
}
