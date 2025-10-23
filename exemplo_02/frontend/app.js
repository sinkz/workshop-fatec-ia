/**
 * 📱 LÓGICA PRINCIPAL DO FRONTEND
 *
 * Sistema ultra-simples com:
 * - Lista de produtos (atualiza automaticamente)
 * - Chat com Groq.ai + Function Calling
 */

// ========== IMPORTAR CONFIGURAÇÃO ==========
import CONFIG from "./config.js";

// ========== FERRAMENTAS DISPONÍVEIS PARA O GROQ ==========
/**
 * 🛠️ POR QUE DEFINIMOS FERRAMENTAS?
 *
 * O Groq (IA) precisa SABER quais ferramentas existem para poder usá-las.
 * É como dar um "menu de opções" para a IA escolher.
 *
 * FORMATO GROQ/OPENAI FUNCTION CALLING:
 * - type: "function" → Indica que é uma ferramenta executável
 * - function.name → Nome único da ferramenta
 * - function.description → Explica QUANDO a IA deve usar
 * - function.parameters → Define QUAIS dados a IA deve fornecer
 *
 * COMO FUNCIONA:
 * 1. Enviamos este array para o Groq junto com a mensagem do usuário
 * 2. Groq ANALISA a mensagem e DECIDE se precisa usar alguma ferramenta
 * 3. Se precisar, Groq RETORNA qual ferramenta + os argumentos
 * 4. Nós EXECUTAMOS a ferramenta e enviamos o resultado de volta
 * 5. Groq gera a resposta final usando os dados reais
 *
 * VANTAGEM: A IA decide INTELIGENTEMENTE, não usamos if/else manual!
 */
const FERRAMENTAS_GROQ = [
  // ===== FERRAMENTA 1: LISTAR PRODUTOS =====
  {
    type: "function", // Tipo padrão Groq/OpenAI
    function: {
      name: "listar_produtos", // Nome que usamos para executar
      description: "Lista todos os produtos disponíveis no sistema", // Groq lê isso!
      parameters: {
        type: "object",
        properties: {}, // Sem parâmetros - só lista tudo
        required: [], // Nada obrigatório
      },
    },
  },
  // ===== FERRAMENTA 2: CRIAR PRODUTO =====
  {
    type: "function",
    function: {
      name: "criar_produto",
      description: "Cria um novo produto no sistema", // Groq usa quando usuário pedir "crie..."
      parameters: {
        type: "object",
        properties: {
          // Groq vai EXTRAIR esses dados da mensagem do usuário!
          nome: { type: "string", description: "Nome do produto" },
          preco: { type: "number", description: "Preço em reais" },
          categoria: { type: "string", description: "Categoria do produto" },
        },
        required: ["nome", "preco", "categoria"], // Groq DEVE fornecer todos
      },
    },
  },
];

/**
 * 🔌 FERRAMENTAS DINÂMICAS DO MCP
 *
 * Este array será preenchido automaticamente ao conectar com o MCP Server.
 * Se o MCP estiver offline, usa FERRAMENTAS_GROQ como fallback.
 */
let FERRAMENTAS_MCP_DINAMICAS = [];

/**
 * 🔌 INICIALIZAR CONEXÃO COM MCP SERVER
 *
 * INTEGRAÇÃO REAL:
 * - Frontend busca ferramentas do MCP Server dinamicamente
 * - MCP Server fornece lista atualizada de tools e resources
 * - Frontend usa essas ferramentas para enviar ao Groq
 *
 * FLUXO:
 * 1. Frontend → GET /tools → MCP Server
 * 2. MCP Server responde com ferramentas disponíveis
 * 3. Frontend converte para formato Groq
 * 4. Groq recebe ferramentas e pode decidir qual usar
 *
 * FALLBACK:
 * Se MCP estiver offline, usa ferramentas estáticas (FERRAMENTAS_GROQ)
 */
