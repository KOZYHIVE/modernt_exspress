import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// Generate Refresh Token
export const generateRefreshToken = (payload: any): string => {
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN;
    if (!refreshTokenSecret) {
        throw new Error('JWT_REFRESH_TOKEN is not defined in environment variables');
    }
    return jwt.sign(payload, refreshTokenSecret, {
        expiresIn: '7d',
    });
};

// Generate Access Token
export const generateAccessToken = (payload: { userId: number; email: string }) => {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
    if (!accessTokenSecret) {
        throw new Error("JWT_ACCESS_TOKEN is not defined in environment variables");
    }
    return jwt.sign(payload, accessTokenSecret, { expiresIn: "7d" });
};

// Generate both Refresh and Access Tokens
export const generateToken = (payload: any) => {
    const refreshToken = generateRefreshToken(payload);
    const accessToken = generateAccessToken(payload);

    return { refreshToken, accessToken };
};

// Decode Access Token
export const decodeAccessToken = (token: string): any | false => {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
    if (!accessTokenSecret) {
        throw new Error('JWT_ACCESS_TOKEN is not defined in environment variables');
    }
    try {
        return jwt.verify(token, accessTokenSecret) as any;
    } catch (e) {
        return false;
    }
};

// Verify Token
export const verifyToken = (token: string): any => {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
    if (!accessTokenSecret) {
        throw new Error('JWT_ACCESS_TOKEN is not defined in environment variables');
    }
    try {
        return jwt.verify(token, accessTokenSecret) as any;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Decode Refresh Token
export const decodeRefreshToken = (token: string): any | false => {
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN;
    if (!refreshTokenSecret) {
        throw new Error('JWT_REFRESH_TOKEN is not defined in environment variables');
    }
    try {
        return jwt.verify(token, refreshTokenSecret) as any;
    } catch (e) {
        return false;
    }
};

// Send Refresh Token via Cookie
export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
        sameSite: 'strict',
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
    });
};

// Delete Refresh Token from Cookie
export const deleteRefreshToken = (res: Response) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};