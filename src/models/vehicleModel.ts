// models/VehicleModel.ts

import prisma from '../config/prisma';
import {Availability, VehicleType} from "@prisma/client";

export class VehicleModel {
    // Fungsi untuk membuat kendaraan baru
    static async create(data: {
        brand_id: number;
        vehicle_type: VehicleType;
        vehicle_name: string;
        rental_price: number;
        availability_status?: Availability;
        year: Date;
        seats: number;
        horse_power: number;
        description: string;
        specification_list: string;
        secure_url_image?: string;
        public_url_image?: string;
    }) {
        return prisma.vehicle.create({ data });
    }

    // Fungsi untuk mendapatkan kendaraan berdasarkan ID
    static async getById(id: number) {
        return prisma.vehicle.findUnique({
            where: { id },
            include: {
                brand: true,
                Booking: true,
                Banner: true,
            },
        });
    }

    // Fungsi untuk mendapatkan kendaraan berdasarkan brand_id
    static async getByBrandId(brand_id: number) {
        return prisma.vehicle.findMany({
            where: { brand_id },
            include: {
                brand: true,
                Booking: true,
                Banner: true,
            },
        });
    }

    // Fungsi untuk memperbarui kendaraan berdasarkan ID
    static async update(id: number, data: {
        brand_id?: number;
        vehicle_type?: VehicleType;
        vehicle_name?: string;
        rental_price?: number;
        availability_status?: Availability;
        year?: Date;
        seats?: number;
        horse_power?: number;
        description?: string;
        specification_list?: string;
        secure_url_image?: string;
        public_url_image?: string;
    }) {
        const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });

        if (!existingVehicle) {
            throw new Error("Vehicle not found");
        }

        return prisma.vehicle.update({
            where: { id },
            data,
        });
    }

    // Fungsi untuk menghapus kendaraan berdasarkan ID
    static async delete(id: number) {
        return prisma.vehicle.delete({ where: { id } });
    }

    // Fungsi untuk mendapatkan daftar kendaraan dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.vehicle.findMany({
            select: {
                id: true,
                brand_id: true,
                vehicle_type: true,
                vehicle_name: true,
                rental_price: true,
                availability_status: true,
                year: true,
                seats: true,
                horse_power: true,
                description: true,
                specification_list: true,
                secure_url_image: true,
                public_url_image: true,
                created_at: true,
                updated_at: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }

    // Fungsi untuk mencari kendaraan berdasarkan kriteria
    static async search(payload: {
        query?: string;
        vehicle_type?: VehicleType;
        brand_id?: number;
        availability_status?: Availability;
        itemsPerPage: number;
        skip: number;
    }) {
        const { query, vehicle_type, brand_id, availability_status, itemsPerPage, skip } = payload;

        const whereClause = {
            AND: [
                query ? {
                    OR: [
                        { vehicle_name: { contains: query, lte: 'insensitive' } },
                        { description: { contains: query, lte: 'insensitive' } },
                        { specification_list: { contains: query, lte: 'insensitive' } },
                    ],
                } : {},
                vehicle_type ? { vehicle_type } : {},
                brand_id ? { brand_id } : {},
                availability_status ? { availability_status } : {},
            ],
        };

        console.log("Search Payload:", payload);
        console.log("Where Clause:", whereClause);

        const vehicles = await prisma.vehicle.findMany({
            where: whereClause,
            include: {
                brand: true,
                Booking: true,
                Banner: true,
            },
            skip,
            take: itemsPerPage,
        });

        console.log("Search Results:", vehicles);

        return vehicles;
    }
}