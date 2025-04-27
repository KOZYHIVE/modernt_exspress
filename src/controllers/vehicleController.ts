// controllers/VehicleController.ts

import { Request, Response } from "express";
import { VehicleModel } from "../models/vehicleModel";
import {uploadFile} from "../utils/upload_file";
import {Availability, VehicleType} from "@prisma/client";

class VehicleController {
    // Fungsi untuk membuat kendaraan baru
    static async createVehicle(req: Request, res: Response) {
        try {
            const {
                brand_id,
                vehicle_type,
                vehicle_name,
                rental_price,
                availability_status,
                year,
                seats,
                horse_power,
                description,
                specification_list,
            } = req.body;
            const image = req.file;

            if (!brand_id || !vehicle_type || !vehicle_name || !rental_price || !year || !seats || !horse_power || !description || !specification_list) {
                return res.status(400).json({ error: "Brand ID, vehicle type, vehicle name, rental price, year, seats, horse power, description, and specification list are required" });
            }

            let uploadResult;
            if (image && image.buffer) {
                uploadResult = await uploadFile({
                    fileBuffer: image.buffer,
                    filename: image.filename,
                    mimeType: image.mimetype,
                });
            }

            if(!uploadResult) {
                return res.status(500).json({ error: "Unauthorized: Image not uploaded" });
            }

            const newVehicle = await VehicleModel.create({
                brand_id : Number(brand_id),
                vehicle_type,
                vehicle_name,
                rental_price: Number(rental_price),
                availability_status,
                year: new Date(year),
                seats: Number(seats),
                horse_power: Number(horse_power),
                description,
                specification_list,
                secure_url_image: uploadResult.secure_url,
                public_url_image: uploadResult.url,
            });

            res.status(201).json({ statusCode: 201, message: "Vehicle created successfully", data: newVehicle });
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

            res.status(200).json({ statusCode: 200, message: "Vehicle retrieved successfully", data: vehicle });
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve vehicle" });
        }
    }

    // Fungsi untuk mendapatkan kendaraan berdasarkan brand_id
    static async getVehiclesByBrandId(req: Request, res: Response) {
        try {
            const { brand_id } = req.params;

            if (!brand_id) {
                return res.status(400).json({ error: "Brand ID is required" });
            }

            const vehicles = await VehicleModel.getByBrandId(Number(brand_id));
            if (vehicles.length === 0) {
                return res.status(404).json({ error: "No vehicles found for this brand" });
            }

            res.status(200).json({ statusCode: 200, message: "Vehicles retrieved successfully", data: vehicles });
        } catch (error) {
            console.error("Error retrieving vehicles:", error);
            res.status(500).json({ error: "Failed to retrieve vehicles" });
        }
    }

    // Fungsi untuk memperbarui kendaraan berdasarkan ID
    static async updateVehicle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                brand_id,
                vehicle_type,
                vehicle_name,
                rental_price,
                availability_status,
                year,
                seats,
                horse_power,
                description,
                specification_list,
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            const image = req.file;
            let uploadResult;
            if (image && image.buffer) {
                uploadResult = await uploadFile({
                    fileBuffer: image.buffer,
                    filename: image.filename,
                    mimeType: image.mimetype,
                });
            }

            if(!uploadResult) {
                return res.status(500).json({ error: "Unauthorized: Image not uploaded" });
            }

            const updatedVehicle = await VehicleModel.update(Number(id), {
                brand_id : Number(brand_id),
                vehicle_type,
                vehicle_name,
                rental_price: Number(rental_price),
                availability_status,
                year: new Date(year),
                seats: Number(seats),
                horse_power: Number(horse_power),
                description,
                specification_list,
                secure_url_image: uploadResult.secure_url,
                public_url_image: uploadResult.url,
            });

            res.status(200).json({ statusCode: 200, message: "Vehicle updated successfully", data: updatedVehicle });
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
            res.status(200).json({ statusCode: 200, message: "Vehicle deleted successfully" });
        } catch (error) {
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
                statusCode: 200,
                message: "Vehicles retrieved successfully",
                data: vehicles,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve vehicles" });
        }
    }

    static async searchVehicles(req: Request, res: Response) {
        try {
            const { query, vehicle_type, brand_id, availability_status, page = 1, pagesize = 10 } = req.query;
            const skip = (Number(page) - 1) * Number(pagesize);

            // Ensure query is a string and remove double quotes if present
            let cleanQuery: string | undefined;
            if (typeof query === 'string') {
                cleanQuery = query.replace(/^"|"$/g, '');
            } else {
                cleanQuery = undefined;
            }

            const vehicles = await VehicleModel.search({
                query: cleanQuery,
                vehicle_type: vehicle_type as VehicleType,
                brand_id: brand_id ? Number(brand_id) : undefined,
                availability_status: availability_status as Availability,
                itemsPerPage: Number(pagesize),
                skip,
            });

            res.status(200).json({
                statusCode: 200,
                message: "Vehicles retrieved successfully",
                data: vehicles,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to search vehicles" });
        }
    }
}

export default VehicleController;