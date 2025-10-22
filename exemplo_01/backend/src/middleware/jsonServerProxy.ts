import { Request, Response, NextFunction } from "express";
import {
  validateProduct,
  validateSale,
  validateProductUpdate,
  validateSaleUpdate,
} from "./validation";
import { logger } from "./logger";

/**
 * Middleware to add timestamps and validation for JSON Server operations
 */
export const jsonServerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log all API requests
  logger.info({
    method: req.method,
    path: req.path,
    body: req.method !== "GET" ? req.body : undefined,
    query: req.query,
  });

  // Add createdAt timestamp for POST requests
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString();
  }

  // Route-specific validation
  const isProductRoute = req.path.startsWith("/products");
  const isSaleRoute = req.path.startsWith("/sales");

  if (req.method === "POST") {
    if (isProductRoute) {
      return validateProduct(req, res, next);
    } else if (isSaleRoute) {
      return validateSale(req, res, next);
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    if (isProductRoute) {
      return validateProductUpdate(req, res, next);
    } else if (isSaleRoute) {
      return validateSaleUpdate(req, res, next);
    }
  }

  next();
};

/**
 * Middleware to enhance JSON Server responses
 * DESABILITADO para operações de POST/PUT/PATCH pois o proxy já retorna direto
 */
export const enhanceJsonServerResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Não envolver respostas de escrita (POST, PUT, PATCH)
  // O proxy retorna o JSON direto do JSON Server
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    return next();
  }

  const originalSend = res.send;

  res.send = function (data: any) {
    // Wrap apenas GET responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const wrappedResponse = {
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      };
      return originalSend.call(this, wrappedResponse);
    }

    return originalSend.call(this, data);
  };

  next();
};
