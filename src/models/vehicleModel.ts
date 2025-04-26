import prisma from '../config/prisma';

export class VehicleModel {
    // Fungsi untuk membuat kendaraan baru
    static async create(data: {
        brand_id: number;
        vehicle_type: "motorcycle" | "car";
        vehicle_name: string;
        rental_price: number;
        availability_status?: "available" | "rented" | "inactive";
        year: Date;
        seats: number;
        horse_power: number;
        description: string;
        specification_list: string;
        secure_url_image: string;
        public_url_image: string;
    }) {
        return prisma.vehicle.create({
            data,
        });
    }

    // Fungsi untuk mendapatkan kendaraan berdasarkan ID
    static async getById(id: number) {
        return prisma.vehicle.findUnique({
            where: { id },
            include: { brand: true, vehicle_specifications: true, rental: true },
        });
    }

    // Fungsi untuk memperbarui kendaraan berdasarkan ID
    // @ts-ignore
    static async update(id: number, data: {
        brand_id?: number;
        vehicle_type?: "motorcycle" | "car";
        vehicle_name?: string;
        rental_price?: number;
        availability_status?: "available" | "rented" | "inactive";
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
            data: {
                ...data,
            },
        });
    }

    // Fungsi untuk menghapus kendaraan berdasarkan ID
    static async delete(id: number) {
        return prisma.vehicle.delete({
            where: { id },
        });
    }

    // Fungsi untuk mendapatkan daftar kendaraan dengan paginasi
    static async getAll(payload: { itemsPerPage: number; skip: number }) {
        return prisma.vehicle.findMany({
            select: {
                id: true,
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
                brand: true,
                vehicle_specifications: true,
                rental: true,
            },
            skip: payload.skip,
            take: payload.itemsPerPage,
        });
    }
}
