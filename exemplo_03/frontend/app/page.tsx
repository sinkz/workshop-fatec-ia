"use client";

/**
 * 🏠 PÁGINA PRINCIPAL - HOME
 *
 * Layout split screen:
 * - Esquerda (60%): Lista de receitas com CRUD manual
 * - Direita (40%): Chat IA
 *
 * Responsivo: Em mobile, usa tabs para alternar entre lista e chat.
 */

import { useState, useEffect } from "react";
import { Plus, ChefHat, AlertCircle } from "lucide-react";
import ReceitaCard, { ReceitaCardSkeleton } from "@/components/ReceitaCard";
import ReceitaForm from "@/components/ReceitaForm";
import ReceitaDetalhes from "@/components/ReceitaDetalhes";
import ConfirmarDelecao from "@/components/ConfirmarDelecao";
import Chat from "@/components/Chat";
import type { Receita, ReceitaInput } from "@/types/receita";
import {
  listarReceitas,
  criarReceita,
  atualizarReceita,
  deletarReceita,
} from "@/app/actions/receitas";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  // Estado das receitas
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado dos modais
  const [modalForm, setModalForm] = useState<{
    open: boolean;
    receita: Receita | null;
  }>({
    open: false,
    receita: null,
  });
  const [modalDetalhes, setModalDetalhes] = useState<{
    open: boolean;
    receita: Receita | null;
  }>({
    open: false,
    receita: null,
  });
  const [modalDelecao, setModalDelecao] = useState<{
    open: boolean;
    receita: Receita | null;
  }>({
    open: false,
    receita: null,
  });

  // Estado de loading de ações
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para mobile (tab ativa)
  const [activeTab, setActiveTab] = useState<"receitas" | "chat">("receitas");

  // Carregar receitas na montagem
  useEffect(() => {
    carregarReceitas();
  }, []);

  const carregarReceitas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listarReceitas();
      setReceitas(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar receitas");
      console.error("Erro ao carregar receitas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriarNova = () => {
    setModalForm({ open: true, receita: null });
  };

  const handleEditar = (receita: Receita) => {
    setModalForm({ open: true, receita });
    setModalDetalhes({ open: false, receita: null });
  };

  const handleVer = (receita: Receita) => {
    setModalDetalhes({ open: true, receita });
  };

  const handleDeletar = (receita: Receita) => {
    setModalDelecao({ open: true, receita });
  };

  const confirmarDelecao = async () => {
    if (!modalDelecao.receita) return;

    try {
      await deletarReceita(modalDelecao.receita.id);
      setModalDelecao({ open: false, receita: null });
      await carregarReceitas();
    } catch (err: any) {
      alert(`Erro ao deletar receita: ${err.message}`);
    }
  };

  const handleSalvarForm = async (data: ReceitaInput) => {
    try {
      setIsSubmitting(true);

      if (modalForm.receita) {
        // Editar existente
        await atualizarReceita(modalForm.receita.id, data);
      } else {
        // Criar nova
        await criarReceita(data);
      }

      setModalForm({ open: false, receita: null });
      await carregarReceitas(); // Recarregar lista
    } catch (err: any) {
      alert(`Erro ao salvar receita: ${err.message}`);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSalvarReceitaDoChat = async (receita: ReceitaInput) => {
    try {
      await criarReceita(receita);
      await carregarReceitas(); // Recarregar lista para mostrar a nova receita
    } catch (err: any) {
      throw new Error(`Erro ao salvar receita: ${err.message}`);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm z-10 flex-shrink-0">
        <div className="max-w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">ReceitasIA</h1>
                <p className="text-orange-100 text-xs">
                  Sistema de Receitas com IA
                </p>
              </div>
            </div>

            <Button
              onClick={handleCriarNova}
              variant="secondary"
              size="sm"
              className="bg-white hover:bg-gray-50 text-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex">
          <button
            onClick={() => setActiveTab("receitas")}
            className={`flex-1 py-4 font-semibold transition-all duration-200 relative ${
              activeTab === "receitas"
                ? "text-orange-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            📋 Receitas ({receitas.length})
            {activeTab === "receitas" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-4 font-semibold transition-all duration-200 relative ${
              activeTab === "chat"
                ? "text-orange-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            💬 Chat IA
            {activeTab === "chat" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lado Esquerdo: Lista de Receitas */}
        <div
          className={`
            w-full lg:w-3/5 flex flex-col overflow-hidden bg-card
            ${activeTab === "receitas" ? "flex" : "hidden lg:flex"}
          `}
        >
          <div className="flex-1 overflow-y-auto">
            {/* Loading */}
            {isLoading && (
              <div className="p-8">
                <div className="mb-6">
                  <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ReceitaCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {error && !isLoading && (
              <div className="p-8">
                <Alert variant="destructive" className="max-w-2xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro ao carregar receitas</AlertTitle>
                  <AlertDescription className="mt-2 space-y-3">
                    <p>{error}</p>
                    <p className="text-sm">
                      💡 <strong>Dica:</strong> Verifique se configurou o
                      arquivo{" "}
                      <code className="bg-destructive/20 px-1.5 py-0.5 rounded text-xs">
                        .env.local
                      </code>
                    </p>
                    <Button
                      onClick={carregarReceitas}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      🔄 Tentar Novamente
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Lista Vazia */}
            {!isLoading && !error && receitas.length === 0 && (
              <div className="flex items-center justify-center min-h-full p-8">
                <div className="max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Nenhuma receita ainda
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Comece criando sua primeira receita ou peça uma sugestão
                    para a IA!
                  </p>
                  <Button onClick={handleCriarNova}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Receita
                  </Button>
                </div>
              </div>
            )}

            {/* Grid de Receitas */}
            {!isLoading && !error && receitas.length > 0 && (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Minhas Receitas
                    <span className="text-orange-600 ml-3">
                      ({receitas.length})
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Clique em uma receita para ver os detalhes completos
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {receitas.map((receita) => (
                    <ReceitaCard
                      key={receita.id}
                      receita={receita}
                      onVer={handleVer}
                      onEditar={handleEditar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Chat */}
        <div
          className={`
            w-full lg:w-2/5 flex flex-col bg-card border-l
            ${activeTab === "chat" ? "flex" : "hidden lg:flex"}
          `}
        >
          <Chat onReceitaSalvar={handleSalvarReceitaDoChat} />
        </div>
      </div>

      {/* Modais */}
      {modalForm.open && (
        <ReceitaForm
          receita={modalForm.receita}
          onSalvar={handleSalvarForm}
          onCancelar={() => setModalForm({ open: false, receita: null })}
          isLoading={isSubmitting}
        />
      )}

      {modalDetalhes.open && modalDetalhes.receita && (
        <ReceitaDetalhes
          receita={modalDetalhes.receita}
          onFechar={() => setModalDetalhes({ open: false, receita: null })}
          onEditar={handleEditar}
          onDeletar={handleDeletar}
        />
      )}

      {modalDelecao.open && modalDelecao.receita && (
        <ConfirmarDelecao
          open={modalDelecao.open}
          onOpenChange={(open) => setModalDelecao({ open, receita: null })}
          onConfirm={confirmarDelecao}
          titulo={modalDelecao.receita.titulo}
        />
      )}
    </div>
  );
}
