/**
 * 🛡️ ERROR BOUNDARY PARA REACT
 *
 * Componente que captura erros JavaScript em qualquer lugar da árvore
 * de componentes e exibe uma interface de fallback amigável.
 */

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

// ============================================================================
// 🔧 TIPOS E INTERFACES
// ============================================================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

// ============================================================================
// 🎯 COMPONENTE ERROR BOUNDARY
// ============================================================================

/**
 * Error Boundary que captura erros de componentes React
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Gerar ID único para o erro
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para monitoramento
    console.error("🚨 Error Boundary capturou um erro:", error);
    console.error("📋 Informações do erro:", errorInfo);

    // Salvar erro no localStorage para debug
    const errorData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    try {
      localStorage.setItem(
        `error_${this.state.errorId}`,
        JSON.stringify(errorData)
      );
    } catch (e) {
      console.warn("Não foi possível salvar erro no localStorage:", e);
    }

    // Chamar callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Atualizar estado com informações do erro
    this.setState({ errorInfo });
  }

  /**
   * Tenta recuperar do erro recarregando o componente
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: "",
    });
  };

  /**
   * Recarrega a página inteira
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navega para a página inicial
   */
  handleGoHome = () => {
    window.location.href = "/";
  };

  /**
   * Copia informações do erro para a área de transferência
   */
  handleCopyError = async () => {
    if (!this.state.error) return;

    const errorText = `
Erro ID: ${this.state.errorId}
Timestamp: ${new Date().toISOString()}
Erro: ${this.state.error.name}
Mensagem: ${this.state.error.message}
Stack: ${this.state.error.stack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      alert("Informações do erro copiadas para a área de transferência!");
    } catch (e) {
      console.warn("Não foi possível copiar para área de transferência:", e);
    }
  };

  render() {
    if (this.state.hasError) {
      // Usar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface de erro padrão
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            {/* Ícone e título */}
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
              Oops! Algo deu errado
            </h1>

            <p className="text-gray-600 text-center mb-6">
              Ocorreu um erro inesperado na aplicação. Você pode tentar algumas
              das opções abaixo.
            </p>

            {/* Informações do erro (modo desenvolvimento) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  Detalhes do Erro (Desenvolvimento)
                </h3>
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  ID: {this.state.errorId}
                </p>
              </div>
            )}

            {/* Ações disponíveis */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar Página</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Ir para Início</span>
              </button>

              {/* Botão de debug (apenas desenvolvimento) */}
              {import.meta.env.DEV && (
                <button
                  onClick={this.handleCopyError}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  <span>Copiar Detalhes do Erro</span>
                </button>
              )}
            </div>

            {/* Informações de suporte */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Se o problema persistir, entre em contato com o suporte técnico.
              </p>
              {this.state.errorId && (
                <p className="text-xs text-gray-400 text-center mt-1">
                  Código do erro: {this.state.errorId}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// 🎯 ERROR BOUNDARY ESPECÍFICO PARA CHAT
// ============================================================================

/**
 * Error Boundary específico para o componente de chat
 */
export function ChatErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erro no Chat
            </h3>
            <p className="text-red-600 mb-4">
              O componente de chat encontrou um problema.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Recarregar Chat
            </button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error("🚨 Erro no componente de chat:", error);
        console.error("📋 Stack trace:", errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// ============================================================================
// 🎯 ERROR BOUNDARY PARA PÁGINAS
// ============================================================================

/**
 * Error Boundary específico para páginas
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-96 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Página Indisponível
            </h2>
            <p className="text-gray-600 mb-6">
              Esta página encontrou um problema e não pode ser exibida.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para Início
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA OS ALUNOS
// ============================================================================

/**
 * GUIA DE USO DOS ERROR BOUNDARIES PARA ALUNOS:
 *
 * 1. **Error Boundary Geral:**
 *    ```tsx
 *    <ErrorBoundary>
 *      <MeuComponente />
 *    </ErrorBoundary>
 *    ```
 *
 * 2. **Error Boundary para Chat:**
 *    ```tsx
 *    <ChatErrorBoundary>
 *      <ChatInterface />
 *    </ChatErrorBoundary>
 *    ```
 *
 * 3. **Error Boundary para Páginas:**
 *    ```tsx
 *    <PageErrorBoundary>
 *      <MinhaPage />
 *    </PageErrorBoundary>
 *    ```
 *
 * 4. **Fallback Personalizado:**
 *    ```tsx
 *    <ErrorBoundary fallback={<MeuComponenteDeErro />}>
 *      <ComponenteQuePoderFalhar />
 *    </ErrorBoundary>
 *    ```
 *
 * 5. **Callback de Erro:**
 *    ```tsx
 *    <ErrorBoundary
 *      onError={(error, errorInfo) => {
 *        // Enviar erro para serviço de monitoramento
 *        console.error('Erro capturado:', error);
 *      }}
 *    >
 *      <MeuComponente />
 *    </ErrorBoundary>
 *    ```
 */
