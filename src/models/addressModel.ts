// models/AddressModel.ts

import prisma from '../config/prisma';

export class AddressModel {
    // Fungsi untuk membuat alamat baru
    static async create(data: {
        user_id: number;
        full_name: string;
        address: string;
        phone?: string;
        url_maps?: string;
    }) {
        return prisma.address.create({ data });
    }

    // Fungsi untuk mendapatkan alamat berdasarkan ID
    static async getById(id: number) {
        return prisma.address.findUnique({
            where: { id },
            include: { user: true, booking: true },
        });
    }

    // Fungsi untuk mendapatkan alamat berdasarkan ID
    static async getByUserId(user_id: number) {
        return prisma.address.findMany({
            where: { user_id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true,
                        secure_url_profile: true,
                        public_url_profile: true,
                        role: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
                booking: true,
            },
        });
    }

    // Fungsi untuk memperbarui alamat berdasarkan ID
    static async update(id: number, data: {
        user_id?: number;
        full_name?: string;
        address?: string;
        phone?: string;
        url_maps?: string;
    }) {
        const existingAddress = await prisma.address.findUnique({ where: { id } });

        if (!existingAddress) {
            throw new Error("Address not found");
        }

        return prisma.address.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk menghapus alamat berdasarkan ID
    static async delete(id: number) {
        return prisma.address.delete({ where: { id } });
    }

    // Fungsi untuk mendapatkan daftar alamat dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.address.findMany({
            select: {
                id: true,
                user_id: true,
                full_name: true,
                address: true,
                phone: true,
                url_maps: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}