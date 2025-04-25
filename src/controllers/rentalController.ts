import { Request, Response } from "express";
import { RentalModel } from "../models/rentalModel";
import { RentalStatus } from "@prisma/client";

class RentalController {
    // Fungsi untuk membuat rental baru
    static async createRental(req: Request, res: Response) {
        try {
            const { vehicle_id, start_date, end_date, delivery_location, rental_status, total_price } = req.body;

            // Validasi input
            if (!vehicle_id || !start_date || !end_date || !delivery_location || !total_price) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            // Pastikan rental_status valid atau gunakan default
            const status = rental_status ? rental_status as RentalStatus : RentalStatus.pending;

            const newRental = await RentalModel.create({
                vehicle_id: Number(vehicle_id),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                delivery_location,
                rental_status: status,
                total_price: Number(total_price),
            });

            res.status(201).json({ message: "Rental created successfully", data: newRental });
        } catch (error) {
            console.error("Error creating rental:", error);
            res.status(500).json({ error: "Failed to create rental" });
        }
    }

    // Fungsi untuk mendapatkan rental berdasarkan ID
    static async getRentalById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Rental ID is required" });
            }

            const rental = await RentalModel.getById(Number(id));

            if (!rental) {
                return res.status(404).json({ error: "Rental not found" });
            }

            res.status(200).json({ message: "Rental retrieved successfully", data: rental });
        } catch (error) {
            console.error("Error retrieving rental:", error);
            res.status(500).json({ error: "Failed to retrieve rental" });
        }
    }

    // Fungsi untuk memperbarui rental berdasarkan ID
    static async updateRental(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id) {
                return res.status(400).json({ error: "Rental ID is required" });
            }

            if (data.rental_status && !(data.rental_status in RentalStatus)) {
                return res.status(400).json({ error: "Invalid rental status" });
            }

            const updatedRental = await RentalModel.update(Number(id), data);

            res.status(200).json({ message: "Rental updated successfully", data: updatedRental });
        } catch (error) {
            console.error("Error updating rental:", error);
            res.status(500).json({ error: "Failed to update rental" });
        }
    }

    // Fungsi untuk menghapus rental berdasarkan ID
    static async deleteRental(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Rental ID is required" });
            }

            await RentalModel.delete(Number(id));
            res.status(200).json({ message: "Rental deleted successfully" });
        } catch (error) {
            console.error("Error deleting rental:", error);
            res.status(500).json({ error: "Failed to delete rental" });
        }
    }

    // Fungsi untuk mendapatkan daftar rental dengan paginasi
    static async getRentals(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const rentals = await RentalModel.getAll({ itemsPerPage: take, skip });

            res.status(200).json({
                message: "Rentals retrieved successfully",
                data: rentals,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving rentals:", error);
            res.status(500).json({ error: "Failed to retrieve rentals" });
        }
    }
}

export default RentalController;
