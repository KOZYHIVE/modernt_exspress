// controllers/BrandController.ts

import { Request, Response } from "express";
import { BrandModel } from "../models/brandModel";
import {uploadFile} from "../utils/upload_file";

class BrandController {
    // Fungsi untuk membuat brand baru
    static async createBrand(req: Request, res: Response) {
        try {
            const { brand_name } = req.body;
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

            if (!brand_name) {
                return res.status(400).json({ error: "Brand name is required" });
            }

            const newBrand = await BrandModel.create({ brand_name, public_url_image: uploadResult.url, secure_url_image: uploadResult.secure_url });

            res.status(201).json({ message: "Brand created successfully", data: newBrand });
        } catch (error) {
            console.error("Error creating brand:", error);
            res.status(500).json({ error: "Failed to create brand" });
        }
    }
    // Fungsi untuk mendapatkan brand berdasarkan ID
    static async getBrandById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Brand ID is required" });
            }

            const brand = await BrandModel.getById(Number(id));
            if (!brand) {
                return res.status(404).json({ error: "Brand not found" });
            }

            res.status(200).json({ message: "Brand retrieved successfully", data: brand });
        } catch (error) {
            console.error("Error retrieving brand:", error);
            res.status(500).json({ error: "Failed to retrieve brand" });
        }
    }

    // Fungsi untuk memperbarui brand berdasarkan ID
    static async updateBrand(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { brand_name } = req.body;
            const image = req.file; // File yang di-upload
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
            if (!id) {
                return res.status(400).json({ error: "Brand ID is required" });
            }


            const updatedBrand = await BrandModel.update(Number(id), { brand_name, public_url_image: uploadResult.url, secure_url_image: uploadResult.secure_url });

            res.status(200).json({ message: "Brand updated successfully", data: updatedBrand });
        } catch (error) {
            console.error("Error updating brand:", error);
            res.status(500).json({ error: "Failed to update brand" });
        }
    }

    // Fungsi untuk menghapus brand berdasarkan ID
    static async deleteBrand(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Brand ID is required" });
            }

            await BrandModel.delete(Number(id));
            res.status(200).json({ message: "Brand deleted successfully" });
        } catch (error) {
            console.error("Error deleting brand:", error);
            res.status(500).json({ error: "Failed to delete brand" });
        }
    }

    // Fungsi untuk mendapatkan daftar brand dengan paginasi
    static async getBrands(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const brands = await BrandModel.getAll({ itemsPerPage: take, skip });
            res.status(200).json({
                message: "Brands retrieved successfully",
                data: brands,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving brands:", error);
            res.status(500).json({ error: "Failed to retrieve brands" });
        }
    }
}

export default BrandController;
