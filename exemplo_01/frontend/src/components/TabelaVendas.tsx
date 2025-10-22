import { Eye, TrendingUp } from "lucide-react";
import { TabelaVendasProps } from "../types/components";

/**
 * COMPONENTE DE TABELA DE VENDAS
 *
 * Exibe lista de vendas em formato de tabela com informações detalhadas
 */
export function TabelaVendas({
  vendas,
  carregando = false,
  onDetalhes,
}: TabelaVendasProps) {
  if (carregando) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (vendas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma venda encontrada
        </h3>
        <p className="text-gray-500">
          Registre vendas no sistema ou ajuste os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Histórico de Vendas ({vendas.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{venda.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {venda.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {venda.product?.name || `Produto ID: ${venda.productId}`}
                  </div>
                  {venda.product && (
                    <div className="text-sm text-gray-500">
                      {venda.product.category}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venda.quantity} unidades
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    R${" "}
                    {venda.totalPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(venda.saleDate).toLocaleDateString("pt-BR")}
                  <div className="text-xs text-gray-400">
                    {new Date(venda.saleDate).toLocaleTimeString("pt-BR")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onDetalhes && (
                    <button
                      onClick={() => onDetalhes(venda)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
