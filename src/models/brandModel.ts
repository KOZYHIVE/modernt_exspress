// models/BrandModel.ts

import prisma from '../config/prisma';

export class BrandModel {
    // Fungsi untuk membuat brand baru
    static async create(data: {
        brand_name: string;
        public_url_image?: string;
        secure_url_image?: string;
    }) {
        return prisma.brand.create({ data });
    }

    // Fungsi untuk mendapatkan brand berdasarkan ID
    static async getById(id: number) {
        return prisma.brand.findUnique({
            where: { id },
            include: { Vehicle: true },
        });
    }

    // Fungsi untuk mendapatkan semua brand
    static async getAll() {
        return prisma.brand.findMany({
            include: { Vehicle: true },
        });
    }

    // Fungsi untuk memperbarui brand berdasarkan ID
    static async update(id: number, data: {
        brand_name?: string;
        public_url_image?: string;
        secure_url_image?: string;
    }) {
        const existingBrand = await prisma.brand.findUnique({ where: { id } });

        if (!existingBrand) {
            throw new Error("Brand not found");
        }

        return prisma.brand.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk menghapus brand berdasarkan ID
    static async delete(id: number) {
        return prisma.brand.delete({ where: { id } });
    }
}