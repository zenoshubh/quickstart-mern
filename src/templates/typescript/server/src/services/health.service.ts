import mongoose from "mongoose";

interface DatabaseHealth {
  status: "connected" | "disconnected" | "error";
  message: string;
  readyState?: number;
  host?: string;
  name?: string;
  error?: string;
}

interface HealthCheckResult {
  message: string;
  timestamp: string;
  uptime: number;
  database: DatabaseHealth;
}

interface HealthCheckError {
  message: string;
  error: string;
  timestamp: string;
}

export class HealthService {
  static async checkDatabaseConnection(): Promise<DatabaseHealth> {
    try {
      // Check if mongoose is connected
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        // Additional ping test to ensure database is responsive
        await mongoose.connection.db.admin().ping();
        return {
          status: "connected",
          message: "Database connection is healthy",
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        };
      } else {
        return {
          status: "disconnected",
          message: "Database is not connected",
          readyState: mongoose.connection.readyState
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  static async checkHealth(): Promise<HealthCheckResult | HealthCheckError> {
    try {
      // Check database connectivity
      const dbHealth = await this.checkDatabaseConnection();
      
      const health: HealthCheckResult = {
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbHealth
      };

      // If database is not healthy, adjust the main message
      if (dbHealth.status !== "connected") {
        health.message = "Server is running but database connection issues detected";
      }

      return health;
    } catch (error) {
      return {
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      };
    }
  }
}

export { HealthService as default };
