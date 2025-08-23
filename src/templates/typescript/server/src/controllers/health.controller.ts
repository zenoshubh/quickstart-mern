import { Request, Response } from "express";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { HealthService } from "@/services/health.service";

// Use static method directly
const checkHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await HealthService.checkHealth();
    res.status(200).json(new ApiResponse(200, result, result.message));
  } catch (error) {
    // Example usage of ApiError
    res.status(500).json(new ApiError(500, "Health check failed", [error]));
  }
});

export { checkHealth };
