// src/utils/blacklistedToken.service.ts

const tokenBlacklist: string[] = [];

export const addToBlacklist = (token: string): void => {
    tokenBlacklist.push(token);
};

export const isBlacklisted = (token: string): boolean => {
    return tokenBlacklist.includes(token);
};