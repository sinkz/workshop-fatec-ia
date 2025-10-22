import axios, { AxiosInstance } from "axios";
import { Product, Sale } from "../types/api";

/**
 * Cliente da API REST para o frontend
 * Conecta com o backend Express + JSON Server
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "[API] Response error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get("/health");
    return response.data;
  }

  // Produtos
  async getProducts(): Promise<Product[]> {
    const response = await this.client.get("/api/products");
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.client.get(`/api/products/${id}`);
    return response.data;
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt">
  ): Promise<Product> {
    const response = await this.client.post("/api/products", product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await this.client.put(`/api/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/api/products/${id}`);
  }

  // Vendas
  async getSales(): Promise<Sale[]> {
    const response = await this.client.get("/api/sales");
    return response.data;
  }

  async getSale(id: number): Promise<Sale> {
    const response = await this.client.get(`/api/sales/${id}`);
    return response.data;
  }

  async createSale(sale: Omit<Sale, "id" | "saleDate">): Promise<Sale> {
    const response = await this.client.post("/api/sales", {
      ...sale,
      saleDate: new Date().toISOString(),
    });
    return response.data;
  }

  // Busca e Analytics
  async searchProducts(params: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) {
    const response = await this.client.get("/api/search/products", { params });
    return response.data;
  }

  async getCategories() {
    const response = await this.client.get("/api/search/categories");
    return response.data;
  }

  async getSalesAnalytics() {
    const response = await this.client.get("/api/analytics/sales");
    return response.data;
  }

  async getInventorySummary() {
    const response = await this.client.get("/api/inventory/summary");
    return response.data;
  }
}

export const apiClient = new ApiClient();
