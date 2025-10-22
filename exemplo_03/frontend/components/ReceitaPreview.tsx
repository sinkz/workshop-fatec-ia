"use client";

import { useState } from "react";
import {
  Save,
  Eye,
  Clock,
  Users,
  ChefHat,
  Loader,
  Info,
  X,
} from "lucide-react";
import type { ReceitaInput } from "@/types/receita";
import {
  formatarTempo,
  formatarPorcoes,
  obterEmojiCategoria,
  obterCorDificuldade,
} from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReceitaPreviewProps {
  receita: ReceitaInput;
  onSalvar: (receita: ReceitaInput) => void;
  onApenaVer: () => void;
  isSaving?: boolean;
}

export default function ReceitaPreview({
  receita,
  onSalvar,
  onApenaVer,
  isSaving = false,
}: ReceitaPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg">
        <CardContent className="p-5 pb-4">
          {/* Badge IA */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 px-3 py-1">
              🤖 SUGESTÃO DA IA
            </Badge>
            {receita.categoria && (
              <Badge variant="secondary" className="gap-1">
                {obterEmojiCategoria(receita.categoria)}
                {receita.categoria}
              </Badge>
            )}
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {receita.titulo}
          </h3>

          {/* Descrição */}
          {receita.descricao && (
            <p className="text-sm text-muted-foreground mb-4">
              {receita.descricao}
            </p>
          )}

          {/* Metadados */}
          <div className="flex flex-wrap gap-2 mb-4">
            {receita.tempo_preparo && (
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {formatarTempo(receita.tempo_preparo)}
              </Badge>
            )}

            {receita.porcoes && (
              <Badge variant="outline" className="gap-1">
                <Users className="w-3 h-3" />
                {formatarPorcoes(receita.porcoes)}
              </Badge>
            )}

            {receita.dificuldade && (
              <Badge className={obterCorDificuldade(receita.dificuldade)}>
                {receita.dificuldade}
              </Badge>
            )}
          </div>

          {/* Ingredientes Preview */}
          <div className="bg-white rounded-lg p-3 mb-4">
            <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-orange-500" />
              Ingredientes ({receita.ingredientes.length})
            </h4>
            <div className="max-h-24 overflow-y-auto">
              <ul className="space-y-1">
                {receita.ingredientes.slice(0, 5).map((ing, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1.5 text-xs text-gray-700"
                  >
                    <span className="text-orange-500">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
                {receita.ingredientes.length > 5 && (
                  <li className="text-xs text-muted-foreground italic pl-3.5">
                    + {receita.ingredientes.length - 5} mais...
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Modo de Preparo Preview */}
          <div className="bg-white rounded-lg p-3">
            <h4 className="text-xs font-bold text-gray-900 mb-2">
              📝 Modo de Preparo
            </h4>
            <p className="text-xs text-gray-700 line-clamp-3 whitespace-pre-line">
              {receita.modo_preparo}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-5 pt-0">
          {/* Botões de Ação Principais */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onSalvar(receita)}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isSaving ? (
                <>
                  <Loader className="w-3 h-3 mr-1.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1.5" />
                  Salvar
                </>
              )}
            </Button>

            <Button
              onClick={onApenaVer}
              disabled={isSaving}
              variant="outline"
              size="sm"
            >
              <Eye className="w-3 h-3 mr-1.5" />
              Apenas Ver
            </Button>
          </div>

          {/* Botão Visualizar Receita Completa */}
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="w-full border-orange-300 hover:bg-orange-50 text-orange-700"
            size="sm"
          >
            <Info className="w-3 h-3 mr-1.5" />
            📖 Ver Receita Completa
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">
            💡 Esta receita foi gerada pela IA
          </p>
        </CardFooter>
      </Card>

      {/* Modal de Detalhes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop escuro */}
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-200">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {receita.titulo}{" "}
                  {obterEmojiCategoria(receita.categoria || "")}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ReceitaDetalhesSimplificado receita={receita} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente simplificado para mostrar detalhes da receita dentro do Dialog
 */
function ReceitaDetalhesSimplificado({ receita }: { receita: ReceitaInput }) {
  return (
    <div className="space-y-6 bg-white">
      {/* Metadados */}
      <div className="flex flex-wrap gap-2">
        {receita.tempo_preparo && (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {formatarTempo(receita.tempo_preparo)}
          </Badge>
        )}
        {receita.porcoes && (
          <Badge variant="outline" className="gap-1">
            <Users className="w-3 h-3" />
            {formatarPorcoes(receita.porcoes)}
          </Badge>
        )}
        {receita.dificuldade && (
          <Badge className={obterCorDificuldade(receita.dificuldade)}>
            {receita.dificuldade}
          </Badge>
        )}
        {receita.categoria && (
          <Badge variant="secondary" className="gap-1">
            {obterEmojiCategoria(receita.categoria)}
            {receita.categoria}
          </Badge>
        )}
      </div>

      {/* Descrição */}
      {receita.descricao && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Descrição</h3>
          <p className="text-gray-600 leading-relaxed">{receita.descricao}</p>
        </div>
      )}

      {/* Grid de Ingredientes e Modo de Preparo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredientes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-orange-500" />
            Ingredientes
          </h3>
          <div className="bg-orange-50 rounded-lg p-4">
            <ul className="space-y-2">
              {receita.ingredientes.map((ingrediente, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-500 font-bold mt-1">•</span>
                  <span>{ingrediente}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modo de Preparo */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📝 Modo de Preparo</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {receita.modo_preparo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
