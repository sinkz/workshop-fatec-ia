import { Router, Request, Response } from "express";
import axios from "axios";
import { Product, Sale } from "../types";

const router = Router();
const JSON_SERVER_URL = `http://localhost:${
  process.env.JSON_SERVER_PORT || 3002
}`;

/**
 * Get sales analytics and metrics
 */
router.get("/sales", async (req: Request, res: Response) => {
  try {
    // Fetch sales and products data
    const [salesResponse, productsResponse] = await Promise.all([
      axios.get<Sale[]>(`${JSON_SERVER_URL}/sales`),
      axios.get<Product[]>(`${JSON_SERVER_URL}/products`),
    ]);

    const sales = salesResponse.data;
    const products = productsResponse.data;

    // Calculate analytics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const averageOrderValue = totalRevenue / totalSales;

    // Sales by category
    const salesByCategory: Record<string, { count: number; revenue: number }> =
      {};

    sales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        if (!salesByCategory[product.category]) {
          salesByCategory[product.category] = { count: 0, revenue: 0 };
        }
        salesByCategory[product.category].count += sale.quantity;
        salesByCategory[product.category].revenue += sale.totalPrice;
      }
    });

    // Top selling products
    const productSales: Record<
      number,
      { product: Product; totalQuantity: number; totalRevenue: number }
    > = {};

    sales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        if (!productSales[sale.productId]) {
          productSales[sale.productId] = {
            product,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        productSales[sale.productId].totalQuantity += sale.quantity;
        productSales[sale.productId].totalRevenue += sale.totalPrice;
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Recent sales (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSales = sales.filter(
      (sale) => new Date(sale.saleDate) >= sevenDaysAgo
    );

    // Low stock products (stock < 20)
    const lowStockProducts = products.filter((product) => product.stock < 20);

    const analytics = {
      summary: {
        totalSales,
        totalRevenue,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
      },
      salesByCategory,
      topProducts,
      recentSales: recentSales.length,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        category: p.category,
      })),
    };

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate analytics",
      statusCode: 500,
    });
  }
});

/**
 * Get sales by date range
 */
router.get(
  "/sales/range",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: "startDate and endDate parameters are required",
          statusCode: 400,
        });
        return;
      }

      const salesResponse = await axios.get<Sale[]>(`${JSON_SERVER_URL}/sales`);
      const sales = salesResponse.data;

      const filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.saleDate);
        return (
          saleDate >= new Date(startDate as string) &&
          saleDate <= new Date(endDate as string)
        );
      });

      const totalRevenue = filteredSales.reduce(
        (sum, sale) => sum + sale.totalPrice,
        0
      );

      res.json({
        success: true,
        data: {
          sales: filteredSales,
          count: filteredSales.length,
          totalRevenue,
          dateRange: { startDate, endDate },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Date range analytics error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get sales by date range",
        statusCode: 500,
      });
    }
  }
);

export default router;
