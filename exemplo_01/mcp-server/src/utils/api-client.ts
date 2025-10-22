import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Product, Sale } from "../types/api";
import { logApiRequest, logApiError } from "./logger.js";
import { withRetryAndTimeout, defaultRetryConfig } from "./retry.js";

/**
 * API Client for Sales Backend
 * Provides typed methods to interact with the Sales API with retry and timeout support
 */
export class SalesApiClient {
  private client: AxiosInstance;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 30000) {
    this.timeout = timeout;
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logApiRequest(
          config.method?.toUpperCase() || "UNKNOWN",
          config.url || ""
        );
        return config;
      },
      (error) => {
        logApiError("REQUEST", "unknown", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling and logging
    this.client.interceptors.response.use(
      (response) => {
        logApiRequest(
          response.config.method?.toUpperCase() || "UNKNOWN",
          response.config.url || "",
          response.status
        );
        return response;
      },
      (error) => {
        const method = error.config?.method?.toUpperCase() || "UNKNOWN";
        const url = error.config?.url || "unknown";
        logApiError(method, url, error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Execute API call with retry and timeout
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    return withRetryAndTimeout(
      operation,
      this.timeout,
      {
        ...defaultRetryConfig,
        maxAttempts: 2, // Reduce attempts for API calls
      },
      context
    );
  }

  // Product methods
  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.client.get(
      "/api/products"
    );
    return response.data;
  }

  /**
   * Get product by ID
   */
  async getProduct(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.get(
      `/api/products/${id}`
    );
    return response.data;
  }

  /**
   * Create new product
   */
  async createProduct(
    product: Omit<Product, "id" | "createdAt">
  ): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.post(
      "/api/products",
      product
    );
    return response.data;
  }

  /**
   * Update product
   */
  async updateProduct(
    id: number,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product> {
    const response: AxiosResponse<Product> = await this.client.put(
      `/api/products/${id}`,
      product
    );
    return response.data;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/api/products/${id}`);
  }

  // Sale methods
  /**
   * Get all sales
   */
  async getSales(): Promise<Sale[]> {
    const response: AxiosResponse<Sale[]> = await this.client.get("/api/sales");
    return response.data;
  }

  /**
   * Get sale by ID
   */
  async getSale(id: number): Promise<Sale> {
    const response: AxiosResponse<Sale> = await this.client.get(
      `/api/sales/${id}`
    );
    return response.data;
  }

  /**
   * Create new sale
   */
  async createSale(sale: Omit<Sale, "id" | "saleDate">): Promise<Sale> {
    const saleWithDate = {
      ...sale,
      saleDate: new Date().toISOString(),
    };
    const response: AxiosResponse<Sale> = await this.client.post(
      "/api/sales",
      saleWithDate
    );
    return response.data;
  }

  /**
   * Update sale
   */
  async updateSale(
    id: number,
    sale: Partial<Omit<Sale, "id" | "saleDate">>
  ): Promise<Sale> {
    const response: AxiosResponse<Sale> = await this.client.put(
      `/api/sales/${id}`,
      sale
    );
    return response.data;
  }

  /**
   * Delete sale
   */
  async deleteSale(id: number): Promise<void> {
    await this.client.delete(`/api/sales/${id}`);
  }

  // Search methods
  /**
   * Search products with filters
   */
  async searchProducts(params: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<{ products: Product[]; count: number }> {
    const response = await this.client.get("/api/search/products", { params });
    return response.data.data;
  }

  /**
   * Get all categories with stats
   */
  async getCategories(): Promise<
    Array<{
      name: string;
      productCount: number;
      averagePrice: number;
      totalStock: number;
    }>
  > {
    const response = await this.client.get("/api/search/categories");
    return response.data.data.categories;
  }

  // Analytics methods
  /**
   * Get sales analytics
   */
  async getSalesAnalytics(): Promise<any> {
    const response = await this.client.get("/api/analytics/sales");
    return response.data.data;
  }

  /**
   * Get sales by date range
   */
  async getSalesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<{
    sales: Sale[];
    count: number;
    totalRevenue: number;
  }> {
    const response = await this.client.get("/api/analytics/sales/range", {
      params: { startDate, endDate },
    });
    return response.data.data;
  }

  // Inventory methods
  /**
   * Update product stock
   */
  async updateStock(
    productId: number,
    quantity: number,
    operation: "add" | "subtract" | "set",
    reason?: string
  ): Promise<{
    product: Product;
    stockChange: any;
  }> {
    const response = await this.client.patch("/api/inventory/stock", {
      productId,
      quantity,
      operation,
      reason,
    });
    return response.data.data;
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold: number = 20): Promise<Product[]> {
    const response = await this.client.get("/api/inventory/low-stock", {
      params: { threshold },
    });
    return response.data.data.products;
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary(): Promise<any> {
    const response = await this.client.get("/api/inventory/summary");
    return response.data.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    const response = await this.client.get("/health");
    return response.data;
  }
}
