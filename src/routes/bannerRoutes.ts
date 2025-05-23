// routes/bannerRoutes.ts

import express from "express";
import BannerController from "../controllers/bannerController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Membuat banner baru (dengan autentikasi dan upload gambar)
router.post("/", authMiddleware, upload.single("image"), BannerController.createBanner);

// Mendapatkan semua banner dengan paginasi
router.get("/", authMiddleware, BannerController.getBanners);

// Mendapatkan detail banner berdasarkan ID
router.get("/:id", authMiddleware, BannerController.getBannerById);

// Mendapatkan semua banner berdasarkan user_id
router.get("/user/:user_id", authMiddleware, BannerController.getBannersByUserId);

// Mendapatkan semua banner berdasarkan vehicle_id
router.get("/vehicle/:vehicle_id", authMiddleware, BannerController.getBannersByVehicleId);

// Memperbarui banner berdasarkan ID (dengan autentikasi dan upload gambar)
router.put("/:id", authMiddleware, upload.single("image"), BannerController.updateBanner);

// Menghapus banner berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, BannerController.deleteBanner);

export default router;