/**
 * 🎓 HOOK SIMPLES PARA ALUNOS
 *
 * Hook que usa apenas as configurações dos alunos
 */

import { useState, useEffect } from "react";
import CONFIG_ALUNOS from "./config-alunos";

// ============================================================================
// 🎯 HOOK PRINCIPAL - SUPER SIMPLES
// ============================================================================

export function useConfigAlunos() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Validar configurações
    if (CONFIG_ALUNOS.groq.token === "configure-seu-token-no-env") {
      setErro("Configure seu token Groq.ai no arquivo .env");
      setCarregando(false);
      return;
    }

    if (!CONFIG_ALUNOS.nome || !CONFIG_ALUNOS.prompt) {
      setErro("Configurações incompletas no config-alunos.ts");
      setCarregando(false);
      return;
    }

    // Tudo OK
    setErro(null);
    setCarregando(false);

    // Log para desenvolvimento
    if (import.meta.env.DEV) {
      console.log("✅ Configurações carregadas:", {
        nome: CONFIG_ALUNOS.nome,
        modelo: CONFIG_ALUNOS.groq.modelo,
        temperatura: CONFIG_ALUNOS.groq.temperatura,
        antiAlucinacao: CONFIG_ALUNOS.antiAlucinacao,
      });
    }
  }, []);

  return {
    config: CONFIG_ALUNOS,
    carregando,
    erro,
    pronto: !carregando && !erro,
  };
}

export default useConfigAlunos;
