import winston from "winston";

/**
 * Structured logger for MCP Server
 * Provides consistent logging across all components
 */

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      service: "mcp-server",
      message,
      ...meta,
    });
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "sales-mcp-server" },
  transports: [
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? JSON.stringify(meta, null, 2)
            : "";
          return `[MCP] ${level}: ${message} ${metaStr}`;
        })
      ),
    }),

    // File output for production
    new winston.transports.File({
      filename: "logs/mcp-error.log",
      level: "error",
      format: logFormat,
    }),
    new winston.transports.File({
      filename: "logs/mcp-combined.log",
      format: logFormat,
    }),
  ],
});

/**
 * Log tool execution start
 */
export function logToolStart(
  toolName: string,
  args: Record<string, any>
): void {
  logger.info("Tool execution started", {
    tool: toolName,
    arguments: args,
    event: "tool_start",
  });
}

/**
 * Log tool execution success
 */
export function logToolSuccess(toolName: string, executionTime: number): void {
  logger.info("Tool execution completed successfully", {
    tool: toolName,
    executionTime: `${executionTime}ms`,
    event: "tool_success",
  });
}

/**
 * Log tool execution error
 */
export function logToolError(
  toolName: string,
  error: Error,
  executionTime: number
): void {
  logger.error("Tool execution failed", {
    tool: toolName,
    error: error.message,
    stack: error.stack,
    executionTime: `${executionTime}ms`,
    event: "tool_error",
  });
}

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  url: string,
  status?: number
): void {
  logger.debug("API request", {
    method,
    url,
    status,
    event: "api_request",
  });
}

/**
 * Log API error
 */
export function logApiError(method: string, url: string, error: Error): void {
  logger.error("API request failed", {
    method,
    url,
    error: error.message,
    event: "api_error",
  });
}

/**
 * Log server events
 */
export function logServerEvent(
  event: string,
  details?: Record<string, any>
): void {
  logger.info("Server event", {
    event,
    ...details,
  });
}
