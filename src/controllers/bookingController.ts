// controllers/BookingController.ts

import { Request, Response } from "express";
import { BookingModel } from "../models/bookingModel";
import { VehicleModel } from "../models/vehicleModel";
import { uploadFile } from "../utils/upload_file";

class BookingController {
    // Fungsi untuk membuat booking baru
    static async createBooking(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }

            const {
                vehicle_id,
                start_date,
                end_date,
                delivery_location,
                rental_status,
                payment_proof,
            } = req.body;

            if (!vehicle_id || !start_date || !end_date || !delivery_location) {
                return res.status(400).json({ error: "User ID, vehicle ID, start date, end date, and delivery location are required" });
            }

            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (endDate <= startDate) {
                return res.status(400).json({ error: "End date must be after start date" });
            }

            const rental_period = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

            const vehicle = await VehicleModel.getById(Number(vehicle_id));
            if (!vehicle) {
                return res.status(404).json({ error: "Vehicle not found" });
            }

            const total_price = vehicle.rental_price * rental_period;

            const newBooking = await BookingModel.create({
                user_id,
                vehicle_id: Number(vehicle_id),
                rental_period,
                start_date: new Date(startDate),
                end_date: new Date(endDate),
                delivery_location: Number(delivery_location),
                rental_status,
                total_price,
                payment_proof,
            });

            res.status(201).json({ statusCode: 201, message: "Booking created successfully", data: newBooking });
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ error: "Failed to create booking" });
        }
    }

    // Fungsi untuk mendapatkan booking berdasarkan ID
    static async getBookingById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Booking ID is required" });
            }

            const booking = await BookingModel.getById(Number(id));
            if (!booking) {
                return res.status(404).json({ error: "Booking not found" });
            }

            res.status(200).json({ statusCode: 200, message: "Booking retrieved successfully", data: booking });
        } catch (error) {
            console.error("Error retrieving booking:", error);
            res.status(500).json({ error: "Failed to retrieve booking" });
        }
    }

    // Fungsi untuk mendapatkan booking berdasarkan user_id
    static async getBookingsByUserId(req: Request, res: Response) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const bookings = await BookingModel.getByUserId(Number(user_id));
            if (bookings.length === 0) {
                return res.status(404).json({ error: "No bookings found for this user" });
            }

            res.status(200).json({ statusCode: 200, message: "Bookings retrieved successfully", data: bookings });
        } catch (error) {
            console.error("Error retrieving bookings:", error);
            res.status(500).json({ error: "Failed to retrieve bookings" });
        }
    }

    // Fungsi untuk mendapatkan booking berdasarkan vehicle_id
    static async getBookingsByVehicleId(req: Request, res: Response) {
        try {
            const { vehicle_id } = req.params;

            if (!vehicle_id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            const bookings = await BookingModel.getByVehicleId(Number(vehicle_id));
            if (bookings.length === 0) {
                return res.status(404).json({ error: "No bookings found for this vehicle" });
            }

            res.status(200).json({ statusCode: 200, message: "Bookings retrieved successfully", data: bookings });
        } catch (error) {
            console.error("Error retrieving bookings:", error);
            res.status(500).json({ error: "Failed to retrieve bookings" });
        }
    }

    // Fungsi untuk memperbarui booking berdasarkan ID dengan role user

    static async updateBookingByIdRoleUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user_id = req.user?.userId;

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

            if (!id || !user_id) {
                return res.status(400).json({ error: "Booking ID and User ID are required" });
            }

            const updatedBooking = await BookingModel.updateByIdRoleUser(Number(id), Number(user_id), {
                secure_url_image: uploadResult.secure_url,
                public_url_image: uploadResult.url,
            });

            res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });
        } catch (error) {
            console.error("Error updating booking:", error);
            res.status(500).json({ error: "Failed to update booking" });
        }
    }
    // Fungsi untuk memperbarui booking berdasarkan ID dengan role admin

    static async updateBookingByIdRoleAdmin(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Booking ID is required" });
            }

            const {
                user_id,
                vehicle_id,
                rental_period,
                start_date,
                end_date,
                delivery_location,
                rental_status,
                payment_proof,
            } = req.body;

            const updatedBooking = await BookingModel.updateByIdRoleAdmin(Number(id), {
                user_id,
                vehicle_id,
                rental_period,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined,
                delivery_location,
                rental_status,
                payment_proof,
            });

            res.status(200).json({ statusCode: 200, message: "Booking updated successfully", data: updatedBooking });
        } catch (error) {
            console.error("Error updating booking:", error);
            res.status(500).json({ error: "Failed to update booking" });
        }
    }
    // Fungsi untuk menghapus booking berdasarkan ID

    static async deleteBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Booking ID is required" });
            }

            await BookingModel.delete(Number(id));
            res.status(200).json({ statusCode: 200, message: "Booking deleted successfully" });
        } catch (error) {
            console.error("Error deleting booking:", error);
            res.status(500).json({ error: "Failed to delete booking" });
        }
    }
    // Fungsi untuk mendapatkan daftar booking dengan paginasi

    static async getBookings(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const bookings = await BookingModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                statusCode: 200,
                message: "Bookings retrieved successfully",
                data: bookings,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve bookings" });
        }
    }
    // Fungsi untuk mendapatkan semua booking berdasarkan user_id dengan paginasi
    static async getAllByUser(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }

            const { page = 1, pagesize = 10 } = req.query;
            const skip = (Number(page) - 1) * Number(pagesize);

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found" });
            }

            const bookings = await BookingModel.getAllByUser({
                user_id: Number(user_id),
                itemsPerPage: Number(pagesize),
                skip,
            });

            res.status(200).json({
                message: "Bookings retrieved successfully",
                data: bookings,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving bookings:", error);
            res.status(500).json({ error: "Failed to retrieve bookings" });
        }
    }

    // Fungsi untuk mendapatkan booking berdasarkan ID dengan role user
    static async getBookingByIdRoleUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user_id = req.user?.userId;

            if (!id || !user_id) {
                return res.status(400).json({ error: "Booking ID and User ID are required" });
            }

            const booking = await BookingModel.getByIdRoleUser(Number(id), Number(user_id));
            if (!booking) {
                return res.status(404).json({ error: "Booking not found or unauthorized access" });
            }

            res.status(200).json({ statusCode: 200, message: "Booking retrieved successfully", data: booking });
        } catch (error) {
            console.error("Error retrieving booking:", error);
            res.status(500).json({ error: "Failed to retrieve booking" });
        }
    }
}

export default BookingController;