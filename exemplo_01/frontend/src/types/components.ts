/**
 * TIPOS PARA COMPONENTES DO FRONTEND
 *
 * Definições TypeScript para componentes React e props
 */
export interface Produto {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  createdAt: string;
}

export interface Venda {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  customerName: string;
  saleDate: string;
  product?: Produto;
}

export interface RespostaApi<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Props para componentes de navegação
export interface NavItemProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}

// Props para componentes de tabela
export interface TabelaProdutosProps {
  produtos: Produto[];
  carregando?: boolean;
  onEditar?: (produto: Produto) => void;
  onDeletar?: (id: number) => void;
}

export interface TabelaVendasProps {
  vendas: Venda[];
  carregando?: boolean;
  onDetalhes?: (venda: Venda) => void;
}

// Props para componentes de formulário
export interface FormularioProdutoProps {
  produto?: Produto;
  onSalvar: (produto: Omit<Produto, "id" | "createdAt">) => void;
  onCancelar: () => void;
  carregando?: boolean;
}

export interface FormularioVendaProps {
  produtos: Produto[];
  onSalvar: (venda: Omit<Venda, "id" | "saleDate">) => void;
  onCancelar: () => void;
  carregando?: boolean;
}

// Props para componentes de estatísticas
export interface CardEstatisticaProps {
  titulo: string;
  valor: string | number;
  icone: React.ReactNode;
  cor?: "azul" | "verde" | "amarelo" | "vermelho";
  descricao?: string;
}

// Props para componentes de chat (configuração isolada)
export interface ConfiguracaoChatProps {
  // Esta interface será expandida pelos alunos
  // Mantida simples para facilitar modificações
}

export interface MensagemChatProps {
  id: string;
  conteudo: string;
  tipo: "usuario" | "assistente";
  timestamp: Date;
  carregando?: boolean;
}
