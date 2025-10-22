import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler";

// Product validation schema
export const ProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  price: z.number().positive("Preço deve ser positivo"),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
});

// Sale validation schema
export const SaleSchema = z.object({
  productId: z.number().int().positive("ID do produto deve ser válido"),
  quantity: z.number().int().positive("Quantidade deve ser positiva"),
  totalPrice: z.number().positive("Preço total deve ser positivo"),
  customerName: z
    .string()
    .min(1, "Nome do cliente é obrigatório")
    .max(100, "Nome muito longo"),
});

// Generic validation middleware factory
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        const validationError = new Error(
          `Dados inválidos: ${errorMessage}`
        ) as AppError;
        validationError.statusCode = 400;
        next(validationError);
      } else {
        next(error);
      }
    }
  };
}

// Specific validation middlewares
export const validateProduct = validateBody(ProductSchema);
export const validateSale = validateBody(SaleSchema);

// Validation for product updates (partial)
export const validateProductUpdate = validateBody(ProductSchema.partial());
export const validateSaleUpdate = validateBody(SaleSchema.partial());
