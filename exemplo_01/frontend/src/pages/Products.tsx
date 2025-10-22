import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { apiClient } from "../services/api";
import { Product } from "../types/api";
import toast from "react-hot-toast";
import { StatCard } from "../components/StatCard";
import { Pagination } from "../components/Pagination";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const queryClient = useQueryClient();

  // Buscar produtos
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.getProducts(),
  });

  // Buscar categorias
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

  // Mutação para criar produto
  const createProductMutation = useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt">) =>
      apiClient.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCreateForm(false);
      toast.success("Produto criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar produto");
    },
  });

  // Mutação para atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...product }: Partial<Product> & { id: number }) =>
      apiClient.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingProduct(null);
      toast.success("Produto atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });

  // Mutação para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Produto removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover produto");
    },
  });

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Obter categorias únicas
  const categories = categoriesData?.data?.categories || [];

  // Estatísticas
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <LoadingSkeleton type="stats" count={3} />
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erro ao carregar produtos
            </h3>
            <p className="text-gray-600">
              Verifique se o backend está rodando na porta 3001
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-primary-600" />
            Produtos
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie seu catálogo de produtos e estoque
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Novo Produto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Package}
          label="Total de Produtos"
          value={products.length}
          color="teal"
        />
        <StatCard
          icon={CheckCircle}
          label="Em Estoque"
          value={inStockCount}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Estoque Baixo"
          value={lowStockCount}
          color="orange"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative sm:w-64">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white transition-all"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category: any) => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.productCount})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full border border-primary-100">
                  {product.category}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm("Tem certeza que deseja remover este produto?")
                    ) {
                      deleteProductMutation.mutate(product.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                R${" "}
                {product.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div
                className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                  product.stock > 10
                    ? "text-success bg-green-50 border border-green-100"
                    : product.stock > 0
                    ? "text-orange-700 bg-orange-50 border border-orange-100"
                    : "text-danger bg-red-50 border border-red-100"
                }`}
              >
                {product.stock > 0 ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{product.stock} un.</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro produto"}
          </p>
        </div>
      )}

      {/* Paginação */}
      {filteredProducts.length > itemsPerPage && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
          />
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {(showCreateForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProduct(null);
          }}
          onSubmit={(data) => {
            if (editingProduct) {
              updateProductMutation.mutate({
                ...data,
                id: editingProduct.id,
              });
            } else {
              createProductMutation.mutate(data);
            }
          }}
          isLoading={
            createProductMutation.isPending || updateProductMutation.isPending
          }
        />
      )}
    </div>
  );
}

// Componente do formulário de produto
interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
  isLoading: boolean;
}

function ProductForm({
  product,
  onClose,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    category: product?.category || "",
    description: product?.description || "",
    stock: product?.stock || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {product ? "Editar Produto" : "Novo Produto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? "Salvando..." : product ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
