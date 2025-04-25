// controllers/BannerController.ts

import { Request, Response } from "express";
import { BannerModel } from "../models/bannerModel";


class BannerController {
    // Fungsi untuk membuat banner baru dengan upload gambar
    static async createBanner(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }
            const { description } = req.body;
            const image = req.file; // File yang di-upload

            if (!user_id || !description ) {
                return res.status(400).json({ error: "User ID and description are required" });
            }

            // Simpan path gambar jika ada
            const local_image_path = image ? `images/${image.filename}` : undefined;

            const newBanner = await BannerModel.create({
                user_id: Number(user_id),
                description,
                local_image_path,
            });

            res.status(201).json({ message: "Banner created successfully", data: newBanner });
        } catch (error) {
            console.error("Error creating banner:", error);
            res.status(500).json({ error: "Failed to create banner" });
        }
    }

    // Fungsi untuk mendapatkan banner berdasarkan ID
    static async getBannerById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Banner ID is required" });
            }

            const banner = await BannerModel.getById(Number(id));
            if (!banner) {
                return res.status(404).json({ error: "Banner not found" });
            }

            res.status(200).json({ message: "Banner retrieved successfully", data: banner });
        } catch (error) {
            console.error("Error retrieving banner:", error);
            res.status(500).json({ error: "Failed to retrieve banner" });
        }
    }

    // Fungsi untuk memperbarui banner berdasarkan ID
    static async updateBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { description } = req.body;
            const image = req.file; // File yang di-upload

            if (!id) {
                return res.status(400).json({ error: "Banner ID is required" });
            }

            // Simpan path gambar jika ada perubahan
            const local_image_path = image ? `images/${image.filename}` : undefined;

            const updatedBanner = await BannerModel.update(Number(id), {
                description,
                local_image_path,
            });

            res.status(200).json({ message: "Banner updated successfully", data: updatedBanner });
        } catch (error) {
            console.error("Error updating banner:", error);
            res.status(500).json({ error: "Failed to update banner" });
        }
    }

    // Fungsi untuk menghapus banner berdasarkan ID
    static async deleteBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Banner ID is required" });
            }

            await BannerModel.delete(Number(id));
            res.status(200).json({ message: "Banner deleted successfully" });
        } catch (error) {
            console.error("Error deleting banner:", error);
            res.status(500).json({ error: "Failed to delete banner" });
        }
    }

    // Fungsi untuk mendapatkan daftar banner dengan paginasi
    static async getBanners(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const banners = await BannerModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                message: "Banners retrieved successfully",
                data: banners,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving banners:", error);
            res.status(500).json({ error: "Failed to retrieve banners" });
        }
    }
}

export default BannerController;
