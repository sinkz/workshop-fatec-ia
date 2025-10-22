import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error ${statusCode}: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response<ErrorResponse>
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
};
