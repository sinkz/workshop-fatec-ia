import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingCart,
  Award,
} from "lucide-react";
import { apiClient } from "../services/api";
import { StatCard } from "../components/StatCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

interface AnalyticsData {
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockCount: number;
  };
  salesByCategory: Record<string, { count: number; revenue: number }>;
  topProducts: Array<{
    product: {
      id: number;
      name: string;
      category: string;
      price: number;
    };
    totalQuantity: number;
    totalRevenue: number;
  }>;
  recentSales: number;
  lowStockProducts: Array<{
    id: number;
    name: string;
    stock: number;
    category: string;
  }>;
}

export function Analytics() {
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery<{ data: AnalyticsData }>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/analytics/sales");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <LoadingSkeleton type="stats" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar analytics
          </h3>
          <p className="text-gray-600">
            Verifique se o backend está rodando na porta 3001
          </p>
        </div>
      </div>
    );
  }

  const { summary, salesByCategory, topProducts, lowStockProducts } =
    analyticsData.data;

  // Converter salesByCategory para array ordenado
  const categoriesArray = Object.entries(salesByCategory)
    .map(([category, data]) => ({
      category,
      ...data,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
          Analytics
        </h1>
        <p className="text-gray-600 mt-2">Relatórios e métricas do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total de Vendas"
          value={summary.totalSales}
          color="teal"
        />
        <StatCard
          icon={DollarSign}
          label="Receita Total"
          value={`R$ ${summary.totalRevenue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Ticket Médio"
          value={`R$ ${summary.averageOrderValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          color="blue"
        />
        <StatCard
          icon={Package}
          label="Total Produtos"
          value={summary.totalProducts}
          color="orange"
        />
      </div>

      {/* Vendas por Categoria e Top Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Categoria */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
            Vendas por Categoria
          </h3>
          <div className="space-y-4">
            {categoriesArray.map((cat, index) => {
              const maxRevenue = categoriesArray[0].revenue;
              const percentage = (cat.revenue / maxRevenue) * 100;

              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {cat.category}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        R${" "}
                        {cat.revenue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cat.count} vendas
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? "bg-primary-600"
                          : index === 1
                          ? "bg-primary-400"
                          : "bg-primary-200"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Produtos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary-600" />
            Top 5 Produtos Mais Vendidos
          </h3>
          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-600"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {item.product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.product.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {item.totalQuantity} un.
                  </div>
                  <div className="text-sm text-gray-500">
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

      {/* Produtos com Estoque Baixo */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Produtos com Estoque Baixo ({lowStockProducts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.category}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product.stock <= 5
                      ? "bg-red-100 text-red-700"
                      : product.stock <= 10
                      ? "bg-orange-100 text-orange-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.stock} un.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl border border-primary-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Produtos em Estoque Baixo
          </h4>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {summary.lowStockCount}
          </div>
          <p className="text-sm text-gray-600">
            Produtos com menos de 20 unidades em estoque
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Categorias Ativas
          </h4>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {categoriesArray.length}
          </div>
          <p className="text-sm text-gray-600">
            Categorias com vendas registradas
          </p>
        </div>
      </div>
    </div>
  );
}
