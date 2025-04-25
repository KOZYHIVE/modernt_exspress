import prisma from '../config/prisma';
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export class TransactionModel {
    // Fungsi untuk membuat transaksi baru
    static async create(data: {
        user_id: number;
        rental_id: number;
        payment_status: PaymentStatus;
        transaction_date: Date;
        payment_method: PaymentMethod;
        total_amount: number;
        local_image_path?: string;
    }) {
        return prisma.transaction.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan transaksi berdasarkan ID
    static async getById(id: number) {
        return prisma.transaction.findUnique({
            where: { id },
            include: { user: true, rental: true },
        });
    }

    // Fungsi untuk memperbarui transaksi berdasarkan ID
    // @ts-ignore
    static async update(id: number, data: Partial<Omit<typeof data, "id">>) {
        const existingTransaction = await prisma.transaction.findUnique({ where: { id } });

        if (!existingTransaction) {
            throw new Error("Transaction not found");
        }

        return prisma.transaction.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus transaksi berdasarkan ID
    static async delete(id: number) {
        return prisma.transaction.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar transaksi dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.transaction.findMany({
            select: {
                id: true,
                user_id: true,
                rental_id: true,
                payment_status: true,
                transaction_date: true,
                payment_method: true,
                total_amount: true,
                local_image_path: true,
                created_at: true,
                updated_at: true,
                user: true,
                rental: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}
