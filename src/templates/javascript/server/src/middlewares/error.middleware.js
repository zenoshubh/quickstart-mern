import { ApiError } from "../utils/ApiError.js";

export function errorMiddleware(err, _req, res, _next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    ...(err instanceof ApiError && err.errors?.length ? { errors: err.errors } : {}),
  });
}
