"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader } from "lucide-react";
import { enviarMensagemGroq, type ChatResponse } from "@/lib/groq-client";
import ReceitaPreview from "./ReceitaPreview";
import type { ChatMessage, ReceitaInput } from "@/types/receita";
import { gerarId } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatProps {
  onReceitaSalvar: (receita: ReceitaInput) => Promise<void>;
}

export default function Chat({ onReceitaSalvar }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingReceita, setIsSavingReceita] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: gerarId(),
          role: "assistant",
          content:
            "👋 Olá! Sou o ReceitasIA, seu assistente de receitas!\n\n" +
            "🍰 Posso te ajudar a:\n" +
            "• Buscar receitas no banco de dados\n" +
            "• Sugerir novas receitas criativas\n" +
            "• Dar dicas de cozinha\n\n" +
            "Como posso te ajudar hoje?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: gerarId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response: ChatResponse = await enviarMensagemGroq(
        userMessage.content,
        history
      );

      const assistantMessage: ChatMessage = {
        id: gerarId(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        receitaSugerida: response.receitaSugerida,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: gerarId(),
        role: "assistant",
        content:
          `❌ Desculpe, ocorreu um erro:\n\n${error.message}\n\n` +
          "Por favor, verifique:\n" +
          "• O token do Groq está configurado (config/app.config.ts)\n" +
          "• O backend está rodando (porta 3001)",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSalvarReceita = async (receita: ReceitaInput) => {
    setIsSavingReceita(true);

    try {
      await onReceitaSalvar(receita);

      const successMessage: ChatMessage = {
        id: gerarId(),
        role: "assistant",
        content:
          `✅ Receita "${receita.titulo}" salva com sucesso!\n\n` +
          "Você pode ver ela na lista de receitas ao lado. 🎉",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, successMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: gerarId(),
        role: "assistant",
        content: `❌ Erro ao salvar receita: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSavingReceita(false);
    }
  };

  const handleApenaVer = () => {
    const message: ChatMessage = {
      id: gerarId(),
      role: "assistant",
      content: "Ok! A receita não foi salva. Posso te sugerir outra? 😊",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border-2 border-white/50">
            <AvatarFallback className="bg-white text-orange-600">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-base font-semibold">Chat IA</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              <p className="text-xs text-orange-50">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens com altura calculada */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-5 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex flex-col max-w-[75%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  {message.receitaSugerida && (
                    <div className="mt-3 w-full">
                      <ReceitaPreview
                        receita={message.receitaSugerida}
                        onSalvar={handleSalvarReceita}
                        onApenaVer={handleApenaVer}
                        isSaving={isSavingReceita}
                      />
                    </div>
                  )}

                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted px-4 py-2.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Pensando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center mt-2.5">
          💡 Experimente: "Me sugira uma receita" ou "Quais receitas tenho?"
        </p>
      </div>
    </div>
  );
}
