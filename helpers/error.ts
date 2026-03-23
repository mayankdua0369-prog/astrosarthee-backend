import { Request, Response, NextFunction } from "express";

// Global Error Handler
export const errorHandle = (
  err:  Error | any, // Typing includes S3Error and other error types
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }

  // Log the error (optional)
  console.error("Error occurred:", err);

  try {
  
    // Handle general errors
    return res.status(501).json({
      meta: { success: false, message: "Service error" },
      data: {
        name: err.name || "UnknownError",
        message: err.message || "An unexpected error occurred",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Stack trace only in development
        err,
      },
    });
  } catch (error) {
    // Fallback for error handler failures
    return res.status(500).json({
      meta: { success: false, message: "Proxy server error" },
    });
  }
};