// src/models/refreshToken.ts

import { prisma } from "../config/prisma";

class RefreshTokenModel {
    static create(userId: number, refreshToken: string) {
        return prisma.refreshToken.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
            },
        });
    }

    static findToken(token: string) {
        return prisma.refreshToken.findFirst({
            where: { refresh_token: token },
        });
    }

    static deleteToken(token: string) {
        return prisma.refreshToken.deleteMany({
            where: { refresh_token: token },
        });
    }

    static getToken(refreshToken: string) {
        return prisma.refreshToken.findFirst({
            where: {
                refresh_token: refreshToken,
            },
        });
    }

    static deleteTokenByUserId(userId: number) {
        return prisma.refreshToken.deleteMany({
            where: { user_id: userId },
        });
    }
}

export default RefreshTokenModel;