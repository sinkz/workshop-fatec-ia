/**
 * 🍞 SISTEMA DE NOTIFICAÇÕES TOAST
 *
 * Sistema completo de notificações toast para feedback do usuário,
 * incluindo diferentes tipos, posicionamento e animações.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

// ============================================================================
// 🔧 TIPOS E INTERFACES
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (
    title: string,
    message?: string,
    options?: Partial<Toast>
  ) => string;
  error: (title: string, message?: string, options?: Partial<Toast>) => string;
  warning: (
    title: string,
    message?: string,
    options?: Partial<Toast>
  ) => string;
  info: (title: string, message?: string, options?: Partial<Toast>) => string;
}

// ============================================================================
// 🎯 CONTEXTO DE TOAST
// ============================================================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
}

// ============================================================================
// 🎨 COMPONENTE DE TOAST INDIVIDUAL
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  position: ToastPosition;
}

function ToastItem({ toast, onRemove, position }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-remoção
  useEffect(() => {
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => handleRemove(), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast.duration, toast.persistent]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  // Configurações visuais por tipo
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      messageColor: "text-green-700",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      messageColor: "text-red-700",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      messageColor: "text-yellow-700",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      messageColor: "text-blue-700",
    },
  };

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  // Classes de animação baseadas na posição
  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-300 ease-in-out";

    if (isRemoving) {
      return `${baseClasses} opacity-0 scale-95 translate-y-2`;
    }

    if (!isVisible) {
      if (position.includes("right")) {
        return `${baseClasses} opacity-0 translate-x-full`;
      }
      if (position.includes("left")) {
        return `${baseClasses} opacity-0 -translate-x-full`;
      }
      if (position.includes("top")) {
        return `${baseClasses} opacity-0 -translate-y-full`;
      }
      return `${baseClasses} opacity-0 translate-y-full`;
    }

    return `${baseClasses} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div
      className={`
        ${config.bgColor} ${
        config.borderColor
      } border rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full
        ${getAnimationClasses()}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Ícone */}
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${config.titleColor}`}>
            {toast.title}
          </h4>

          {toast.message && (
            <p className={`text-sm ${config.messageColor} mt-1`}>
              {toast.message}
            </p>
          )}

          {/* Ação personalizada */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`text-sm font-medium ${config.iconColor} hover:underline mt-2 block`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Botão de fechar */}
        <button
          onClick={handleRemove}
          className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 🎯 CONTAINER DE TOASTS
// ============================================================================

interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

function ToastContainer({
  position = "top-right",
  maxToasts = 5,
}: ToastContainerProps) {
  const { toasts, removeToast } = useToast();

  // Limitar número de toasts visíveis
  const visibleToasts = toasts.slice(-maxToasts);

  // Classes de posicionamento
  const getPositionClasses = () => {
    const baseClasses = "fixed z-50 pointer-events-none";

    switch (position) {
      case "top-right":
        return `${baseClasses} top-4 right-4`;
      case "top-left":
        return `${baseClasses} top-4 left-4`;
      case "bottom-right":
        return `${baseClasses} bottom-4 right-4`;
      case "bottom-left":
        return `${baseClasses} bottom-4 left-4`;
      case "top-center":
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case "bottom-center":
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div className={getPositionClasses()}>
      <div className="pointer-events-auto">
        {visibleToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            position={position}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 🎯 PROVIDER DE TOAST
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position,
  maxToasts,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({ ...options, type: "success", title, message });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        ...options,
        type: "error",
        title,
        message,
        persistent: true,
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({ ...options, type: "warning", title, message });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({ ...options, type: "info", title, message });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} maxToasts={maxToasts} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// 🛠️ HOOKS DE CONVENIÊNCIA
// ============================================================================

/**
 * Hook para notificações de API
 */
export function useApiToast() {
  const toast = useToast();

  return {
    success: (message: string) => toast.success("Sucesso", message),
    error: (message: string) => toast.error("Erro", message),
    loading: (message: string) =>
      toast.info("Carregando", message, { persistent: true }),
    networkError: () =>
      toast.error(
        "Erro de Conexão",
        "Verifique sua conexão com a internet e tente novamente."
      ),
    serverError: () =>
      toast.error(
        "Erro do Servidor",
        "Ocorreu um problema no servidor. Tente novamente em alguns minutos."
      ),
  };
}

/**
 * Hook para notificações de MCP
 */
export function useMcpToast() {
  const toast = useToast();

  return {
    connected: () =>
      toast.success("MCP Conectado", "Servidor MCP conectado com sucesso"),
    disconnected: () =>
      toast.warning("MCP Desconectado", "Conexão com servidor MCP perdida"),
    toolExecuted: (toolName: string) =>
      toast.info("Ferramenta Executada", `${toolName} executada com sucesso`),
    toolError: (toolName: string, error: string) =>
      toast.error(
        "Erro na Ferramenta",
        `Falha ao executar ${toolName}: ${error}`
      ),
  };
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA OS ALUNOS
// ============================================================================

/**
 * GUIA DE USO DO SISTEMA DE TOAST PARA ALUNOS:
 *
 * 1. **Setup no App:**
 *    ```tsx
 *    <ToastProvider position="top-right">
 *      <App />
 *    </ToastProvider>
 *    ```
 *
 * 2. **Uso Básico:**
 *    ```tsx
 *    const toast = useToast();
 *
 *    toast.success('Produto criado!');
 *    toast.error('Erro ao salvar');
 *    toast.warning('Estoque baixo');
 *    toast.info('Processando...');
 *    ```
 *
 * 3. **Toast com Ação:**
 *    ```tsx
 *    toast.error('Erro ao conectar', 'Falha na conexão', {
 *      action: {
 *        label: 'Tentar Novamente',
 *        onClick: () => reconnect()
 *      }
 *    });
 *    ```
 *
 * 4. **Toast Persistente:**
 *    ```tsx
 *    const id = toast.info('Carregando...', undefined, { persistent: true });
 *    // Remover depois
 *    toast.removeToast(id);
 *    ```
 *
 * 5. **Hooks Especializados:**
 *    ```tsx
 *    const apiToast = useApiToast();
 *    const mcpToast = useMcpToast();
 *
 *    apiToast.success('Dados salvos!');
 *    mcpToast.connected();
 *    ```
 */
