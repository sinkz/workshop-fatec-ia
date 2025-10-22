import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { FormularioProdutoProps } from "../types/components";

/**
 * COMPONENTE DE FORMULÁRIO DE PRODUTO
 *
 * Formulário para criar/editar produtos com validação
 */
export function FormularioProduto({
  produto,
  onSalvar,
  onCancelar,
  carregando = false,
}: FormularioProdutoProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (produto) {
      setFormData({
        name: produto.name,
        price: produto.price.toString(),
        category: produto.category,
        description: produto.description,
        stock: produto.stock.toString(),
      });
    }
  }, [produto]);

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.name.trim()) {
      novosErros.name = "Nome é obrigatório";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      novosErros.price = "Preço deve ser maior que zero";
    }

    if (!formData.category.trim()) {
      novosErros.category = "Categoria é obrigatória";
    }

    if (!formData.description.trim()) {
      novosErros.description = "Descrição é obrigatória";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      novosErros.stock = "Estoque deve ser maior ou igual a zero";
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
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim(),
      stock: parseInt(formData.stock),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (erros[field]) {
      setErros((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome do produto */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nome do Produto *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.name ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Ex: Smartphone Galaxy Pro"
          disabled={carregando}
        />
        {erros.name && (
          <p className="text-red-600 text-sm mt-1">{erros.name}</p>
        )}
      </div>

      {/* Preço */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Preço (R$) *
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.price ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="0,00"
          disabled={carregando}
        />
        {erros.price && (
          <p className="text-red-600 text-sm mt-1">{erros.price}</p>
        )}
      </div>

      {/* Categoria */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Categoria *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.category ? "border-red-300" : "border-gray-300"
          }`}
          disabled={carregando}
        >
          <option value="">Selecione uma categoria</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Casa e Jardim">Casa e Jardim</option>
          <option value="Esportes">Esportes</option>
          <option value="Livros">Livros</option>
          <option value="Beleza">Beleza</option>
          <option value="Automotivo">Automotivo</option>
          <option value="Outros">Outros</option>
        </select>
        {erros.category && (
          <p className="text-red-600 text-sm mt-1">{erros.category}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descrição *
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Descreva as características do produto..."
          disabled={carregando}
        />
        {erros.description && (
          <p className="text-red-600 text-sm mt-1">{erros.description}</p>
        )}
      </div>

      {/* Estoque */}
      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantidade em Estoque *
        </label>
        <input
          type="number"
          id="stock"
          min="0"
          value={formData.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            erros.stock ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="0"
          disabled={carregando}
        />
        {erros.stock && (
          <p className="text-red-600 text-sm mt-1">{erros.stock}</p>
        )}
      </div>

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
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={carregando}
        >
          <Save size={16} />
          <span>
            {carregando ? "Salvando..." : produto ? "Atualizar" : "Criar"}
          </span>
        </button>
      </div>
    </form>
  );
}
