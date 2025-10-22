import { Router, Request, Response } from "express";
import axios from "axios";
import { Product } from "../types";
import { z } from "zod";

const router = Router();
const JSON_SERVER_URL = `http://localhost:${
  process.env.JSON_SERVER_PORT || 3002
}`;

// Stock update validation schema
const StockUpdateSchema = z.object({
  productId: z.number().int().positive("Product ID must be valid"),
  quantity: z.number().int("Quantity must be an integer"),
  operation: z.enum(["add", "subtract", "set"], {
    errorMap: () => ({ message: "Operation must be add, subtract, or set" }),
  }),
  reason: z.string().optional(),
});

/**
 * Update product stock
 */
router.patch("/stock", async (req: Request, res: Response) => {
  try {
    const validatedData = StockUpdateSchema.parse(req.body);
    const { productId, quantity, operation, reason } = validatedData;

    // Get current product
    const productResponse = await axios.get<Product>(
      `${JSON_SERVER_URL}/products/${productId}`
    );
    const product = productResponse.data;

    if (!product) {
      res.status(404).json({
        success: false,
        error: "Product not found",
        statusCode: 404,
      });
      return;
    }

    let newStock: number;

    switch (operation) {
      case "add":
        newStock = product.stock + quantity;
        break;
      case "subtract":
        newStock = product.stock - quantity;
        break;
      case "set":
        newStock = quantity;
        break;
    }

    // Prevent negative stock
    if (newStock < 0) {
      res.status(400).json({
        success: false,
        error: `Operation would result in negative stock. Current: ${product.stock}, Requested: ${operation} ${quantity}`,
        statusCode: 400,
      });
      return;
    }

    // Update product stock
    const updatedProduct = { ...product, stock: newStock };
    await axios.put(`${JSON_SERVER_URL}/products/${productId}`, updatedProduct);

    res.json({
      success: true,
      data: {
        product: updatedProduct,
        stockChange: {
          previous: product.stock,
          new: newStock,
          operation,
          quantity,
          reason,
        },
      },
      message: `Stock updated successfully. ${operation} ${quantity} units.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
        statusCode: 400,
      });
      return;
    }

    console.error("Stock update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update stock",
      statusCode: 500,
    });
  }
});

/**
 * Get low stock products
 */
router.get("/low-stock", async (req: Request, res: Response) => {
  try {
    const { threshold = 20 } = req.query;
    const stockThreshold = parseInt(threshold as string);

    const productsResponse = await axios.get<Product[]>(
      `${JSON_SERVER_URL}/products`
    );
    const products = productsResponse.data;

    const lowStockProducts = products
      .filter((product) => product.stock <= stockThreshold)
      .sort((a, b) => a.stock - b.stock); // Sort by lowest stock first

    res.json({
      success: true,
      data: {
        products: lowStockProducts,
        count: lowStockProducts.length,
        threshold: stockThreshold,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get low stock products",
      statusCode: 500,
    });
  }
});

/**
 * Get inventory summary
 */
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const productsResponse = await axios.get<Product[]>(
      `${JSON_SERVER_URL}/products`
    );
    const products = productsResponse.data;

    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );
    const totalValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 20
    ).length;

    // Stock by category
    const stockByCategory: Record<
      string,
      { products: number; totalStock: number; totalValue: number }
    > = {};

    products.forEach((product) => {
      if (!stockByCategory[product.category]) {
        stockByCategory[product.category] = {
          products: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }
      stockByCategory[product.category].products++;
      stockByCategory[product.category].totalStock += product.stock;
      stockByCategory[product.category].totalValue +=
        product.price * product.stock;
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalProducts,
          totalStock,
          totalValue: Math.round(totalValue * 100) / 100,
          outOfStock,
          lowStock,
          averageStockPerProduct:
            Math.round((totalStock / totalProducts) * 100) / 100,
        },
        stockByCategory,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Inventory summary error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get inventory summary",
      statusCode: 500,
    });
  }
});

export default router;
