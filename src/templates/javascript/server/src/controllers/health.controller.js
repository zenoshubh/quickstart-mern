import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HealthService } from "../services/health.service.js";

// Use static method directly
const checkHealth = asyncHandler(async (req, res) => {
  try {
    const result = await HealthService.checkHealth();
    res.status(200).json(new ApiResponse(200, result, result.message));
  } catch (error) {
    // Example usage of ApiError
    res.status(500).json(new ApiError(500, "Health check failed", error));
  }
});

export { checkHealth };
