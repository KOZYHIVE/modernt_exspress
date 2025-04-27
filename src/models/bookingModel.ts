// models/BookingModel.ts

import prisma from '../config/prisma';
import {BankTransfer, PaymentStatus, RentalStatus} from '@prisma/client';

export class BookingModel {
    // Fungsi untuk membuat booking baru
    static async create(data: {
        user_id: number;
        vehicle_id: number;
        rental_period: number;
        start_date: Date;
        end_date: Date;
        delivery_location: number;
        rental_status?: RentalStatus;
        notes?: string;
        bank_transfer: number;
        total_price: number;
        secure_url_image?: string;
        public_url_image?: string;
        payment_proof?: PaymentStatus;
    }) {
        return prisma.booking.create({ data });
    }

    // Fungsi untuk mendapatkan booking berdasarkan ID
    static async getById(id: number) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                user: true,
                vehicle: true,
                delivery: true,
            },
        });
    }

    // Fungsi untuk mendapatkan booking berdasarkan user_id
    static async getByUserId(user_id: number) {
        return prisma.booking.findMany({
            where: { user_id },
            include: {
                user: true,
                vehicle: true,
                delivery: true,
                bank: true,
            },
        });
    }

    // Fungsi untuk mendapatkan booking berdasarkan vehicle_id
    static async getByVehicleId(vehicle_id: number) {
        return prisma.booking.findMany({
            where: { vehicle_id },
            include: {
                user: true,
                vehicle: true,
                delivery: true,
                bank: true,
            },
        });
    }

    // Fungsi untuk mendapatkan booking berdasarkan ID dengan role user
    static async getByIdRoleUser(id: number, user_id: number) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                user: true,
                vehicle: true,
                delivery: true,
                bank: true,
            },
        }).then((booking) => {
            if (!booking || booking.user_id !== user_id) {
                throw new Error("Booking not found or unauthorized access");
            }
            return booking;
        });
    }

    // Fungsi untuk memperbarui booking berdasarkan ID dengan role user
    static async updateByIdRoleUser(id: number, user_id: number, data: {
        secure_url_image?: string;
        public_url_image?: string;
    }) {
        const existingBooking = await prisma.booking.findUnique({ where: { id } });

        if (!existingBooking || existingBooking.user_id !== user_id) {
            throw new Error("Booking not found or unauthorized access");
        }

        return prisma.booking.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk memperbarui booking berdasarkan ID dengan role admin
    static async updateByIdRoleAdmin(id: number, data: {
        user_id?: number;
        vehicle_id?: number;
        rental_period?: number;
        start_date?: Date;
        end_date?: Date;
        delivery_location?: number;
        rental_status?: RentalStatus;
        total_price?: number;
        bank_transfer?: number;
        secure_url_image?: string;
        public_url_image?: string;
        payment_proof?: PaymentStatus;
    }) {
        const existingBooking = await prisma.booking.findUnique({ where: { id } });

        if (!existingBooking) {
            throw new Error("Booking not found");
        }

        return prisma.booking.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk menghapus booking berdasarkan ID
    static async delete(id: number) {
        return prisma.booking.delete({ where: { id } });
    }

    // Fungsi untuk mendapatkan daftar booking dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.booking.findMany({
            select: {
                id: true,
                user_id: true,
                vehicle_id: true,
                rental_period: true,
                start_date: true,
                end_date: true,
                delivery_location: true,
                rental_status: true,
                total_price: true,
                bank_transfer: true,
                secure_url_image: true,
                public_url_image: true,
                payment_proof: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }

    // Fungsi untuk mendapatkan daftar booking berdasarkan user_id dengan paginasi
    static async getAllByUser(payload: { user_id: number; itemsPerPage: number; skip: number }) {
        const { user_id, itemsPerPage, skip } = payload;

        return prisma.booking.findMany({
            where: { user_id },
            include: {
                user: true,
                vehicle: true,
                delivery: true,
                bank: true,
            },
            skip,
            take: itemsPerPage,
        });
    }
}