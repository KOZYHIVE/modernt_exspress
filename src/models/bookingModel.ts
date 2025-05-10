// models/BookingModel.ts

import prisma from '../config/prisma';
import {BankTransfer, PaymentStatus, RentalStatus} from '@prisma/client';

export class BookingModel {
    // Fungsi untuk membuat booking baru
    // static async create(data: {
    //     user_id: number;
    //     vehicle_id: number;
    //     rental_period: number;
    //     start_date: Date;
    //     end_date: Date;
    //     delivery_location: number;
    //     rental_status?: RentalStatus;
    //     notes?: string;
    //     bank_transfer: number;
    //     total_price: number;
    //     secure_url_image?: string;
    //     public_url_image?: string;
    //     payment_proof?: PaymentStatus;
    // }) {
    //     return prisma.booking.create({ data });
    // }

    static async create(data: {
        user_id: number;
        vehicle_id: number;
        rental_period: number;
        start_date: Date;
        end_date: Date;
        delivery_location: number;
        rental_status?: RentalStatus;
        notes?: string;
        bank_transfer: number; // Pastikan ini adalah foreign key ke BankTransfer
        total_price: number;
        secure_url_image?: string;
        public_url_image?: string;
        payment_proof?: PaymentStatus;
    }) {
        // Membuat booking baru di database
        const booking = await prisma.booking.create({
            data,
            include: {
                vehicle: { // Memuat nama kendaraan
                    select: {
                        vehicle_name: true,
                    },
                },
                bank: { // Memuat informasi bank
                    select: {
                        name_bank: true,
                        number: true,
                    },
                },
            },
        });

        return {
            booking_id: booking.id,
            vehicle_name: booking.vehicle?.vehicle_name || 'Unknown Vehicle',
            date_range: `${booking.start_date.toISOString().split('T')[0]} - ${booking.end_date.toISOString().split('T')[0]}`,
            rental_period: booking.rental_period,
            total_price: booking.total_price,
            name_bank: booking.bank?.name_bank || 'Unknown Bank',
            number: booking.bank?.number || 'Unknown Number',
        };
    }

