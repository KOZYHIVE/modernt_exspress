// src/middlewares/authMiddleware.ts

import jwt from "jsonwebtoken";
import { generateToken, decodeAccessToken, decodeRefreshToken, sendRefreshToken } from "../utils/jwt";
import RefreshTokenModel from "../models/refreshToken";
import { UserService } from "../models/userModel";
import { isBlacklisted } from "../utils/blacklistedToken";

const excludedRoutes = [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/refresh-token",
];

interface DecodedToken {
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: any; // Sesuaikan dengan tipe pengguna Anda jika sudah ada models User
        }
    }
}

export const authMiddleware = async (req: any, res: any, next: any) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }

    const refreshToken = req.cookies["refresh_token"];


    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    const accessToken = authorizationHeader ? authorizationHeader.split(" ")[1] : null;

    if (accessToken) {
        const decodedToken = jwt.decode(accessToken);
    }


    if (isBlacklisted(accessToken)) {
        return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    try {
        const decodedToken = decodeAccessToken(accessToken) as DecodedToken;

        if (!decodedToken) {
            throw new Error("Invalid access token");
        }

        const user = await UserService.getUserById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            if (refreshToken) {
                const validRefreshToken = await RefreshTokenModel.getToken(refreshToken);
                if (!validRefreshToken) {
                    return res.status(401).json({ message: "Unauthorized: Invalid refresh token" });
                }

                const newTokens = generateToken({ userId: validRefreshToken.user_id.toString() });
                sendRefreshToken(res, newTokens.refreshToken);

                req.headers["authorization"] = `Bearer ${newTokens.accessToken}`;
                req.user = await UserService.getUserById(validRefreshToken.user_id);
                return next();
            } else {
                return res.status(401).json({ message: "Unauthorized: Refresh token is missing" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized: Invalid access token" });
        }
    }
};

export const authCompanyMiddleware = async (req: any, res: any, next: any) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }

    const authorizationHeader = req.headers["authorization"];
    const refreshToken = req.cookies["refresh_token"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (isBlacklisted(accessToken)) {
        return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    try {
        const decodedToken = decodeAccessToken(accessToken) as DecodedToken;

        if (!decodedToken) {
            throw new Error("Invalid access token");
        }

        const user = await UserService.getUserById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            if (refreshToken) {
                const validRefreshToken = await RefreshTokenModel.getToken(refreshToken);
                if (!validRefreshToken) {
                    return res.status(401).json({ message: "Unauthorized: Invalid refresh token" });
                }

                const newTokens = generateToken({ userId: validRefreshToken.user_id.toString() });
                sendRefreshToken(res, newTokens.refreshToken);

                req.headers["authorization"] = `Bearer ${newTokens.accessToken}`;
                req.user = await UserService.getUserById(validRefreshToken.user_id);
                return next();
            } else {
                return res.status(401).json({ message: "Unauthorized: Refresh token is missing" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized: Invalid access token" });
        }
    }
};