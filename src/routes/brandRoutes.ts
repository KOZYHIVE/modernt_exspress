// routes/brandRoutes.ts

import express from "express";
import BrandController from "../controllers/brandController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Membuat brand baru (dengan autentikasi dan upload gambar)
router.post("/", authMiddleware, upload.single("image"), BrandController.createBrand);

// Mendapatkan semua brand dengan paginasi
router.get("/", authMiddleware, BrandController.getBrands);

// Mendapatkan detail brand berdasarkan ID
router.get("/:id", authMiddleware, BrandController.getBrandById);

// Memperbarui brand berdasarkan ID (dengan autentikasi dan upload gambar)
router.put("/:id", authMiddleware, upload.single("image"), BrandController.updateBrand);

// Menghapus brand berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, BrandController.deleteBrand);

export default router;