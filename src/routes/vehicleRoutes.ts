// routes/vehicleRoutes.ts

import express from "express";
import VehicleController from "../controllers/vehicleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Membuat kendaraan baru (dengan autentikasi)
router.post("/", authMiddleware, upload.single("image"), VehicleController.createVehicle);

// Mendapatkan semua kendaraan dengan paginasi
router.get("/", VehicleController.getVehicles);

// Mendapatkan detail kendaraan berdasarkan ID
router.get("/:id", VehicleController.getVehicleById);

// Memperbarui kendaraan berdasarkan ID (dengan autentikasi)
router.put("/:id", authMiddleware, VehicleController.updateVehicle);

// Menghapus kendaraan berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, VehicleController.deleteVehicle);

export default router;
