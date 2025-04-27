// models/BannerModel.ts

import prisma from '../config/prisma';

export class BannerModel {
    // Fungsi untuk membuat banner baru
    static async create(data: {
        user_id: number;
        vehicle_id: number;
        title: string;
        description: string;
        secure_url_image?: string;
        public_url_image?: string;
    }) {
        return prisma.banner.create({ data });
    }

    // Fungsi untuk mendapatkan banner berdasarkan ID
    static async getById(id: number) {
        return prisma.banner.findUnique({
            where: { id },
            include: {
                user: true,
                vehicle: true,
            },
        });
    }

    // Fungsi untuk mendapatkan banner berdasarkan user_id
    static async getByUserId(user_id: number) {
        return prisma.banner.findMany({
            where: { user_id },
            include: {
                user: true,
                vehicle: true,
            },
        });
    }

    // Fungsi untuk mendapatkan banner berdasarkan vehicle_id
    static async getByVehicleId(vehicle_id: number) {
        return prisma.banner.findMany({
            where: { vehicle_id },
            include: {
                user: true,
                vehicle: true,
            },
        });
    }

    // Fungsi untuk memperbarui banner berdasarkan ID
    static async update(id: number, data: {
        user_id?: number;
        vehicle_id?: number;
        title?: string;
        description?: string;
        secure_url_image?: string;
        public_url_image?: string;
    }) {
        const existingBanner = await prisma.banner.findUnique({ where: { id } });

        if (!existingBanner) {
            throw new Error("Banner not found");
        }

        return prisma.banner.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk menghapus banner berdasarkan ID
    static async delete(id: number) {
        return prisma.banner.delete({ where: { id } });
    }

    // Fungsi untuk mendapatkan daftar banner dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.banner.findMany({
            select: {
                id: true,
                user_id: true,
                vehicle_id: true,
                title: true,
                description: true,
                secure_url_image: true,
                public_url_image: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}