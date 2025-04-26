import prisma from '../config/prisma';

export class BannerModel {
    // Fungsi untuk membuat banner baru
    static async create(data: {
        user_id: number;
        description: string;
        secure_url_image: string;
        public_url_image: string;
    }) {
        return prisma.banner.create({ data });
    }

    // Fungsi untuk mendapatkan banner berdasarkan ID
    static async getById(id: number) {
        return prisma.banner.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    // Fungsi untuk memperbarui banner berdasarkan ID
    // @ts-ignore
    static async update(id: number, data: {
        user_id?: number;
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
                description: true,
                public_url_image: true,
                secure_url_image: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}
