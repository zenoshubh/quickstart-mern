interface HealthCheckResult {
  message: string;
}

export class HealthService {
  static async checkHealth(): Promise<HealthCheckResult> {
    // Return plain data, not ApiResponse
    return {
      message: "Server is healthy",
    };
  }
}

export { HealthService as default };
