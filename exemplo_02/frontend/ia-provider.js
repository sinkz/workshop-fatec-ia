/**
 * 🤖 PROVIDER ABSTRATO DE IA
 * 
 * Suporta múltiplos providers: Groq e Gemini
 * Troca automaticamente baseado em CONFIG.ia.provider
 */

/**
 * Enviar mensagem para IA (detecta provider automaticamente)
 */
async function enviarMensagemIA(mensagem, ferramentas = []) {
  const { provider } = CONFIG.ia;

  console.log(`🤖 Usando provider: ${provider.toUpperCase()}`);

  if (provider === "gemini") {
    return enviarMensagemGemini(mensagem, ferramentas);
  }

  return enviarMensagemGroq(mensagem, ferramentas);
}

/**
 * Enviar mensagem para Groq
 */
async function enviarMensagemGroq(mensagem, ferramentas) {
  const { groq } = CONFIG.ia;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groq.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groq.modelo,
        messages: [
          {
            role: "system",
            content: obterPromptSistema(),
          },
          {
            role: "user",
            content: mensagem,
          },
        ],
        temperature: groq.temperatura,
        max_tokens: groq.maxTokens,
        tools: ferramentas.length > 0 ? ferramentas : undefined,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || `Erro Groq: ${response.statusText}`
    );
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    toolCalls: data.choices[0].message.tool_calls,
    provider: "groq",
  };
}

/**
 * Enviar mensagem para Gemini
 */
async function enviarMensagemGemini(mensagem, ferramentas) {
  const { gemini } = CONFIG.ia;

  if (!gemini.token) {
    throw new Error(
      "Token do Gemini não configurado! Configure em CONFIG.ia.gemini.token"
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${gemini.modelo}:generateContent?key=${gemini.token}`;

  // Converter ferramentas de formato Groq/OpenAI para Gemini
  const geminiTools =
    ferramentas.length > 0 ? convertToGeminiTools(ferramentas) : undefined;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${obterPromptSistema()}\n\nUsuário: ${mensagem}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: gemini.temperatura,
      maxOutputTokens: gemini.maxTokens,
    },
  };

  if (geminiTools) {
    requestBody.tools = geminiTools;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || `Erro Gemini: ${response.statusText}`
    );
  }

  const data = await response.json();
  const candidate = data.candidates[0];

  return {
    content: candidate.content.parts[0].text,
    toolCalls: extractGeminiToolCalls(candidate),
    provider: "gemini",
  };
}

/**
 * Converter ferramentas de formato Groq/OpenAI para Gemini
 */
function convertToGeminiTools(groqTools) {
  return [
    {
      functionDeclarations: groqTools.map((tool) => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      })),
    },
  ];
}

/**
 * Extrair tool calls do formato Gemini
 */
function extractGeminiToolCalls(candidate) {
  if (
    !candidate.content.parts ||
    !candidate.content.parts.some((p) => p.functionCall)
  ) {
    return undefined;
  }

  return candidate.content.parts
    .filter((p) => p.functionCall)
    .map((p) => ({
      id: crypto.randomUUID(),
      type: "function",
      function: {
        name: p.functionCall.name,
        arguments: JSON.stringify(p.functionCall.args),
      },
    }));
}

/**
 * Obter prompt do sistema baseado na personalidade
 */
function obterPromptSistema() {
  const personalidade = PERSONALIDADES[CONFIG.personalidade] || PERSONALIDADES.profissional;
  return personalidade.prompt;
}