    // Fungsi untuk mendapatkan booking berdasarkan ID
    static async getById(id: number) {
        try {
            // Mengambil data booking berdasarkan ID dengan relasi lengkap
            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    user: true,
                    vehicle: true,
                    delivery: true,
                    bank: true,
                },
            });

            // Jika data booking tidak ditemukan
            if (!booking) {
                return {
                    success: false,
                    data: null,
                    message: 'Booking tidak ditemukan',
                };
            }

            // Memformat data agar sesuai dengan output yang diinginkan
            const formattedBooking = {
                booking_id: booking.id,
                user_id: booking.user_id,
                vehicle_id: booking.vehicle_id,
                rental_period: booking.rental_period,
                start_date: booking.start_date,
                end_date: booking.end_date,
                delivery_location: booking.delivery_location,
                rental_status: booking.rental_status,
                total_price: booking.total_price,
                secure_url_image: booking.secure_url_image,
                public_url_image: booking.public_url_image,
                payment_proof: booking.payment_proof,
                bank_transfer: booking.bank_transfer,
                notes: booking.notes,
                created_at: booking.created_at,
                updated_at: booking.updated_at,
                user: {
                    id: booking.user.id,
                    username: booking.user.username,
                    full_name: booking.user.full_name,
                    email: booking.user.email,
                    role: booking.user.role,
                    status: booking.user.status,
                },
                vehicle: {
                    vehicle_id: booking.vehicle.id,
                    brand_id: booking.vehicle.brand_id,
                    vehicle_type: booking.vehicle.vehicle_type,
                    vehicle_name: booking.vehicle.vehicle_name,
                    rental_price: booking.vehicle.rental_price,
                    availability_status: booking.vehicle.availability_status,
                    year: booking.vehicle.year,
                    seats: booking.vehicle.seats,
                    horse_power: booking.vehicle.horse_power,
                    description: booking.vehicle.description,
                    specification_list: booking.vehicle.specification_list,
                    secure_url_image: booking.vehicle.secure_url_image,
                    public_url_image: booking.vehicle.public_url_image,
                },
                delivery: {
                    delivery_id: booking.delivery.id,
                    user_id: booking.delivery.user_id,
                    full_name: booking.delivery.full_name,
                    address: booking.delivery.address,
                    phone: booking.delivery.phone,
                    full_address: booking.delivery.full_address,
                    latitude: booking.delivery.latitude,
                    longitude: booking.delivery.longitude,
                },
                bank: {
                    id: booking.bank.id,
                    name_bank: booking.bank.name_bank,
                    number: booking.bank.number,
                },
            };

            return {
                success: true,
                data: formattedBooking,
                message: 'Data booking berhasil diambil',
            };
        } catch (error) {
            console.error('Error fetching booking by ID:', error);
            return {
                success: false,
                data: null,
                message: 'Terjadi kesalahan saat mengambil data booking',
            };
        }
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

    // Fungsi untuk mendapatkan semua daftar booking dengan paginasi
    static async getAllBookings(payload: { itemsPerPage: number; skip: number }) {
        const { itemsPerPage, skip } = payload;

        try {
            // Mengambil semua data booking dengan relasi yang sesuai
            const bookings = await prisma.booking.findMany({
                include: {
                    vehicle: true,
                    delivery: true, // Mengambil alamat pengiriman dari Address
                    bank: true,
                },
                skip,
                take: itemsPerPage,
            });

            // Memformat data agar sesuai dengan kebutuhan respons JSON
            const formattedBookings = bookings.map(booking => ({
                booking_id: booking.id,
                vehicle_id: booking.vehicle.id,
                rental_period: booking.rental_period,
                start_date: booking.start_date,
                end_date: booking.end_date,
                total_price: booking.total_price,
                rental_status: booking.rental_status,
                delivery: {
                    full_name: booking.delivery?.full_name,
                    phone: booking.delivery?.phone,
                    full_address: booking.delivery?.full_address,
                    latitude: booking.delivery?.latitude,
                    longitude: booking.delivery?.longitude,
                },
            }));

            return {
                success: true,
                data: formattedBookings,
                message: 'Semua data booking berhasil diambil',
            };
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                success: false,
                data: null,
                message: 'Terjadi kesalahan saat mengambil data booking',
            };
        }
    }

    // Fungsi untuk mendapatkan daftar booking berdasarkan user_id dengan paginasi
    static async getAllByUser(payload: { user_id: number; itemsPerPage: number; skip: number }) {
        const { user_id, itemsPerPage, skip } = payload;

        try {
            // Mengambil data booking dengan relasi ke Address yang sesuai dengan model Booking
            const bookings = await prisma.booking.findMany({
                where: { user_id },
                include: {
                    vehicle: true,
                    delivery: true,
                    bank: true,
                },
                skip,
                take: itemsPerPage,
            });

            // Memformat data agar sesuai dengan kebutuhan respons JSON
            const formattedBookings = bookings.map(booking => ({
                booking_id: booking.id,
                vehicle_id: booking.vehicle.id,
                rental_period: booking.rental_period,
                start_date: booking.start_date,
                end_date: booking.end_date,
                total_price: booking.total_price,
                rental_status: booking.rental_status,
                delivery: {
                    user_id: booking.delivery?.user_id,
                    full_name: booking.delivery?.full_name,
                    phone: booking.delivery?.phone,
                    full_address: booking.delivery?.full_address,
                    latitude: booking.delivery?.latitude,
                    longitude: booking.delivery?.longitude,
                },
            }));

            return {
                success: true,
                data: formattedBookings,
                message: 'Data booking berhasil diambil',
            };
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                success: false,
                data: null,
                message: 'Terjadi kesalahan saat mengambil data booking',
            };
        }
    }
}