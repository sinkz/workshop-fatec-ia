import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import { jsonServerMiddleware } from "./middleware/jsonServerProxy";
import analyticsRoutes from "./routes/analytics";
import searchRoutes from "./routes/search";
import inventoryRoutes from "./routes/inventory";
import mcpSseRoutes from "./routes/mcp-sse";

const app = express();
const PORT = process.env.PORT || 3001;
const JSON_SERVER_PORT = process.env.JSON_SERVER_PORT || 3002;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Sales API is running",
    timestamp: new Date().toISOString(),
    jsonServerUrl: `http://localhost:${JSON_SERVER_PORT}`,
  });
});

// MCP health check endpoint
// Nota: O MCP Server usa stdio, não HTTP. Este endpoint indica que o sistema está pronto para MCP.
app.get("/mcp/health", (req, res) => {
  res.json({
    success: true,
    message: "MCP integration ready",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// MCP SSE routes (Real MCP implementation)
app.use(mcpSseRoutes);

// Custom business logic routes (before JSON Server proxy)
app.use("/api/analytics", analyticsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/inventory", inventoryRoutes);

// Apply validation middleware to API routes
app.use("/api", jsonServerMiddleware);

// DEBUG: Log todas as requests e responses
app.use("/api", (req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }

  const originalEnd = res.end;
  let responseBody = "";

  // Override res.end para capturar resposta
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    if (chunk) {
      responseBody += chunk.toString();
    }
    console.log(`📤 Response ${res.statusCode} para ${req.method} ${req.path}`);
    if (responseBody) {
      console.log(`📄 Response body:`, responseBody.substring(0, 200));
    }
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
});

// Proxy to JSON Server
app.use(
  "/api",
  createProxyMiddleware({
    target: `http://localhost:${JSON_SERVER_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
    onError: (err, req, res) => {
      console.error("❌ Proxy error:", err.message);
      res.status(500).json({
        success: false,
        error:
          "JSON Server connection failed. Make sure JSON Server is running on port " +
          JSON_SERVER_PORT,
        statusCode: 500,
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`🔄 Proxying ${req.method} ${req.path} to JSON Server`);

      // CRÍTICO: Reescrever body para o proxy (body já foi parseado pelo express.json())
      if (
        req.body &&
        (req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "PATCH")
      ) {
        const bodyData = JSON.stringify(req.body);

        // Atualizar headers
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        // Escrever body no proxy request
        proxyReq.write(bodyData);
        console.log(
          `📝 Body enviado ao JSON Server:`,
          bodyData.substring(0, 100)
        );
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        `✅ Proxy response ${proxyRes.statusCode} de ${req.method} ${req.path}`
      );
    },
  })
);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Sales API server running on port ${PORT}`);
  console.log(`📊 JSON Server should be running on port ${JSON_SERVER_PORT}`);
  console.log(`🌐 CORS enabled for frontend development`);
});
