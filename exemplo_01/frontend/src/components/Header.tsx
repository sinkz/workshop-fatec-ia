import { useLocation, Link } from "react-router-dom";
import { Settings, Home, ChevronRight } from "lucide-react";

export function Header() {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/" }];

    const labels: Record<string, string> = {
      produtos: "Produtos",
      vendas: "Vendas",
      analytics: "Analytics",
      chat: "Chat IA",
    };

    paths.forEach((path, index) => {
      const label = labels[path] || path;
      const fullPath = "/" + paths.slice(0, index + 1).join("/");
      breadcrumbs.push({ label, path: fullPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {index === 0 ? (
              <Link
                to={crumb.path}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* System Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-success-dark">
            Sistema Online
          </span>
        </div>

        {/* Settings */}
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
