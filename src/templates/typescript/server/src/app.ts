import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "@/utils/ApiError";
import { errorMiddleware } from "@/middlewares/error.middleware";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import healthRouter from "@/routes/health.routes";

app.use("/api/v1/health", healthRouter);

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
});

// Error middleware (must be last)
app.use(errorMiddleware);

export { app };
