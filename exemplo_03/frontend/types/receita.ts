/**
 * 📝 TIPOS TYPESCRIPT - RECEITAS
 *
 * Define as interfaces e tipos usados no sistema de receitas.
 * Corresponde exatamente ao schema da tabela 'recipes' no Neon Database.
 */

/**
 * Interface principal que representa uma receita completa
 * (incluindo campos gerados pelo banco de dados)
 */
export interface Receita {
  /** ID único da receita (gerado automaticamente pelo banco) */
  id: number;

  /** Título/nome da receita (obrigatório) */
  titulo: string;

  /** Descrição curta da receita (opcional) */
  descricao?: string;

  /** Lista de ingredientes (array de strings, obrigatório) */
  ingredientes: string[];

  /** Instruções de preparo (obrigatório) */
  modo_preparo: string;

  /** Tempo de preparo em minutos (opcional) */
  tempo_preparo?: number;

  /** Número de porções que a receita rende (opcional) */
  porcoes?: number;

  /** Nível de dificuldade (opcional) */
  dificuldade?: "facil" | "medio" | "dificil";

  /** Categoria da receita (opcional) */
  categoria?: string;

  /** URL da imagem da receita (opcional) */
  imagem_url?: string;

  /** Data de criação (gerado automaticamente) */
  created_at?: string;

  /** Data da última atualização (gerado automaticamente) */
  updated_at?: string;
}

/**
 * Tipo usado para criar ou atualizar receitas
 * (exclui campos gerados automaticamente pelo banco)
 */
export type ReceitaInput = Omit<Receita, "id" | "created_at" | "updated_at">;

/**
 * Tipo para atualização parcial de receitas
 * (todos os campos são opcionais)
 */
export type ReceitaUpdate = Partial<ReceitaInput>;

/**
 * Tipo para o badge de dificuldade
 */
export type Dificuldade = "facil" | "medio" | "dificil";

/**
 * Enum de categorias comuns (pode ser estendido)
 */
export const CategoriasReceita = {
  DOCE: "doce",
  SALGADO: "salgado",
  BEBIDA: "bebida",
  SOBREMESA: "sobremesa",
  ENTRADA: "entrada",
  PRATO_PRINCIPAL: "prato_principal",
  LANCHE: "lanche",
  OUTRO: "outro",
} as const;

export type CategoriaReceita =
  (typeof CategoriasReceita)[keyof typeof CategoriasReceita];

/**
 * Interface para mensagens do chat
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  receitaSugerida?: ReceitaInput; // Receita sugerida pela IA (se houver)
}

/**
 * Interface para o estado de loading
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Interface para erro
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
}
