import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { Venda, Produto } from "../types/components";
import { TabelaVendas } from "../components/TabelaVendas";
import { FormularioVenda } from "../components/FormularioVenda";
import { api } from "../services/api-simple";
import { StatCard } from "../components/StatCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

/**
 * PÁGINA DE VENDAS
 *
 * Funcionalidades:
 * - Listar vendas com filtros por data
 * - Registrar novas vendas
 * - Visualizar analytics e gráficos
 * - Relatórios de performance
 */
export function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [vendas, produtos, analytics] = await Promise.all([
        api.listarVendas(),
        api.listarProdutos(),
        api.obterAnalyticsVendas(),
      ]);

      setVendas(vendas);
      setProdutos(produtos);
      setAnalytics(analytics);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      // TODO: Adicionar toast de erro
    } finally {
      setCarregando(false);
    }
  };

  const handleNovaVenda = async (
    dadosVenda: Omit<Venda, "id" | "saleDate">
  ) => {
    try {
      const novaVenda = await api.criarVenda(dadosVenda);

      if (novaVenda) {
        await carregarDados();
        setMostrarFormulario(false);
        // TODO: Adicionar toast de sucesso
      }
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      // TODO: Adicionar toast de erro
    }
  };

  const handleDetalhesVenda = (venda: Venda) => {
    // TODO: Implementar modal de detalhes
    console.log("Detalhes da venda:", venda);
  };

  // Calcular estatísticas
  const totalVendas = vendas.length;
  const receitaTotal = vendas.reduce((sum, venda) => sum + venda.totalPrice, 0);
  const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;
  const vendasHoje = vendas.filter((venda) => {
    const hoje = new Date().toDateString();
    const dataVenda = new Date(venda.saleDate).toDateString();
    return hoje === dataVenda;
  }).length;

  if (carregando) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <LoadingSkeleton type="stats" count={4} />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-primary-600" />
            Vendas
          </h1>
          <p className="text-gray-600 mt-2">Controle de vendas e relatórios</p>
        </div>

        <button
          onClick={() => setMostrarFormulario(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nova Venda</span>
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total de Vendas"
          value={totalVendas}
          color="teal"
        />
        <StatCard
          icon={DollarSign}
          label="Receita Total"
          value={`R$ ${receitaTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Ticket Médio"
          value={`R$ ${ticketMedio.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label="Vendas Hoje"
          value={vendasHoje}
          color="orange"
        />
      </div>

      {/* Gráficos e Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas por categoria */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Vendas por Categoria</h3>
            <div className="space-y-3">
              {Object.entries(analytics.salesByCategory || {}).map(
                ([categoria, dados]: [string, any]) => (
                  <div
                    key={categoria}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{categoria}</span>
                    <div className="text-right">
                      <div className="font-semibold">{dados.count} vendas</div>
                      <div className="text-sm text-gray-500">
                        R${" "}
                        {dados.revenue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Top produtos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Produtos Mais Vendidos
            </h3>
            <div className="space-y-3">
              {analytics.topProducts
                ?.slice(0, 5)
                .map((item: any, index: number) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.totalQuantity} unidades vendidas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        R${" "}
                        {item.totalRevenue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de vendas */}
      <TabelaVendas
        vendas={vendas}
        carregando={carregando}
        onDetalhes={handleDetalhesVenda}
      />

      {/* Modal do formulário */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Nova Venda</h2>

            <FormularioVenda
              produtos={produtos}
              onSalvar={handleNovaVenda}
              onCancelar={() => setMostrarFormulario(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
