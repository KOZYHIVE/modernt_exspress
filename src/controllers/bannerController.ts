// controllers/BannerController.ts

import { Request, Response } from "express";
import { BannerModel } from "../models/bannerModel";
import {uploadFile} from "../utils/upload_file";

class BannerController {
    // Fungsi untuk membuat banner baru
    static async createBanner(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }
            const {
                vehicle_id,
                title,
                description,
            } = req.body;

            if ( !vehicle_id || !title || !description) {
                return res.status(400).json({ error: "User ID, vehicle ID, title, and description are required" });
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

            const newBanner = await BannerModel.create({
                user_id,
                vehicle_id: Number(vehicle_id),
                title,
                description,
                secure_url_image: uploadResult.secure_url,
                public_url_image: uploadResult.url,
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

    // Fungsi untuk mendapatkan banner berdasarkan user_id
    static async getBannersByUserId(req: Request, res: Response) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const banners = await BannerModel.getByUserId(Number(user_id));
            if (banners.length === 0) {
                return res.status(404).json({ error: "No banners found for this user" });
            }

            res.status(200).json({ message: "Banners retrieved successfully", data: banners });
        } catch (error) {
            console.error("Error retrieving banners:", error);
            res.status(500).json({ error: "Failed to retrieve banners" });
        }
    }

    // Fungsi untuk mendapatkan banner berdasarkan vehicle_id
    static async getBannersByVehicleId(req: Request, res: Response) {
        try {
            const { vehicle_id } = req.params;

            if (!vehicle_id) {
                return res.status(400).json({ error: "Vehicle ID is required" });
            }

            const banners = await BannerModel.getByVehicleId(Number(vehicle_id));
            if (banners.length === 0) {
                return res.status(404).json({ error: "No banners found for this vehicle" });
            }

            res.status(200).json({ message: "Banners retrieved successfully", data: banners });
        } catch (error) {
            console.error("Error retrieving banners:", error);
            res.status(500).json({ error: "Failed to retrieve banners" });
        }
    }

    // Fungsi untuk memperbarui banner berdasarkan ID
    static async updateBanner(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                user_id,
                vehicle_id,
                title,
                description
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Banner ID is required" });
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

            const updatedBanner = await BannerModel.update(Number(id), {
                user_id,
                vehicle_id,
                title,
                description,
                secure_url_image: uploadResult.secure_url,
                public_url_image: uploadResult.url,
            });

            res.status(200).json({ statusCode: 200, message: "Banner updated successfully", data: updatedBanner });
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
            res.status(200).json({ statusCode: 200, message: "Banner deleted successfully" });
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