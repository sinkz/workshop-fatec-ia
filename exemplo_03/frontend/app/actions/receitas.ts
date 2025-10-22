"use server";

/**
 * 🎯 SERVER ACTIONS - CRUD DE RECEITAS
 *
 * Este arquivo contém todas as operações de banco de dados
 * que o frontend pode executar via Server Actions do Next.js 15.
 *
 * Conexão direta com Neon Database usando @neondatabase/serverless
 */

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import type { Receita, ReceitaInput, ReceitaUpdate } from "@/types/receita";

// Inicializar conexão com Neon com configurações de timeout
const sql = neon(process.env.NEON_DATABASE_URL!, {
  fetchOptions: {
    cache: "no-store",
  },
});

// Função para retry em caso de falha de conexão
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.log(`Tentativa ${attempt}/${maxRetries} falhou:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Aguardar antes da próxima tentativa
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error("Todas as tentativas falharam");
}

/**
 * 📋 LISTAR TODAS AS RECEITAS
 *
 * Retorna todas as receitas ordenadas da mais recente para a mais antiga.
 *
 * @returns Promise<Receita[]> - Array de receitas
 */
export async function listarReceitas(): Promise<Receita[]> {
  return executeWithRetry(async () => {
    const rows = await sql`
      SELECT * FROM recipes
      ORDER BY created_at DESC
    `;

    return rows as Receita[];
  });
}

/**
 * 📄 OBTER UMA RECEITA POR ID
 *
 * @param id - ID da receita
 * @returns Promise<Receita | null> - Receita encontrada ou null
 */
export async function obterReceita(id: number): Promise<Receita | null> {
  return executeWithRetry(async () => {
    const [receita] = await sql`
      SELECT * FROM recipes
      WHERE id = ${id}
    `;

    return (receita as Receita) || null;
  });
}

/**
 * ➕ CRIAR NOVA RECEITA
 *
 * @param data - Dados da receita (sem id, created_at, updated_at)
 * @returns Promise<Receita> - Receita criada com id gerado
 */
export async function criarReceita(data: ReceitaInput): Promise<Receita> {
  return executeWithRetry(async () => {
    // Validação básica
    if (
      !data.titulo ||
      !data.ingredientes ||
      data.ingredientes.length === 0 ||
      !data.modo_preparo
    ) {
      throw new Error(
        "Título, ingredientes e modo de preparo são obrigatórios"
      );
    }

    const [receita] = await sql`
      INSERT INTO recipes (
        titulo,
        descricao,
        ingredientes,
        modo_preparo,
        tempo_preparo,
        porcoes,
        dificuldade,
        categoria,
        imagem_url
      ) VALUES (
        ${data.titulo},
        ${data.descricao || null},
        ${data.ingredientes},
        ${data.modo_preparo},
        ${data.tempo_preparo || null},
        ${data.porcoes || null},
        ${data.dificuldade || null},
        ${data.categoria || null},
        ${data.imagem_url || null}
      )
      RETURNING *
    `;

    // Revalidar a página principal para mostrar a nova receita
    revalidatePath("/");

    return receita as Receita;
  });
}

/**
 * ✏️ ATUALIZAR RECEITA EXISTENTE
 *
 * Atualiza apenas os campos fornecidos (atualização parcial).
 *
 * @param id - ID da receita a atualizar
 * @param data - Campos a atualizar (parcial)
 * @returns Promise<Receita> - Receita atualizada
 */
export async function atualizarReceita(
  id: number,
  data: ReceitaUpdate
): Promise<Receita> {
  return executeWithRetry(async () => {
    // Construir SET dinâmico apenas com campos fornecidos
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.titulo !== undefined) {
      updates.push(`titulo = $${paramIndex++}`);
      values.push(data.titulo);
    }
    if (data.descricao !== undefined) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(data.descricao);
    }
    if (data.ingredientes !== undefined) {
      updates.push(`ingredientes = $${paramIndex++}`);
      values.push(data.ingredientes);
    }
    if (data.modo_preparo !== undefined) {
      updates.push(`modo_preparo = $${paramIndex++}`);
      values.push(data.modo_preparo);
    }
    if (data.tempo_preparo !== undefined) {
      updates.push(`tempo_preparo = $${paramIndex++}`);
      values.push(data.tempo_preparo);
    }
    if (data.porcoes !== undefined) {
      updates.push(`porcoes = $${paramIndex++}`);
      values.push(data.porcoes);
    }
    if (data.dificuldade !== undefined) {
      updates.push(`dificuldade = $${paramIndex++}`);
      values.push(data.dificuldade);
    }
    if (data.categoria !== undefined) {
      updates.push(`categoria = $${paramIndex++}`);
      values.push(data.categoria);
    }
    if (data.imagem_url !== undefined) {
      updates.push(`imagem_url = $${paramIndex++}`);
      values.push(data.imagem_url);
    }

    // Sempre atualizar updated_at
    updates.push("updated_at = NOW()");

    if (updates.length === 1) {
      // Só updated_at
      throw new Error("Nenhum campo para atualizar");
    }

    // Adicionar ID ao final
    values.push(id);

    const query = `
      UPDATE recipes
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, values);
    const [receita] = result;

    if (!receita) {
      throw new Error(`Receita com ID ${id} não encontrada`);
    }

    // Revalidar a página principal
    revalidatePath("/");

    return receita as Receita;
  });
}

/**
 * 🗑️ DELETAR RECEITA
 *
 * Remove permanentemente uma receita do banco de dados.
 *
 * @param id - ID da receita a deletar
 * @returns Promise<void>
 */
export async function deletarReceita(id: number): Promise<void> {
  return executeWithRetry(async () => {
    const result = await sql`
      DELETE FROM recipes
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      throw new Error(`Receita com ID ${id} não encontrada`);
    }

    // Revalidar a página principal
    revalidatePath("/");
  });
}

/**
 * 🔍 BUSCAR RECEITAS POR CATEGORIA
 *
 * @param categoria - Categoria para filtrar
 * @returns Promise<Receita[]> - Receitas da categoria
 */
export async function buscarPorCategoria(
  categoria: string
): Promise<Receita[]> {
  return executeWithRetry(async () => {
    const rows = await sql`
      SELECT * FROM recipes
      WHERE categoria ILIKE ${categoria}
      ORDER BY created_at DESC
    `;

    return rows as Receita[];
  });
}

/**
 * 🔍 BUSCAR RECEITAS POR DIFICULDADE
 *
 * @param dificuldade - 'facil', 'medio' ou 'dificil'
 * @returns Promise<Receita[]> - Receitas da dificuldade especificada
 */
export async function buscarPorDificuldade(
  dificuldade: string
): Promise<Receita[]> {
  return executeWithRetry(async () => {
    const rows = await sql`
      SELECT * FROM recipes
      WHERE dificuldade = ${dificuldade}
      ORDER BY created_at DESC
    `;

    return rows as Receita[];
  });
}

/**
 * 🔍 BUSCAR RECEITAS POR TERMO
 *
 * Busca no título e descrição.
 *
 * @param termo - Termo de busca
 * @returns Promise<Receita[]> - Receitas que correspondem ao termo
 */
export async function buscarReceitas(termo: string): Promise<Receita[]> {
  return executeWithRetry(async () => {
    const rows = await sql`
      SELECT * FROM recipes
      WHERE
        titulo ILIKE ${`%${termo}%`} OR
        descricao ILIKE ${`%${termo}%`}
      ORDER BY created_at DESC
    `;

    return rows as Receita[];
  });
}
