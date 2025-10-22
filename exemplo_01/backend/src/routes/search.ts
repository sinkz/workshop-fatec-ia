import { Router, Request, Response } from "express";
import axios from "axios";
import { Product } from "../types";

const router = Router();
const JSON_SERVER_URL = `http://localhost:${
  process.env.JSON_SERVER_PORT || 3002
}`;

/**
 * Search products by name, category, or description
 */
router.get("/products", async (req: Request, res: Response) => {
  try {
    const { q, category, minPrice, maxPrice, inStock } = req.query;

    const productsResponse = await axios.get<Product[]>(
      `${JSON_SERVER_URL}/products`
    );
    let products = productsResponse.data;

    // Filter by search query (name or description)
    if (q) {
      const searchTerm = (q as string).toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (category) {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(
        (product) => product.price >= parseFloat(minPrice as string)
      );
    }

    if (maxPrice) {
      products = products.filter(
        (product) => product.price <= parseFloat(maxPrice as string)
      );
    }

    // Filter by stock availability
    if (inStock === "true") {
      products = products.filter((product) => product.stock > 0);
    }

    // Sort by relevance (name matches first, then description matches)
    if (q) {
      const searchTerm = (q as string).toLowerCase();
      products.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });
    }

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
        filters: {
          query: q,
          category,
          minPrice,
          maxPrice,
          inStock,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search products",
      statusCode: 500,
    });
  }
});

/**
 * Get all available categories
 */
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const productsResponse = await axios.get<Product[]>(
      `${JSON_SERVER_URL}/products`
    );
    const products = productsResponse.data;

    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];

    // Get category stats
    const categoryStats = categories.map((category) => {
      const categoryProducts = products.filter((p) => p.category === category);
      return {
        name: category,
        productCount: categoryProducts.length,
        averagePrice:
          Math.round(
            (categoryProducts.reduce((sum, p) => sum + p.price, 0) /
              categoryProducts.length) *
              100
          ) / 100,
        totalStock: categoryProducts.reduce((sum, p) => sum + p.stock, 0),
      };
    });

    res.json({
      success: true,
      data: {
        categories: categoryStats,
        count: categories.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get categories",
      statusCode: 500,
    });
  }
});

export default router;
