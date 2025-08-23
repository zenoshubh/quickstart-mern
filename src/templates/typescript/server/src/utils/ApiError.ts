export class ApiError extends Error {
  public statusCode: number;
  public data: null;
  public success: boolean;
  public errors: any[];

  constructor(
    statusCode: number, // HTTP status code (e.g., 400 for Bad Request, 500 for Server Error)
    message: string = "Something went wrong", // Default error message
    errors: any[] = [], // Array to store additional error details (useful for validation errors)
    stack: string = "" // Optional stack trace for debugging
  ) {
    super(message); // Call the parent Error class constructor and set the error message

    this.statusCode = statusCode; // Store HTTP status code
    this.data = null; // Default to null, can be used if additional data is needed
    this.message = message; // Store the provided error message
    this.success = false; // Always false, indicating a failed request
    this.errors = errors; // Store an array of additional error details (useful for form validation)

    // If a stack trace is provided, use it. Otherwise, generate one.
    if (stack) {
      this.stack = stack; // Use the provided stack trace
    } else {
      // Generate a proper stack trace (Node.js specific)
      if ((Error as any).captureStackTrace) {
        (Error as any).captureStackTrace(this, this.constructor);
      }
    }
  }
}

export { ApiError as default }; // Export the class for use in other files
