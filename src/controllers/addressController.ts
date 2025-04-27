// controllers/AddressController.ts

import { Request, Response } from "express";
import { AddressModel } from "../models/addressModel";

class AddressController {
    // Fungsi untuk membuat alamat baru
    static async createAddress(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }

            const { full_name, address, phone, url_maps } = req.body;

            if (!user_id || !full_name || !address) {
                return res.status(400).json({ statusCode: 400, error: "User ID, full name, and address are required" });
            }

            const newAddress = await AddressModel.create({
                user_id,
                full_name,
                address,
                phone,
                url_maps,
            });

            res.status(201).json({ statusCode: 201, message: "Address created successfully", data: newAddress });
        } catch (error) {
            console.error("Error creating address:", error);
            res.status(500).json({ statusCode: 500, error: "Failed to create address" });
        }
    }

    // Fungsi untuk mendapatkan alamat berdasarkan ID
    static async getAddressById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ statusCode: 400, error: "Address ID is required" });
            }

            const address = await AddressModel.getById(Number(id));
            if (!address) {
                return res.status(404).json({ statusCode: 400, error: "Address not found" });
            }

            res.status(200).json({ statusCode: 200, message: "Address retrieved successfully", data: address });
        } catch (error) {
            console.error("Error retrieving address:", error);
            res.status(500).json({ error: "Failed to retrieve address" });
        }
    }

    // Fungsi untuk mendapatkan alamat berdasarkan user_id
    static async getAddressesByUserId(req: Request, res: Response) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).json({ statusCode: 400, error: "User ID is required" });
            }

            const addresses = await AddressModel.getByUserId(Number(user_id));
            if (addresses.length === 0) {
                return res.status(404).json({ statusCode: 400, error: "No addresses found for this user" });
            }

            res.status(200).json({ statusCode: 200, message: "Addresses retrieved successfully", data: addresses });
        } catch (error) {
            console.error("Error retrieving addresses:", error);
            res.status(500).json({ error: "Failed to retrieve addresses" });
        }
    }

    // Fungsi untuk memperbarui alamat berdasarkan ID
    static async updateAddress(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ statusCode: 401, error: "Unauthorized: User ID not found in token" });
            }
            const { full_name, address, phone, url_maps } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Address ID is required" });
            }

            const updatedAddress = await AddressModel.update(Number(id), {
                user_id,
                full_name,
                address,
                phone,
                url_maps,
            });

            res.status(200).json({ statusCode: 200, message: "Address updated successfully", data: updatedAddress });
        } catch (error) {
            console.error("Error updating address:", error);
            res.status(500).json({ error: "Failed to update address" });
        }
    }

    // Fungsi untuk menghapus alamat berdasarkan ID
    static async deleteAddress(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ statusCode: 401, error: "Address ID is required" });
            }

            await AddressModel.delete(Number(id));
            res.status(200).json({ statusCode: 200, message: "Address deleted successfully" });
        } catch (error) {
            console.error("Error deleting address:", error);
            res.status(500).json({ error: "Failed to delete address" });
        }
    }

    // Fungsi untuk mendapatkan daftar alamat dengan paginasi
    static async getAddresses(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const addresses = await AddressModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                statusCode: 200,
                message: "Addresses retrieved successfully",
                data: addresses,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving addresses:", error);
            res.status(500).json({ statusCode: 500, error: "Failed to retrieve addresses" });
        }
    }
}

export default AddressController;