async function inicializarMCP() {
  try {
    console.log("🔌 Buscando ferramentas do MCP Server...");

    // Buscar lista de tools do MCP Server
    const toolsResponse = await fetch("http://localhost:3003/tools");

    if (!toolsResponse.ok) {
      throw new Error(`MCP Server retornou ${toolsResponse.status}`);
    }

    const toolsData = await toolsResponse.json();

    // Converter formato MCP para formato Groq (OpenAI Function Calling)
    FERRAMENTAS_MCP_DINAMICAS = toolsData.tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema || {
          type: "object",
          properties: {},
          required: [],
        },
      },
    }));

    console.log(
      `✅ ${FERRAMENTAS_MCP_DINAMICAS.length} ferramentas carregadas do MCP Server`
    );
    console.log(
      "   Ferramentas:",
      FERRAMENTAS_MCP_DINAMICAS.map((f) => f.function.name).join(", ")
    );

    // Buscar resources e adicionar ao contexto do sistema
    try {
      const resourcesResponse = await fetch("http://localhost:3003/resources");
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        console.log(
          `📚 ${resourcesData.resources.length} recursos disponíveis no MCP`
        );

        // Buscar conteúdo de cada resource e adicionar ao prompt
        if (resourcesData.resources.length > 0) {
          console.log("📖 Carregando conteúdo dos recursos...");

          let contextosAdicionais =
            "\n\n=== DOCUMENTAÇÃO DO SISTEMA (via MCP Resources) ===\n\n";

          for (const resource of resourcesData.resources) {
            try {
              // Buscar conteúdo do resource
              const uriEncoded = encodeURIComponent(resource.uri);
              const contentResponse = await fetch(
                `http://localhost:3003/resources/${uriEncoded}`
              );

              if (contentResponse.ok) {
                const contentData = await contentResponse.json();
                contextosAdicionais += `\n--- ${contentData.name} ---\n`;
                contextosAdicionais += `${contentData.content}\n`;
                console.log(`   ✅ Resource "${contentData.name}" carregado`);
              }
            } catch (resErr) {
              console.warn(`   ⚠️ Erro ao carregar resource ${resource.name}`);
            }
          }

          // Adicionar resources ao prompt do sistema
          if (historicoGroq.length > 0 && historicoGroq[0].role === "system") {
            historicoGroq[0].content += contextosAdicionais;
            console.log(
              "✅ Contexto dos recursos adicionado ao prompt do sistema"
            );
          }
        }
      }
    } catch (err) {
      console.warn("⚠️ Erro ao buscar resources (não crítico):", err.message);
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com MCP Server:", error.message);
    console.warn("⚠️ Usando ferramentas estáticas como fallback");
    console.warn(
      "   Certifique-se de que o MCP Server está rodando na porta 3003"
    );
    // Mantém FERRAMENTAS_GROQ estático como fallback
    return false;
  }
}

/**
 * 📜 HISTÓRICO DE CONVERSAÇÃO
 *
 * POR QUE MANTER HISTÓRICO?
 * - O Groq precisa de CONTEXTO para responder corretamente
 * - Sem histórico, cada mensagem é independente (IA "esquece" o que foi dito)
 * - Com histórico, a IA mantém uma conversa coerente
 *
 * FORMATO:
 * - role: "system" → Instruções permanentes para a IA (personalidade, regras)
 * - role: "user" → Mensagens do usuário
 * - role: "assistant" → Respostas da IA
 * - role: "tool" → Resultados de ferramentas executadas
 *
 * FLUXO:
 * 1. Usuário envia mensagem → adiciona ao histórico
 * 2. Groq analisa TODO o histórico para contexto
 * 3. Groq responde → adiciona ao histórico
 * 4. Próxima mensagem tem acesso ao histórico completo
 */
let historicoGroq = [{ role: "system", content: CONFIG.prompt }];

// ========== CARREGAR PRODUTOS DO BACKEND ==========
async function carregarProdutos() {
  try {
    const response = await fetch(`${CONFIG.backend.url}/produtos`);
    const produtos = await response.json();

    const lista = document.getElementById("produtos-lista");

    if (produtos.length === 0) {
      lista.innerHTML = '<p class="loading">Nenhum produto cadastrado</p>';
      return;
    }

    lista.innerHTML = produtos
      .map(
        (p) => `
      <div class="produto-card">
        <h3>${p.nome}</h3>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <span class="categoria">${p.categoria}</span>
      </div>
    `
      )
      .join("");

    console.log("📦 Produtos carregados:", produtos.length);
  } catch (error) {
    console.error("❌ Erro ao carregar produtos:", error);
    document.getElementById("produtos-lista").innerHTML =
      '<p class="loading">❌ Erro ao carregar produtos</p>';
  }
}

