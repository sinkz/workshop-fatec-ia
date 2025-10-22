/**
 * 🔄 COMPONENTES DE LOADING E SKELETON
 *
 * Componentes para estados de carregamento que melhoram a experiência
 * do usuário durante operações assíncronas.
 */

import React from "react";
import { Loader2 } from "lucide-react";

// ============================================================================
// 🎯 SPINNER DE LOADING BÁSICO
// ============================================================================

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "green" | "red" | "gray" | "white";
  className?: string;
}

export function Spinner({
  size = "md",
  color = "blue",
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-600",
    white: "text-white",
  };

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
}

// ============================================================================
// 🎯 LOADING OVERLAY
// ============================================================================

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message = "Carregando...",
  children,
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-gray-600 mt-2 text-sm">{message}</p>
          </div>
        </div>
      )}

      {isLoading && blur && (
        <div className="absolute inset-0 backdrop-blur-sm z-5" />
      )}
    </div>
  );
}

// ============================================================================
// 🎯 LOADING BUTTON
// ============================================================================

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${className}
      `}
    >
      {isLoading && <Spinner size="sm" color="white" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}

// ============================================================================
// 🎯 SKELETON COMPONENTS
// ============================================================================

/**
 * Skeleton básico para texto
 */
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = "", width, height }: SkeletonProps) {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton para texto com múltiplas linhas
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-4"
          width={index === lines - 1 ? "75%" : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton para cards de produto
 */
export function SkeletonProductCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Imagem */}
      <Skeleton className="h-32 w-full" />

      {/* Título */}
      <Skeleton className="h-5 w-3/4" />

      {/* Categoria */}
      <Skeleton className="h-4 w-1/2" />

      {/* Descrição */}
      <SkeletonText lines={2} />

      {/* Preço e ações */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para tabela
 */
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton para chat
 */
export function SkeletonChatMessage({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex items-start space-x-2 max-w-xs lg:max-w-md xl:max-w-lg`}
      >
        {!isUser && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}

        <div
          className={`px-4 py-2 rounded-lg ${
            isUser ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <SkeletonText lines={2} />
          <Skeleton className="h-3 w-16 mt-2" />
        </div>

        {isUser && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}
      </div>
    </div>
  );
}

// ============================================================================
// 🎯 LOADING STATES ESPECÍFICOS
// ============================================================================

/**
 * Loading state para página de produtos
 */
export function ProductsPageLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    </div>
  );
}

/**
 * Loading state para página de vendas
 */
export function SalesPageLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales table */}
      <SkeletonTable rows={8} columns={6} />
    </div>
  );
}

/**
 * Loading state para chat
 */
export function ChatLoading() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4">
        <SkeletonChatMessage />
        <SkeletonChatMessage isUser />
        <SkeletonChatMessage />
        <SkeletonChatMessage isUser />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 📚 DOCUMENTAÇÃO PARA OS ALUNOS
// ============================================================================

/**
 * GUIA DE USO DOS COMPONENTES DE LOADING PARA ALUNOS:
 *
 * 1. **Spinner Básico:**
 *    ```tsx
 *    <Spinner size="lg" color="blue" />
 *    ```
 *
 * 2. **Loading Overlay:**
 *    ```tsx
 *    <LoadingOverlay isLoading={loading} message="Salvando...">
 *      <MeuFormulario />
 *    </LoadingOverlay>
 *    ```
 *
 * 3. **Loading Button:**
 *    ```tsx
 *    <LoadingButton
 *      isLoading={saving}
 *      loadingText="Salvando..."
 *      onClick={handleSave}
 *    >
 *      Salvar
 *    </LoadingButton>
 *    ```
 *
 * 4. **Skeleton Components:**
 *    ```tsx
 *    {loading ? (
 *      <SkeletonProductCard />
 *    ) : (
 *      <ProductCard product={product} />
 *    )}
 *    ```
 *
 * 5. **Loading States de Página:**
 *    ```tsx
 *    {loading ? <ProductsPageLoading /> : <ProductsPage />}
 *    ```
 */
