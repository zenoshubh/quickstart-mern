import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";

export function errorMiddleware(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    ...(err instanceof ApiError && err.errors?.length ? { errors: err.errors } : {}),
  });
}