// ========== ENVIAR MENSAGEM NO CHAT ==========
async function enviarMensagem() {
  const input = document.getElementById("chat-input");
  const mensagem = input.value.trim();

  if (!mensagem) return;

  // Validar token
  if (CONFIG.groq.token === "COLOCAR_SEU_TOKEN_GROQ_AQUI") {
    adicionarMensagem(
      "assistant",
      "⚠️ Configure o token Groq no arquivo config.js"
    );
    return;
  }

  // Adicionar mensagem do usuário
  adicionarMensagem("user", mensagem);
  input.value = "";

  // Adicionar ao histórico
  historicoGroq.push({
    role: "user",
    content: mensagem,
  });

  // Mostrar loading
  const loadingId = mostrarLoading();

  try {
    // Chamar Groq com function calling (usa historicoGroq global)
    const resposta = await chamarGroqComFerramentas();

    // Remover loading
    removerLoading(loadingId);

    // Adicionar resposta
    adicionarMensagem("assistant", resposta);

    // Atualizar lista de produtos (pode ter criado algo)
    await carregarProdutos();
  } catch (error) {
    removerLoading(loadingId);
    console.error("❌ Erro no chat:", error);
    adicionarMensagem(
      "assistant",
      "❌ Erro ao processar mensagem. Verifique o console."
    );
  }
}

// ========== CHAMAR GROQ COM FUNCTION CALLING ==========
/**
 * 🤖 FUNCTION CALLING - O CORAÇÃO DA INTEGRAÇÃO
 *
 * POR QUE FUNCTION CALLING?
 * - Permite a IA DECIDIR qual ferramenta usar (não precisamos adivinhar!)
 * - IA extrai automaticamente os argumentos da mensagem do usuário
 * - Sistema fica INTELIGENTE e escalável
 *
 * FLUXO COMPLETO:
 * 1. Enviamos histórico + ferramentas disponíveis para Groq
 * 2. Groq analisa e decide: "preciso chamar criar_produto"
 * 3. Groq retorna: tool_calls com nome da ferramenta + argumentos
 * 4. Executamos a ferramenta com os argumentos
 * 5. Enviamos resultado de volta para Groq
 * 6. Groq gera resposta final natural para o usuário
 *
 * OBS: Não precisa de parâmetro porque usa o historicoGroq global
 */
