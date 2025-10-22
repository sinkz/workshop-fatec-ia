"use client";

/**
 * 👁️ COMPONENTE: DETALHES DA RECEITA
 *
 * Modal que exibe a receita completa com todos os detalhes.
 * Usado ao clicar em "Ver" no card de receita.
 */

import { X, Clock, Users, Edit, Trash2, ChefHat } from "lucide-react";
import type { Receita } from "@/types/receita";
import {
  formatarTempo,
  formatarPorcoes,
  formatarData,
  obterEmojiCategoria,
  obterCorDificuldade,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReceitaDetalhesProps {
  receita: Receita;
  onFechar: () => void;
  onEditar: (receita: Receita) => void;
  onDeletar: (receita: Receita) => void;
}

export default function ReceitaDetalhes({
  receita,
  onFechar,
  onEditar,
  onDeletar,
}: ReceitaDetalhesProps) {
  const imagemPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    receita.titulo
  )}&size=800&background=ff6b35&color=fff&bold=true`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com imagem de fundo */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={receita.imagem_url || imagemPlaceholder}
            alt={receita.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = imagemPlaceholder;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Botão fechar */}
          <button
            onClick={onFechar}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Título e metadados sobre a imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-3">{receita.titulo}</h1>

            <div className="flex flex-wrap items-center gap-4">
              {receita.tempo_preparo && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatarTempo(receita.tempo_preparo)}
                  </span>
                </div>
              )}

              {receita.porcoes && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatarPorcoes(receita.porcoes)}
                  </span>
                </div>
              )}

              {receita.dificuldade && (
                <Badge
                  className={`${obterCorDificuldade(
                    receita.dificuldade
                  )} bg-white/95 text-gray-900 border border-white/70 px-3 py-1.5 rounded-full font-medium shadow-sm`}
                >
                  {receita.dificuldade}
                </Badge>
              )}

              {receita.categoria && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                  <span>{obterEmojiCategoria(receita.categoria)}</span>
                  <span className="capitalize">{receita.categoria}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body - Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda: Descrição e Ingredientes */}
            <div className="space-y-6">
              {/* Descrição */}
              {receita.descricao && (
                <div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {receita.descricao}
                  </p>
                </div>
              )}

              {/* Ingredientes */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  Ingredientes
                </h3>
                <div className="bg-orange-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {receita.ingredientes.map((ingrediente, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-orange-500 font-bold mt-1">
                          •
                        </span>
                        <span>{ingrediente}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Modo de Preparo */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📝 Modo de Preparo
              </h3>
              <div className="prose prose-orange max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {receita.modo_preparo}
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé com data de criação */}
          {receita.created_at && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Criada em {formatarData(receita.created_at)}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Botões de ação */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button onClick={onFechar} variant="outline">
              Fechar
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (
                    confirm(
                      `Tem certeza que deseja deletar "${receita.titulo}"?`
                    )
                  ) {
                    onDeletar(receita);
                    onFechar();
                  }
                }}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>

              <Button onClick={() => onEditar(receita)} variant="default">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
