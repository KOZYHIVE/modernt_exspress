import prisma from '../config/prisma';
import { Gender } from "@prisma/client";

export class DetailUserModel {
    // Fungsi untuk membuat detail pengguna baru
    static async create(data: {
        user_id: number;
        full_name: string;
        address: string;
        phone: string;
        gender: Gender; // Enum Gender
        dob: Date; // Tanggal lahir
    }) {
        return prisma.detailUser.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan detail pengguna berdasarkan ID
    static async getById(user_id: number) {
        return prisma.detailUser.findUnique({
            where: { user_id },
            include: { user: true },
        });
    }


    // Fungsi untuk memperbarui detail pengguna berdasarkan ID
    static async update(
        user_id: number, // Menggunakan user_id, bukan id unik
        data: {
            full_name?: string;
            address?: string;
            phone?: string;
            gender?: "male" | "female";
            dob?: Date;
        }
    ) {
        // Periksa apakah record ada sebelum update
        const existingDetailUser = await prisma.detailUser.findUnique({ where: { user_id } });

        if (!existingDetailUser) {
            throw new Error("User detail not found");
        }

        return prisma.detailUser.update({
            where: { user_id },
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus detail pengguna berdasarkan ID
    static async delete(id: number) {
        return prisma.detailUser.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar detail pengguna dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.detailUser.findMany({
            select: {
                id: true,
                user_id: true,
                full_name: true,
                address: true,
                phone: true,
                gender: true,
                dob: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}