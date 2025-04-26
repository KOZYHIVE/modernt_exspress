import prisma from '../config/prisma';

export class AddressDeliveryModel {
    // Fungsi untuk membuat detail pengguna baru
    static async create(data: {
        user_id: number;
        full_name: string;
        address: string;
        phone: string;
    }) {
        return prisma.addressDelivery.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan detail pengguna berdasarkan ID
    static async getById(id: number) {
        return prisma.addressDelivery.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    // Fungsi untuk memperbarui detail pengguna berdasarkan ID
    static async update(
        id: number, // Menggunakan user_id, bukan id unik
        data: { full_name?: string; address?: string; phone?: string }
    ) {
        // Periksa apakah record ada sebelum update
        const existingDetailUser = await prisma.addressDelivery.findUnique({ where: { id } });

        if (!existingDetailUser) {
            throw new Error("User detail not found");
        }

        return prisma.addressDelivery.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus detail pengguna berdasarkan ID
    static async delete(id: number) {
        return prisma.addressDelivery.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar detail pengguna dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.addressDelivery.findMany({
            select: {
                id: true,
                user_id: true,
                full_name: true,
                address: true,
                phone: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}