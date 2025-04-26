import prisma from '../config/prisma';
import {RentalStatus} from "@prisma/client";

export class RentalModel {
    // Fungsi untuk membuat rental baru
    static async create(data: {
        user_id: number;
        vehicle_id: number;
        start_date: Date;
        end_date: Date;
        delivery_location_id: number;
        rental_status: RentalStatus;
        total_price: number;
    }) {
        return prisma.rental.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan rental berdasarkan ID
    static async getById(id: number) {
        return prisma.rental.findUnique({
            where: { id },
            include: { vehicle: true, transaction: true },
        });
    }

    // Fungsi untuk memperbarui rental berdasarkan ID
    // @ts-ignore
    static async update(id: number, data: Partial<Omit<typeof data, "id">>) {
        const existingRental = await prisma.rental.findUnique({ where: { id } });

        if (!existingRental) {
            throw new Error("Rental not found");
        }

        return prisma.rental.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus rental berdasarkan ID
    static async delete(id: number) {
        return prisma.rental.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar rental dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.rental.findMany({
            select: {
                id: true,
                vehicle_id: true,
                start_date: true,
                end_date: true,
                delivery_location: true,
                rental_status: true,
                total_price: true,
                created_at: true,
                updated_at: true,
                vehicle: true,
                transaction: true,
                user_id : true
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}
