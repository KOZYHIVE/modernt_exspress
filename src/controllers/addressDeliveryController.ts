// src/controllers/AddressDeliveryController.ts

import { Request, Response } from "express";
import {AddressDeliveryModel} from "../models/addressDeliveryModel";

class AddressDeliveryController {
    // Fungsi untuk membuat detail pengguna baru
    static async createAddressDelivery(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }

            const { full_name, address, phone} = req.body;

            if (!full_name || !address || !phone ) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const newAddressDelivery = await AddressDeliveryModel.create({
                user_id,
                full_name,
                address,
                phone,
            });

            res.status(201).json({ message: "Detail user created successfully", data: newAddressDelivery });
        } catch (error) {
            res.status(500).json({ error: "Failed to create detail user" });
        }
    }

    // Fungsi untuk mendapatkan detail pengguna berdasarkan ID
    static async getAddressDeliveryById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Detail user ID is required" });
            }

            const AddressDelivery = await AddressDeliveryModel.getById(Number(id));
            if (!AddressDelivery) {
                return res.status(404).json({ error: "Detail user not found" });
            }

            res.status(200).json({ message: "Detail user retrieved successfully", data: AddressDelivery });
        } catch (error) {
            console.error("Error retrieving detail user:", error);
            res.status(500).json({ error: "Failed to retrieve detail user" });
        }
    }

    static async updateAddressDelivery(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Rental ID is required" });
            }

            // Ambil data yang dikirim dalam body
            const { full_name, address, phone, gender, dob } = req.body;

            // Periksa apakah ada data yang dikirim untuk diperbarui
            const updateData: any = {};
            if (full_name) updateData.full_name = full_name;
            if (address) updateData.address = address;
            if (phone) updateData.phone = phone;

            // Jika tidak ada data yang dikirim, kembalikan error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: "No update data provided" });
            }

            // Periksa apakah detail pengguna sudah ada sebelum mengupdate
            const existingAddressDelivery = await AddressDeliveryModel.getById(Number(id));
            if (!existingAddressDelivery) {
                return res.status(404).json({ error: "User detail not found" });
            }

            // Update hanya data yang dikirim
            const updatedAddressDelivery = await AddressDeliveryModel.update(Number(id), updateData);

            res.status(200).json({ message: "Detail user updated successfully", data: updatedAddressDelivery });
        } catch (error) {
            console.error("Error updating detail user:", error);
            res.status(500).json({ error: "Failed to update detail user" });
        }
    }

    // Fungsi untuk menghapus detail pengguna berdasarkan ID
    static async deleteAddressDelivery(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Detail user ID is required" });
            }

            await AddressDeliveryModel.delete(Number(id));
            res.status(200).json({ message: "Detail user deleted successfully" });
        } catch (error) {
            console.error("Error deleting detail user:", error);
            res.status(500).json({ error: "Failed to delete detail user" });
        }
    }

    // Fungsi untuk mendapatkan daftar detail pengguna dengan paginasi
    static async getAddressDeliverys(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const AddressDeliverys = await AddressDeliveryModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                message: "Detail users retrieved successfully",
                data: AddressDeliverys,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving detail users:", error);
            res.status(500).json({ error: "Failed to retrieve detail users" });
        }
    }
}

export default AddressDeliveryController;