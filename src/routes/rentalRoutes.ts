// routes/rentalRoutes.ts

import express from "express";
import RentalController from "../controllers/rentalController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Membuat rental baru (dengan autentikasi)
router.post("/", authMiddleware, RentalController.createRental);

// Mendapatkan semua rental dengan paginasi
router.get("/", authMiddleware, RentalController.getRentals);

// Mendapatkan detail rental berdasarkan ID
router.get("/:id", authMiddleware, RentalController.getRentalById);

// Memperbarui rental berdasarkan ID (dengan autentikasi)
router.put("/:id", authMiddleware, RentalController.updateRental);

// Menghapus rental berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, RentalController.deleteRental);

export default router;
