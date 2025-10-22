/**
 * 🎭 CARREGADOR DE PERSONALIDADES
 *
 * Sistema modular para gerenciar personalidades da IA
 *
 * COMO ADICIONAR UMA NOVA PERSONALIDADE:
 *
 * 1. Crie um arquivo na pasta personalidades/ (ex: genio.js)
 * 2. Use o template abaixo:
 *
 * export default {
 *   id: "genio",
 *   nome: "Gênio",
 *   descricao: "Assistente que fala como um gênio da lâmpada",
 *   prompt: "Seu prompt do sistema aqui...",
 *   boasVindas: "Sua mensagem de boas-vindas aqui..."
 * };
 *
 * 3. Importe o arquivo aqui embaixo
 * 4. Adicione ao array PERSONALIDADES_DISPONIVEIS
 * 5. Pronto! A personalidade estará disponível no config.js
 */

// ========== IMPORTAR PERSONALIDADES ==========
import profissional from "./profissional.js";
/*import sarcastico from "./sarcastico.js";
import animado from "./animado.js";
import poeta from "./poeta.js";*/
import minimalista from "./minimalista.js";

// ========== REGISTRO DE PERSONALIDADES ==========
/**
 * 📚 LISTA DE TODAS AS PERSONALIDADES DISPONÍVEIS
 *
 * Para adicionar uma nova personalidade:
 * 1. Crie o arquivo na pasta personalidades/
 * 2. Importe acima
 * 3. Adicione ao array abaixo
 */
const PERSONALIDADES_DISPONIVEIS = [profissional, minimalista];

// ========== MAP PARA ACESSO RÁPIDO ==========
/**
 * 🗺️ MAP DE PERSONALIDADES POR ID
 *
 * Permite acesso rápido: PERSONALIDADES.get("animado")
 */
export const PERSONALIDADES = new Map(
  PERSONALIDADES_DISPONIVEIS.map((p) => [p.id, p])
);

// ========== VALIDAÇÃO ==========
/**
 * ✅ VALIDAR SE UMA PERSONALIDADE EXISTE
 *
 * @param {string} id - ID da personalidade
 * @returns {boolean} - True se existe
 */
export function personalidadeExiste(id) {
  return PERSONALIDADES.has(id);
}

/**
 * 🎭 OBTER PERSONALIDADE POR ID
 *
 * @param {string} id - ID da personalidade
 * @returns {Object|null} - Objeto da personalidade ou null
 */
export function obterPersonalidade(id) {
  return PERSONALIDADES.get(id) || null;
}

/**
 * 📋 LISTAR TODAS AS PERSONALIDADES
 *
 * @returns {Array} - Array com todas as personalidades
 */
export function listarPersonalidades() {
  return PERSONALIDADES_DISPONIVEIS;
}

// ========== EXPORTAR DEFAULT ==========
export default PERSONALIDADES;
