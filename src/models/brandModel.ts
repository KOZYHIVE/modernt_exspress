import { prisma } from "../config/prisma";

export class BrandModel {
    // Fungsi untuk membuat brand baru
    static async create(data: {
        brand_name: string;
        local_image_path?: string; // Path file lokal opsional
    }) {
        return prisma.brand.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan brand berdasarkan ID
    static async getById(id: number) {
        return prisma.brand.findUnique({
            where: { id },
            include: { vehicles: true },
        });
    }

    // Fungsi untuk memperbarui brand berdasarkan ID
    static async update(
        id: number,
        data: {
            brand_name?: string;
            local_image_path?: string;
        }
    ) {
        // Periksa apakah record ada sebelum update
        const existingBrand = await prisma.brand.findUnique({ where: { id } });

        if (!existingBrand) {
            throw new Error("Brand not found");
        }

        return prisma.brand.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus brand berdasarkan ID
    static async delete(id: number) {
        return prisma.brand.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar brand dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.brand.findMany({
            select: {
                id: true,
                brand_name: true,
                local_image_path: true,
                created_at: true,
                updated_at: true,
                vehicles: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}