async function chamarGroqComFerramentas() {
  try {
    // ========== PASSO 1: CHAMAR GROQ COM FERRAMENTAS ==========
    /**
     * Enviamos:
     * - messages: Histórico completo da conversa
     * - tools: Array de ferramentas disponíveis (FERRAMENTAS_GROQ)
     * - tool_choice: "auto" → Deixa o Groq DECIDIR se usa ferramenta ou não
     * - temperature: Controla "criatividade" (0.1 = preciso, 0.9 = criativo)
     */
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CONFIG.groq.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: CONFIG.groq.modelo,
          messages: janelaHistorico(historicoGroq, 8), // janela deslizante
          tools:
            FERRAMENTAS_MCP_DINAMICAS.length > 0
              ? FERRAMENTAS_MCP_DINAMICAS // ← Usa ferramentas do MCP (se disponível)
              : FERRAMENTAS_GROQ, // ← Fallback se MCP offline
          tool_choice: "auto", // ← Deixa o Groq decidir
          temperature: CONFIG.groq.temperatura,
          max_tokens: CONFIG.groq.maxTokens,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0.0,
        }),
      }
    );

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    // ========== PASSO 2: VERIFICAR SE GROQ QUER USAR FERRAMENTAS ==========
    /**
     * Se a IA decidiu usar ferramentas, a resposta vem com:
     * - tool_calls: Array de ferramentas que a IA quer executar
     * - Cada tool_call tem:
     *   - id: Identificador único (para rastrear)
     *   - function.name: Qual ferramenta executar
     *   - function.arguments: Argumentos extraídos da mensagem (JSON string)
     *
     * EXEMPLO:
     * Usuário: "Crie um produto Mouse Gamer por R$ 150"
     * Groq retorna: {
     *   tool_calls: [{
     *     id: "call_abc123",
     *     function: {
     *       name: "criar_produto",
     *       arguments: '{"nome":"Mouse Gamer","preco":150,"categoria":"..."}'
     *     }
     *   }]
     * }
     */
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log(
        "🔧 Groq solicitou",
        assistantMessage.tool_calls.length,
        "ferramentas"
      );

      // Adicionar resposta do assistente ao histórico
      // (mesmo sem content, precisamos registrar que a IA pediu ferramentas)
      historicoGroq.push(assistantMessage);

      // ========== PASSO 3: EXECUTAR CADA FERRAMENTA SOLICITADA ==========
      /**
       * Loop pelas ferramentas que o Groq pediu.
       * Pode ser mais de uma! Ex: "Liste produtos e crie um novo"
       */
      for (const toolCall of assistantMessage.tool_calls) {
        const nomeFerramenta = toolCall.function.name;

        // Parsear argumentos (vem como string JSON)
        const argumentos = JSON.parse(toolCall.function.arguments);

        console.log(`🔧 Executando: ${nomeFerramenta}`, argumentos);

        // Executar a ferramenta (chama nosso backend)
        const resultado = await executarFerramenta(nomeFerramenta, argumentos);

        // ========== PASSO 4: ADICIONAR RESULTADO AO HISTÓRICO ==========
        /**
         * CRÍTICO: Groq precisa receber o resultado da ferramenta!
         *
         * Format específico:
         * - role: "tool" → Indica que é resultado de ferramenta
         * - tool_call_id → Liga com a ferramenta solicitada
         * - name → Qual ferramenta foi executada
         * - content → Resultado (sempre string, por isso JSON.stringify)
         *
         * Com isso, Groq sabe o que aconteceu e pode gerar resposta adequada.
         */
        const toolContent = (() => {
          try {
            const raw = JSON.stringify(resultado);
            return raw.length > 1000 ? raw.slice(0, 1000) + "…" : raw;
          } catch (e) {
            return String(resultado);
          }
        })();

        historicoGroq.push({
          role: "tool",
          tool_call_id: toolCall.id, // Liga com a solicitação original
          name: nomeFerramenta,
          content: toolContent, // Resultado resumido
        });
      }

      // ========== PASSO 5: CHAMAR GROQ NOVAMENTE COM OS RESULTADOS ==========
      /**
       * POR QUE CHAMAR DE NOVO?
       * - Agora o histórico TEM os resultados das ferramentas
       * - Groq vai usar esses dados para gerar uma resposta NATURAL
       * - Em vez de retornar JSON bruto, Groq formata para o usuário
       *
       * EXEMPLO:
       * Histórico agora tem:
       * - user: "Crie um Mouse Gamer"
       * - assistant: [tool_call: criar_produto]
       * - tool: {"id":4,"nome":"Mouse Gamer","preco":150}
       *
       * Groq lê tudo isso e responde:
       * "✅ Produto Mouse Gamer criado com sucesso! ID: 4, Preço: R$ 150,00"
       */
      const finalResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CONFIG.groq.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: CONFIG.groq.modelo,
            messages: janelaHistorico(historicoGroq, 8), // janela deslizante
            tools:
              FERRAMENTAS_MCP_DINAMICAS.length > 0
                ? FERRAMENTAS_MCP_DINAMICAS // ← Usa ferramentas do MCP
                : FERRAMENTAS_GROQ, // ← Fallback se MCP offline
            tool_choice: "none", // ← Força resposta final, sem novas tools
            temperature: CONFIG.groq.temperatura,
            max_tokens: CONFIG.groq.maxTokens,
            top_p: 0.9,
            frequency_penalty: 0.2,
            presence_penalty: 0.0,
          }),
        }
      );

      const finalData = await finalResponse.json();
      const finalMessage = finalData.choices[0].message.content;

      // Adicionar resposta final ao histórico para próximas mensagens
      historicoGroq.push({
        role: "assistant",
        content: finalMessage,
      });

      // Limpar tags de raciocínio (Qwen mostra <think>...</think>)
      return limparTagsRaciocinio(finalMessage);
    }

    // ========== CASO: GROQ NÃO USOU FERRAMENTAS ==========
    /**
     * Se chegou aqui, significa que o Groq respondeu DIRETAMENTE.
     * Isso acontece quando:
     * - Usuário faz pergunta genérica ("Olá", "Como funciona?")
     * - Pergunta não precisa de dados do sistema
     *
     * Neste caso, só processamos a resposta normalmente.
     */
    const conteudo = assistantMessage.content;

    // Adicionar ao histórico
    historicoGroq.push({
      role: "assistant",
      content: conteudo,
    });

    // Limpar e retornar
    return limparTagsRaciocinio(conteudo);
  } catch (error) {
    console.error("❌ Erro ao chamar Groq:", error);
    throw error;
  }
}

// ========== EXECUTAR FERRAMENTA ==========
/**
 * 🔧 EXECUÇÃO DAS FERRAMENTAS VIA MCP SERVER
 *
 * INTEGRAÇÃO REAL:
 * - Frontend NÃO chama backend diretamente mais
 * - Frontend chama MCP Server (porta 3003)
 * - MCP Server orquestra chamada ao backend (porta 3001)
 * - MCP Server retorna resultado formatado
 *
 * ARQUITETURA:
 * Frontend → MCP Server (HTTP) → Backend Express
 *
 * FLUXO:
 * 1. Groq decide qual ferramenta usar (via Function Calling)
 * 2. Frontend chama POST /tools/call no MCP Server
 * 3. MCP Server executa ferramenta apropriada
 * 4. MCP Server chama backend via HTTP
 * 5. Backend processa e retorna dados
 * 6. MCP Server formata e retorna para frontend
 * 7. Frontend retorna para Groq
 * 8. Groq gera resposta natural para usuário
 *
 * VANTAGENS:
 * - MCP Server centraliza lógica de ferramentas
 * - Frontend fica mais simples (só chama MCP)
 * - Fácil adicionar novas ferramentas (só no MCP)
 * - Protocolo padronizado (MCP)
 */
