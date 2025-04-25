// routes/brandRoutes.ts

import express from "express";
import BrandController from "../controllers/brandController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {upload} from "../middlewares/upload";

const router = express.Router();

// Membuat brand baru (dengan autentikasi)
router.post("/", authMiddleware, upload.single("image"), BrandController.createBrand);

// Mendapatkan semua brand dengan paginasi
router.get("/", BrandController.getBrands);

// Mendapatkan detail brand berdasarkan ID
router.get("/:id", BrandController.getBrandById);

// Memperbarui brand berdasarkan ID (dengan autentikasi)
router.put("/:id", authMiddleware, BrandController.updateBrand);

// Menghapus brand berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, BrandController.deleteBrand);

export default router;
