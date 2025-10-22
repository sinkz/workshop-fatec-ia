"use client";

/**
 * 📝 COMPONENTE: FORMULÁRIO DE RECEITA
 *
 * Formulário para criar ou editar receitas.
 * Usado em modal ou página dedicada.
 */

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type { Receita, ReceitaInput } from "@/types/receita";
import { textoParaIngredientes } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReceitaFormProps {
  receita?: Receita | null; // Se fornecido, modo edição. Senão, modo criação
  onSalvar: (data: ReceitaInput) => Promise<void>;
  onCancelar: () => void;
  isLoading?: boolean;
}

export default function ReceitaForm({
  receita,
  onSalvar,
  onCancelar,
  isLoading = false,
}: ReceitaFormProps) {
  // Estado do formulário
  const [formData, setFormData] = useState<ReceitaInput>({
    titulo: "",
    descricao: "",
    ingredientes: [],
    modo_preparo: "",
    tempo_preparo: undefined,
    porcoes: undefined,
    dificuldade: undefined,
    categoria: "",
    imagem_url: "",
  });

  // Ingredientes como texto (um por linha)
  const [ingredientesTexto, setIngredientesTexto] = useState("");

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (receita) {
      setFormData({
        titulo: receita.titulo,
        descricao: receita.descricao || "",
        ingredientes: receita.ingredientes,
        modo_preparo: receita.modo_preparo,
        tempo_preparo: receita.tempo_preparo,
        porcoes: receita.porcoes,
        dificuldade: receita.dificuldade,
        categoria: receita.categoria || "",
        imagem_url: receita.imagem_url || "",
      });

      // Converter array de ingredientes para texto
      setIngredientesTexto(receita.ingredientes.join("\n"));
    }
  }, [receita]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Converter ingredientes de texto para array
    const ingredientes = textoParaIngredientes(ingredientesTexto);

    if (ingredientes.length === 0) {
      alert("Por favor, adicione pelo menos um ingrediente");
      return;
    }

    await onSalvar({
      ...formData,
      ingredientes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {receita ? "✏️ Editar Receita" : "➕ Nova Receita"}
          </h2>
          <button
            onClick={onCancelar}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Título */}
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título da Receita <span className="text-red-500">*</span>
              </label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Ex: Bolo de Chocolate"
                required
                disabled={isLoading}
              />
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição (opcional)
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                rows={2}
                placeholder="Breve descrição da receita"
                disabled={isLoading}
              />
            </div>

            {/* Ingredientes */}
            <div>
              <label
                htmlFor="ingredientes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ingredientes <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ingredientes"
                value={ingredientesTexto}
                onChange={(e) => setIngredientesTexto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none font-mono text-sm"
                rows={6}
                placeholder={
                  "2 ovos\n1 xícara de açúcar\n1 xícara de farinha\n..."
                }
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Digite um ingrediente por linha
              </p>
            </div>

            {/* Modo de Preparo */}
            <div>
              <label
                htmlFor="modo_preparo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Modo de Preparo <span className="text-red-500">*</span>
              </label>
              <textarea
                id="modo_preparo"
                value={formData.modo_preparo}
                onChange={(e) =>
                  setFormData({ ...formData, modo_preparo: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                rows={6}
                placeholder="Descreva o passo a passo da receita..."
                required
                disabled={isLoading}
              />
            </div>

            {/* Grid de 3 colunas: Tempo, Porções, Dificuldade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tempo de Preparo */}
              <div>
                <label
                  htmlFor="tempo_preparo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tempo (min)
                </label>
                <input
                  id="tempo_preparo"
                  type="number"
                  min="1"
                  value={formData.tempo_preparo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tempo_preparo: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="45"
                  disabled={isLoading}
                />
              </div>

              {/* Porções */}
              <div>
                <label
                  htmlFor="porcoes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porções
                </label>
                <input
                  id="porcoes"
                  type="number"
                  min="1"
                  value={formData.porcoes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      porcoes: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="4"
                  disabled={isLoading}
                />
              </div>

              {/* Dificuldade */}
              <div>
                <label
                  htmlFor="dificuldade"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dificuldade
                </label>
                <select
                  id="dificuldade"
                  value={formData.dificuldade || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dificuldade: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  disabled={isLoading}
                >
                  <option value="">Selecione...</option>
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoria
              </label>
              <input
                id="categoria"
                type="text"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Ex: doce, salgado, bebida..."
                disabled={isLoading}
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label
                htmlFor="imagem_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL da Imagem (opcional)
              </label>
              <input
                id="imagem_url"
                type="url"
                value={formData.imagem_url}
                onChange={(e) =>
                  setFormData({ ...formData, imagem_url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>

        {/* Footer - Botões */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <Button
            type="button"
            onClick={onCancelar}
            variant="outline"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? "Salvando..."
              : receita
              ? "Atualizar"
              : "Salvar Receita"}
          </Button>
        </div>
      </div>
    </div>
  );
}
