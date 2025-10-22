import { Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      path: "/produtos",
      label: "Produtos",
      icon: Package,
      description: "Gerenciar produtos e estoque",
    },
    {
      path: "/vendas",
      label: "Vendas",
      icon: ShoppingCart,
      description: "Histórico e registro de vendas",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Relatórios e métricas",
    },
    {
      path: "/chat",
      label: "Chat IA",
      icon: MessageCircle,
      description: "Assistente inteligente com MCP",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Sales API</span>
              <span className="text-xs text-gray-500">MCP + IA</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md mx-auto">
            <Zap className="w-6 h-6 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
            isCollapsed ? "hidden" : ""
          }`}
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } px-3 py-3 rounded-xl transition-all duration-200 relative ${
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
              )}
              <div
                className={`p-2 rounded-lg transition-colors ${
                  active
                    ? "bg-primary-100"
                    : "bg-gray-100 group-hover:bg-primary-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? "text-primary-600"
                      : "text-gray-600 group-hover:text-primary-600"
                  }`}
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm ${
                      active ? "text-primary-700" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              )}

              {/* Tooltip para collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                  <div className="text-xs text-gray-300 mt-1">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Info Card - apenas quando expandida */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MessageCircle className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900">
                Chat com IA
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Experimente perguntar sobre produtos, vendas ou análises. O
              assistente usa MCP!
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Experimentar agora →
            </Link>
          </div>
        </div>
      )}

      {/* Collapse button quando colapsada */}
      {isCollapsed && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onToggle}
            className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            aria-label="Expandir sidebar"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </aside>
  );
}
