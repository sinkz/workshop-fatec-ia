import { logger } from "./logger.js";

/**
 * Retry configuration interface
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  context: string = "operation"
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      const result = await operation();

      if (attempt > 1) {
        logger.info(`${context} succeeded after ${attempt} attempts`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      if (attempt === finalConfig.maxAttempts) {
        logger.error(`${context} failed after ${attempt} attempts`, {
          error: lastError.message,
          attempts: attempt,
        });
        break;
      }

      const delay = Math.min(
        finalConfig.baseDelay *
          Math.pow(finalConfig.backoffMultiplier, attempt - 1),
        finalConfig.maxDelay
      );

      logger.warn(
        `${context} failed on attempt ${attempt}, retrying in ${delay}ms`,
        {
          error: lastError.message,
          attempt,
          nextRetryIn: `${delay}ms`,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  context: string = "operation"
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        const error = new Error(`${context} timed out after ${timeoutMs}ms`);
        logger.error("Operation timeout", {
          context,
          timeout: `${timeoutMs}ms`,
        });
        reject(error);
      }, timeoutMs);
    }),
  ]);
}

/**
 * Combine retry and timeout
 */
export async function withRetryAndTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  retryConfig: Partial<RetryConfig> = {},
  context: string = "operation"
): Promise<T> {
  return withRetry(
    () => withTimeout(operation(), timeoutMs, context),
    retryConfig,
    context
  );
}
