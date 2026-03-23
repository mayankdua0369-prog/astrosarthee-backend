import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal Server Error";
  
  console.error(`[Error] ${req.method} ${req.url}:`, error);

  res.status(statusCode).json({
    meta: {
      success: false,
      status: statusCode,
      message,
    },
  });
};
