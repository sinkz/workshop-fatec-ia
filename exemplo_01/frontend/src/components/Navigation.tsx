import { NavLink } from "react-router-dom";
import { TrendingUp, MessageSquare, Package } from "lucide-react";

/**
 * COMPONENTE DE NAVEGAÇÃO
 *
 * Menu principal com as três seções do sistema:
 * - Produtos: Gerenciamento de produtos
 * - Vendas: Controle de vendas e analytics
 * - Chat: Interface de chat com MCP
 */
export function Navigation() {
  const navItems = [
    {
      to: "/produtos",
      label: "Produtos",
      icon: Package,
      description: "Gerenciar produtos e categorias",
    },
    {
      to: "/vendas",
      label: "Vendas",
      icon: TrendingUp,
      description: "Vendas e relatórios",
    },
    {
      to: "/chat",
      label: "Chat IA",
      icon: MessageSquare,
      description: "Assistente inteligente com MCP",
    },
  ];

  return (
    <nav className="flex space-x-8 border-t border-gray-200 pt-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? "text-blue-600" : "text-gray-500"}
                />
                <span>{item.label}</span>
                {/* Tooltip com descrição (visível no hover) */}
                <div className="hidden group-hover:block absolute top-full left-0 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                  {item.description}
                </div>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
