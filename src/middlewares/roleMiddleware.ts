// middlewares/roleMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";

// Middleware to verify user role
export const roleMiddleware = (requiredRole: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the access token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Authorization token is required" });
            }

            const token = authHeader.split(" ")[1];

            // Decode the access token to get the user ID
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN!) as { userId: number };
            const userId = decoded.userId;

            // Fetch the user by ID
            const user = await UserModel.getById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Check if the user has the required role
            if (user.role !== requiredRole) {
                return res.status(403).json({ error: "Access denied. Insufficient permissions." });
            }

            // Attach the user to the request object for further use
            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid access token" });
        }
    };
};