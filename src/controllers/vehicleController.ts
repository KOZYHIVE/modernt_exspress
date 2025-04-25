// controllers/VehicleController.ts

import { Request, Response } from "express";
import { VehicleModel } from "../models/vehicleModel";

class VehicleController {
    // Fungsi untuk membuat kendaraan baru
    static async createVehicle(req: Request, res: Response) {
        try {
            const { brand_id, vehicle_type, vehicle_name, rental_price, year, seats, horse_power, description, specification_list } = req.body;
            const image = req.file; // File yang di-upload

            if (!brand_id || !vehicle_type || !vehicle_name || !rental_price || !year || !seats || !horse_power || !description || !specification_list) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            // Konversi tipe data dari string ke number
            const newVehicle = await VehicleModel.create({
                brand_id: Number(brand_id),
                vehicle_type,
                vehicle_name,
                rental_price: Number(rental_price),
                availability_status: "available",
                year: new Date(`${year}-01-01`), // Konversi ke format DateTime
                seats: Number(seats),
                horse_power: Number(horse_power),
                description,
                specification_list: Array.isArray(specification_list) ? specification_list.join(",") : specification_list,
                local_image_path: image ? `images/${image.filename}` : undefined,
            });

            res.status(201).json({ message: "Vehicle created successfully", data: newVehicle });
        } catch (error) {
            console.error("Error creating vehicle:", error);
            res.status(500).json({ error: "Failed to create vehicle" });
        }
    }

    // Fungsi untuk mendapatkan kendaraan berdasarkan ID
    static async getVehicleById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            const vehicle = await VehicleModel.getById(Number(id));

            if (!vehicle) {
                return res.status(404).json({ error: "Vehicle not found" });
            }

            // Buat objek baru agar tidak mengubah tipe asli dari Prisma
            const modifiedVehicle = {
                ...vehicle,
                specification_list: vehicle.specification_list.split(",").map(Number),
            };

            res.status(200).json({ message: "Vehicle retrieved successfully", data: modifiedVehicle });
        } catch (error) {
            console.error("Error retrieving vehicle:", error);
            res.status(500).json({ error: "Failed to retrieve vehicle" });
        }
    }

    // Fungsi untuk memperbarui kendaraan berdasarkan ID
    static async updateVehicle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            const updatedVehicle = await VehicleModel.update(Number(id), data);

            res.status(200).json({ message: "Vehicle updated successfully", data: updatedVehicle });
        } catch (error) {
            console.error("Error updating vehicle:", error);
            res.status(500).json({ error: "Failed to update vehicle" });
        }
    }

    // Fungsi untuk menghapus kendaraan berdasarkan ID
    static async deleteVehicle(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            await VehicleModel.delete(Number(id));
            res.status(200).json({ message: "Vehicle deleted successfully" });
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            res.status(500).json({ error: "Failed to delete vehicle" });
        }
    }

    // Fungsi untuk mendapatkan daftar kendaraan dengan paginasi
    static async getVehicles(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const vehicles = await VehicleModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                message: "Vehicles retrieved successfully",
                data: vehicles,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving vehicles:", error);
            res.status(500).json({ error: "Failed to retrieve vehicles" });
        }
    }
}

export default VehicleController;
