import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="h-12 bg-white border-t border-gray-200 flex items-center justify-center px-6">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Sistema educacional para demonstração de MCP + IA</span>
            <span className="text-gray-300">•</span>
            <span>Backend: Express + JSON Server</span>
            <span className="text-gray-300">•</span>
            <span>MCP: 12 ferramentas em português</span>
            <span className="text-gray-300">•</span>
            <span>Frontend: React + TypeScript</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
