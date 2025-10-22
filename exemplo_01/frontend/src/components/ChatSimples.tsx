/**
 * 🤖 CHAT SIMPLIFICADO PARA ALUNOS
 *
 * Versão simplificada do chat que usa apenas as configurações essenciais
 */

import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Wifi, WifiOff } from "lucide-react";
import { useConfigAlunos } from "../config/useConfigAlunos";
import { MensagemChatProps } from "../types/components";
import { ChatMCPIntegrado } from "../services/mcp-integration";

// Chave para salvar histórico no localStorage
const STORAGE_KEY = "chat-mcp-historico";

export function ChatSimples() {
  const [mensagens, setMensagens] = useState<MensagemChatProps[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mcpOnline, setMcpOnline] = useState(false);
  const [verificandoMcp, setVerificandoMcp] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { config, erro, pronto } = useConfigAlunos();

  const chatIntegrado = useRef<ChatMCPIntegrado | null>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Status do MCP é atualizado via callback do ChatMCPIntegrado
  // Não precisa mais de verificação periódica

  useEffect(() => {
    if (pronto && !chatIntegrado.current) {
      try {
        // Callback para atualizar status do MCP quando conectar
        chatIntegrado.current = new ChatMCPIntegrado((status) => {
          setMcpOnline(status);
          setVerificandoMcp(false);
          console.log(
            "📡 Status MCP atualizado:",
            status ? "Online ✅" : "Offline ❌"
          );
        });
        console.log("✅ Chat integrado inicializado com sucesso");
      } catch (error) {
        console.error("❌ Erro ao inicializar chat:", error);
        setMcpOnline(false);
        setVerificandoMcp(false);
      }
    }
  }, [pronto]);

  // Restaurar histórico do localStorage ao montar
  useEffect(() => {
    if (pronto) {
      try {
        const historicoSalvo = localStorage.getItem(STORAGE_KEY);

        if (historicoSalvo) {
          const mensagensSalvas = JSON.parse(historicoSalvo);
          // Converter timestamps de string para Date
          const mensagensRestauradas = mensagensSalvas.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMensagens(mensagensRestauradas);
          console.log(
            "📜 Histórico restaurado:",
            mensagensRestauradas.length,
            "mensagens"
          );
        } else {
          // Se não tem histórico, mostrar boas-vindas
          const mensagemInicial: MensagemChatProps = {
            id: "boas-vindas",
            conteudo: config.boasVindas,
            tipo: "assistente",
            timestamp: new Date(),
          };
          setMensagens([mensagemInicial]);
        }
      } catch (error) {
        console.error("Erro ao restaurar histórico:", error);
        // Em caso de erro, mostrar boas-vindas
        const mensagemInicial: MensagemChatProps = {
          id: "boas-vindas",
          conteudo: config.boasVindas,
          tipo: "assistente",
          timestamp: new Date(),
        };
        setMensagens([mensagemInicial]);
      }
    }
  }, [config.boasVindas, pronto]);

  // Salvar histórico no localStorage sempre que mensagens mudarem
  useEffect(() => {
    if (mensagens.length > 0 && pronto) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mensagens));
        console.log("💾 Histórico salvo:", mensagens.length, "mensagens");
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      }
    }
  }, [mensagens, pronto]);

  /**
   * Enviar mensagem (versão simplificada)
   */
  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || carregando) return;

    const mensagem = inputValue.trim();
    setInputValue("");

    // Adicionar mensagem do usuário
    const mensagemUsuario: MensagemChatProps = {
      id: Date.now().toString(),
      conteudo: mensagem,
      tipo: "usuario",
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, mensagemUsuario]);
    setCarregando(true);

    try {
      // TODO: AQUI OS ALUNOS IMPLEMENTARÃO A INTEGRAÇÃO REAL
      // Por enquanto, resposta simulada (substitua pela integração MCP + Groq)
      if (!chatIntegrado.current) {
        throw new Error(
          "Chat não inicializado. Verifique o token Groq no .env"
        );
      }

      const resposta = await chatIntegrado.current.processarMensagem(mensagem);

      const mensagemAssistente: MensagemChatProps = {
        id: (Date.now() + 1).toString(),
        conteudo: resposta.conteudo,
        tipo: "assistente",
        timestamp: new Date(),
      };

      setMensagens((prev) => [...prev, mensagemAssistente]);

      if (resposta.usouMCP) {
        console.log("✅ Resposta gerada com dados do MCP");
      } else {
        console.log("ℹ️ Resposta gerada sem MCP");
      }
    } catch (error) {
      const mensagemErro: MensagemChatProps = {
        id: (Date.now() + 1).toString(),
        conteudo:
          "❌ Erro ao processar sua solicitação. Verifique:\n\n" +
          "1. Token Groq configurado no .env\n" +
          "2. Backend rodando (porta 3001)\n" +
          "3. Console do navegador (F12) para mais detalhes",
        tipo: "assistente",
        timestamp: new Date(),
      };

      setMensagens((prev) => [...prev, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Limpar chat (e localStorage e histórico do Groq)
   */
  const limparChat = () => {
    const mensagemInicial: MensagemChatProps = {
      id: "boas-vindas-nova",
      conteudo: config.boasVindas,
      tipo: "assistente",
      timestamp: new Date(),
    };

    setMensagens([mensagemInicial]);

    // Limpar do localStorage também
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ Histórico limpo do localStorage");
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }

    // Limpar histórico do Groq
    if (chatIntegrado.current) {
      chatIntegrado.current.limparHistorico();
    }
  };

  // Mostrar erro se configuração inválida
  if (!pronto) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <Bot className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro de Configuração
          </h3>
          <p className="text-red-600 mb-4">{erro}</p>
          <p className="text-sm text-red-500">
            Configure VITE_GROQ_API_KEY no arquivo .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white max-h-screen">
      {/* Header unificado com status MCP e ações */}
      <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Bot className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chat IA</h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Assistente inteligente com MCP
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Status do MCP */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border shadow-sm ${
              verificandoMcp
                ? "bg-gray-50 border-gray-200"
                : mcpOnline
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {verificandoMcp ? (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">
                  Verificando...
                </span>
              </>
            ) : mcpOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  MCP Online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">
                  MCP Offline
                </span>
              </>
            )}
          </div>

          {/* Botão Limpar Chat */}
          <button
            onClick={limparChat}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 border border-gray-200 hover:border-gray-300"
            title="Limpar conversa"
          >
            <Trash2 size={16} />
            <span className="text-sm font-medium hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Área de mensagens moderna com altura fixa */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 min-h-0">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${
              mensagem.tipo === "usuario" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md xl:max-w-2xl">
              {mensagem.tipo === "assistente" && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot size={18} className="text-white" />
                </div>
              )}

              <div
                className={`px-5 py-3 rounded-2xl shadow-sm ${
                  mensagem.tipo === "usuario"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-12"
                    : "bg-white text-gray-800 border border-gray-100"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {mensagem.conteudo}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    mensagem.tipo === "usuario"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {mensagem.timestamp.toLocaleTimeString("pt-BR")}
                </div>
              </div>

              {mensagem.tipo === "usuario" && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={18} className="text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de carregamento moderno */}
        {carregando && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md xl:max-w-2xl">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white text-gray-800 border border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">Processando...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem moderno */}
      <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-white">
        <form onSubmit={enviarMensagem} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta sobre produtos ou vendas..."
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-500 bg-gray-50 focus:bg-white shadow-sm"
              disabled={carregando}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || carregando}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA ALUNOS
// ============================================================================

/**
 * ✅ INTEGRAÇÃO MCP + GROQ COMPLETA
 *
 * O chat agora está totalmente integrado com:
 * - ChatMCPIntegrado: Processa mensagens com MCP + Groq.ai
 * - Dados reais do backend via API
 * - Histórico persistente no localStorage
 * - Anti-alucinação ativo
 *
 * COMO PERSONALIZAR:
 *
 * 1. config-alunos.ts:
 *    - Trocar modelo IA (qwen/qwen3-32b, mixtral-8x7b-32768, etc)
 *    - Ajustar temperatura (0.1 = preciso, 0.9 = criativo)
 *    - Modificar prompt (personalidade, instruções)
 *
 * 2. Teste comandos:
 *    - "Liste todos os produtos"
 *    - "Qual o preço do Smartphone Galaxy Pro?"
 *    - "Mostre as vendas"
 *    - "Analise as vendas do sistema"
 *
 * RECURSOS:
 * - Histórico salvo automaticamente (navegue entre páginas sem perder)
 * - Botão "Limpar" reseta chat e localStorage
 * - Status MCP em tempo real
 * - Logs detalhados no console (F12)
 */
