import { useState, useEffect } from "react";
import { Save, X, Calculator } from "lucide-react";
import { FormularioVendaProps } from "../types/components";

/**
 * COMPONENTE DE FORMULÁRIO DE VENDA
 *
 * Formulário para registrar novas vendas com cálculo automático
 */
export function FormularioVenda({
  produtos,
  onSalvar,
  onCancelar,
  carregando = false,
}: FormularioVendaProps) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    customerName: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [totalCalculado, setTotalCalculado] = useState(0);

  // Atualizar produto selecionado e calcular total
  useEffect(() => {
    if (formData.productId) {
      const produto = produtos.find(
        (p) => p.id.toString() === formData.productId
      );
      setProdutoSelecionado(produto);

      if (produto && formData.quantity) {
        const quantidade = parseInt(formData.quantity);
        setTotalCalculado(produto.price * quantidade);
      } else {
        setTotalCalculado(0);
      }
    } else {
      setProdutoSelecionado(null);
      setTotalCalculado(0);
    }
  }, [formData.productId, formData.quantity, produtos]);

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.productId) {
      novosErros.productId = "Selecione um produto";
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      novosErros.quantity = "Quantidade deve ser maior que zero";
    }

    if (!formData.customerName.trim()) {
      novosErros.customerName = "Nome do cliente é obrigatório";
    }

    // Verificar estoque disponível
    if (produtoSelecionado && formData.quantity) {
      const quantidadeSolicitada = parseInt(formData.quantity);
      if (quantidadeSolicitada > produtoSelecionado.stock) {
        novosErros.quantity = `Estoque insuficiente. Disponível: ${produtoSelecionado.stock}`;
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    onSalvar({
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      customerName: formData.customerName.trim(),
      totalPrice: totalCalculado,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (erros[field]) {
      setErros((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Filtrar apenas produtos com estoque
  const produtosDisponiveis = produtos.filter((p) => p.stock > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Seleção de produto */}
      <div>
        <label
          htmlFor="productId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Produto *
        </label>
        <select
          id="productId"
          value={formData.productId}
          onChange={(e) => handleChange("productId", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.productId ? "border-red-300" : "border-gray-300"
          }`}
          disabled={carregando}
        >
          <option value="">Selecione um produto</option>
          {produtosDisponiveis.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.name} - R${" "}
              {produto.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
              (Estoque: {produto.stock})
            </option>
          ))}
        </select>
        {erros.productId && (
          <p className="text-red-600 text-sm mt-1">{erros.productId}</p>
        )}
      </div>

      {/* Informações do produto selecionado */}
      {produtoSelecionado && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">
            Produto Selecionado
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>Nome:</strong> {produtoSelecionado.name}
            </p>
            <p>
              <strong>Categoria:</strong> {produtoSelecionado.category}
            </p>
            <p>
              <strong>Preço unitário:</strong> R${" "}
              {produtoSelecionado.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p>
              <strong>Estoque disponível:</strong> {produtoSelecionado.stock}{" "}
              unidades
            </p>
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantidade *
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={produtoSelecionado?.stock || undefined}
          value={formData.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.quantity ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="1"
          disabled={carregando || !produtoSelecionado}
        />
        {erros.quantity && (
          <p className="text-red-600 text-sm mt-1">{erros.quantity}</p>
        )}
      </div>

      {/* Nome do cliente */}
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome do Cliente *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.customerName ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ex: João Silva"
          disabled={carregando}
        />
        {erros.customerName && (
          <p className="text-red-600 text-sm mt-1">{erros.customerName}</p>
        )}
      </div>

      {/* Total calculado */}
      {totalCalculado > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calculator className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-green-800">Total da Venda</p>
              <p className="text-2xl font-bold text-green-900">
                R${" "}
                {totalCalculado.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aviso se não há produtos disponíveis */}
      {produtosDisponiveis.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Não há produtos com estoque disponível para venda.
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={carregando}
        >
          <X size={16} />
          <span>Cancelar</span>
        </button>

        <button
          type="submit"
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={carregando || produtosDisponiveis.length === 0}
        >
          <Save size={16} />
          <span>{carregando ? "Registrando..." : "Registrar Venda"}</span>
        </button>
      </div>
    </form>
  );
}
