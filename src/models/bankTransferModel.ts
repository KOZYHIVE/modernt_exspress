import prisma from '../config/prisma';

export class BankTransferModel {
    static async create(
        data: {
            user_id: number;
            name_bank: string;
            number: string;
        }){
        return prisma.bankTransfer.create({data})
    }

    static async update(
        id: number,
        data: {
            user_id: number;
            name_bank: string;
            number: string;
        }) {
        // Periksa apakah record ada sebelum update
        const existingBankTransfer = await prisma.bankTransfer.findUnique({where: {id}});

        if (!existingBankTransfer) {
            throw new Error("Bank transfer not found");
        }

        return prisma.bankTransfer.update({
            where: {id},
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus brand berdasarkan ID
    static async delete(id: number) {
        return prisma.bankTransfer.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar bank dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.bankTransfer.findMany({
            select: {
                id: true,
                name_bank: true,
                number: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}