async function executarFerramenta(nome, argumentos) {
  try {
    console.log(`🔧 Executando ferramenta via MCP Server: ${nome}`);
    if (Object.keys(argumentos || {}).length > 0) {
      console.log(`   Argumentos:`, argumentos);
    }

    // Chamar MCP Server em vez do backend direto
    const response = await fetch("http://localhost:3003/tools/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nome,
        arguments: argumentos || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `MCP Server retornou ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`✅ Resultado do MCP Server:`, data.result);

    return data.result;
  } catch (error) {
    console.error(`❌ Erro ao executar ${nome} via MCP:`, error.message);
    console.error(
      "   Certifique-se de que o MCP Server está rodando na porta 3003"
    );
    // Retornar erro estruturado para o Groq processar
    return { erro: error.message };
  }
}

// ========== LIMPAR TAGS DE RACIOCÍNIO ==========
function limparTagsRaciocinio(texto) {
  if (!texto) return "";
  return texto
    .replace(/<think>.*?<\/think>/gis, "")
    .replace(/<thinking>.*?<\/thinking>/gis, "")
    .trim();
}

// ========== ADICIONAR MENSAGEM NO CHAT ==========
function adicionarMensagem(tipo, conteudo) {
  const mensagensDiv = document.getElementById("chat-mensagens");
  const hora = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mensagemDiv = document.createElement("div");
  mensagemDiv.className = `mensagem ${tipo}`;
  mensagemDiv.innerHTML = `
    <div>${conteudo}</div>
    <div class="mensagem-hora">${hora}</div>
  `;

  mensagensDiv.appendChild(mensagemDiv);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
}

// ========== LOADING INDICATOR ==========
function mostrarLoading() {
  const mensagensDiv = document.getElementById("chat-mensagens");
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-indicator";
  loadingDiv.className = "mensagem assistant";
  loadingDiv.innerHTML = `
    <div class="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  mensagensDiv.appendChild(loadingDiv);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
  return "loading-indicator";
}

function removerLoading(id) {
  const loadingDiv = document.getElementById(id);
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// ========== LIMPAR CHAT ==========
function limparChat() {
  document.getElementById("chat-mensagens").innerHTML = "";

  // Resetar histórico
  historicoGroq = [{ role: "system", content: CONFIG.prompt }];

  // Mostrar boas-vindas
  adicionarMensagem("assistant", CONFIG.boasVindas);

  console.log("🗑️ Chat limpo");
}

// ========== JANELA DESLIZANTE DO HISTÓRICO ==========
function janelaHistorico(historico, ultimas) {
  if (!Array.isArray(historico) || historico.length === 0) return [];
  // manter a primeira mensagem do tipo system, se houver
  const temSystem = historico[0] && historico[0].role === "system";
  const system = temSystem ? [historico[0]] : [];
  const resto = historico.slice(temSystem ? 1 : 0);
  const janela = resto.slice(-ultimas);
  return [...system, ...janela];
}

// ========== ENTER PARA ENVIAR ==========
function handleKeyPress(event) {
  if (event.key === "Enter") {
    enviarMensagem();
  }
}

// ========== EXPOR FUNÇÕES GLOBALMENTE (para onclick do HTML) ==========
window.carregarProdutos = carregarProdutos;
window.enviarMensagem = enviarMensagem;
window.limparChat = limparChat;
window.handleKeyPress = handleKeyPress;

// ========== INICIALIZAÇÃO ==========
window.onload = async function () {
  console.log("🚀 Sistema iniciado");

  // Inicializar conexão com MCP Server
  await inicializarMCP();

  console.log("📋 Configuração:", {
    backend: CONFIG.backend.url,
    mcpServer: "http://localhost:3003",
    modelo: CONFIG.groq.modelo,
    tokenConfigurado: CONFIG.groq.token !== "COLOCAR_SEU_TOKEN_GROQ_AQUI",
    ferramentasMCP:
      FERRAMENTAS_MCP_DINAMICAS.length > 0
        ? "Dinâmicas (MCP)"
        : "Estáticas (fallback)",
  });

  // Carregar produtos
  carregarProdutos();

  // Atualizar produtos a cada 5 segundos
  setInterval(carregarProdutos, 5000);

  // Mensagem de boas-vindas
  adicionarMensagem("assistant", CONFIG.boasVindas);
};
