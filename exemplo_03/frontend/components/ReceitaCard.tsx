"use client";

import { Clock, Users, Edit, Trash2 } from "lucide-react";
import type { Receita } from "@/types/receita";
import {
  formatarTempo,
  formatarPorcoes,
  obterEmojiCategoria,
  obterCorDificuldade,
  truncate,
} from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReceitaCardProps {
  receita: Receita;
  onVer: (receita: Receita) => void;
  onEditar: (receita: Receita) => void;
  onDeletar: (receita: Receita) => void;
}

export default function ReceitaCard({
  receita,
  onVer,
  onEditar,
  onDeletar,
}: ReceitaCardProps) {
  const imagemPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    receita.titulo
  )}&size=400&background=ff6b35&color=fff&bold=true`;

  return (
    <Card
      className="cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 hover:border-gray-300"
      onClick={() => onVer(receita)}
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50">
        <img
          src={receita.imagem_url || imagemPlaceholder}
          alt={receita.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = imagemPlaceholder;
          }}
        />

        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Badge de categoria melhorado */}
        {receita.categoria && (
          <Badge className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg border border-white/50 px-3 py-1.5 rounded-full font-medium">
            <span className="mr-1.5">
              {obterEmojiCategoria(receita.categoria)}
            </span>
            {receita.categoria}
          </Badge>
        )}
      </div>

      <CardContent className="p-6 pb-4">
        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 h-7 group-hover:text-primary transition-colors">
          {receita.titulo}
        </h3>

        {/* Descrição */}
        {receita.descricao && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10 leading-relaxed">
            {truncate(receita.descricao, 100)}
          </p>
        )}

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-2.5">
          {receita.tempo_preparo && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-xs"
            >
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{formatarTempo(receita.tempo_preparo)}</span>
            </Badge>
          )}

          {receita.porcoes && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-xs"
            >
              <Users className="w-3 h-3 flex-shrink-0" />
              <span>{formatarPorcoes(receita.porcoes)}</span>
            </Badge>
          )}

          {receita.dificuldade && (
            <Badge
              className={`${obterCorDificuldade(
                receita.dificuldade
              )} px-2.5 py-1 rounded-full font-medium text-xs`}
            >
              {receita.dificuldade}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-end w-full gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(receita);
            }}
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Editar
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeletar(receita);
            }}
            variant="destructive"
            size="sm"
            className="h-9"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Deletar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ReceitaCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 animate-pulse"></div>
      <CardContent className="p-5 pb-3">
        <div className="h-6 bg-muted rounded mb-2 animate-pulse"></div>
        <div className="h-6 bg-muted rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-muted/70 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-muted/70 rounded w-2/3 mb-4 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted/70 rounded-full animate-pulse"></div>
          <div className="h-6 w-12 bg-muted/70 rounded-full animate-pulse"></div>
          <div className="h-6 w-16 bg-muted/70 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="flex-1 h-8 bg-muted rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/70 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/70 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}
