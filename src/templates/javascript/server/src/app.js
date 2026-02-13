import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

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
import healthRouter from "./routes/health.routes.js";

app.use("/api/v1/health", healthRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Error middleware (must be last)
app.use(errorMiddleware);

export { app };
