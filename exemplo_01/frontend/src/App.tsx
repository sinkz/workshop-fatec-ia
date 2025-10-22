import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { Products } from "./pages/Products";
import { Vendas } from "./pages/Vendas";
import { Analytics } from "./pages/Analytics";
import { Chat } from "./pages/Chat";
import {
  ErrorBoundary,
  PageErrorBoundary,
  ChatErrorBoundary,
} from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider position="top-right" maxToasts={5}>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/produtos" replace />} />
                <Route
                  path="produtos"
                  element={
                    <PageErrorBoundary>
                      <Products />
                    </PageErrorBoundary>
                  }
                />
                <Route
                  path="vendas"
                  element={
                    <PageErrorBoundary>
                      <Vendas />
                    </PageErrorBoundary>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <PageErrorBoundary>
                      <Analytics />
                    </PageErrorBoundary>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <ChatErrorBoundary>
                      <Chat />
                    </ChatErrorBoundary>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
