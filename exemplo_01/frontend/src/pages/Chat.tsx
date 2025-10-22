import { ChatSimples } from "../components/ChatSimples";

/**
 * PÁGINA PRINCIPAL DO CHAT - SIMPLIFICADA PARA ALUNOS
 *
 * Página que contém apenas o chat essencial
 * IMPORTANTE: Mantém config-alunos.ts intocado para facilidade educacional
 */
export function Chat() {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat com header integrado */}
      <ChatSimples />
    </div>
  );
}
