import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDatabase } from "../../database/models/user";

export const Decoded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const excludedPaths = [
      "/user/login",
      "/user/seed",
    ];

    const dynamicExcludedPaths = [
      "/member/print/:id",
    ];

    // Check if the request path matches any exact excluded paths
    if (excludedPaths.includes(req.path)) {
      return next();
    }

    // Check if the request matches a dynamic path
    if (
      dynamicExcludedPaths.some((pattern) => {
        const regex = new RegExp(
          "^" + pattern.replace(/:[^\s/]+/g, "[^/]+") + "$"
        );
        return regex.test(req.path);
      })
    ) {
      return next();
    }

    // Extract token
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        meta: {
          status: false,
          message: "Access denied. No token provided.",
        },
      });
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY environment variable is not set.");
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY as string) as any;

      if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({
          meta: {
            status: false,
            message: "Invalid token: missing user ID.",
          },
        });
      }
    } catch (err: any) {
      return res.status(401).json({
        meta: {
          status: false,
          message: `Invalid token: ${err.message || "Error verifying token"}`,
        },
      });
    }

    // Find user by ID from the decoded token
    const findDoc = await UserDatabase.model.findById(decodedToken.id);
    if (!findDoc) {
      return res.status(404).json({
        meta: {
          status: false,
          message: "User not found.",
        },
      });
    }

    res.locals.data = findDoc;
    next();
  } catch (error) {
    next(error);
  }
};
