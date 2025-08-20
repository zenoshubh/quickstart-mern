class HealthService {
  static async checkHealth() {
    // Return plain data, not ApiResponse
    return {
      message: "Server is healthy",
    };
  }
}

export { HealthService };