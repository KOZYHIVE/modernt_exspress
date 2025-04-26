// src/routes/AddressDeliveryRoutes.ts

import express from "express";
import AddressDeliveryController from "../controllers/addressDeliveryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Route untuk membuat detail pengguna baru (tidak perlu autentikasi)
router.post("/", authMiddleware, AddressDeliveryController.createAddressDelivery);

// Route untuk mendapatkan detail pengguna berdasarkan ID (memerlukan autentikasi)
router.get("/:id", authMiddleware, AddressDeliveryController.getAddressDeliveryById);

// Route untuk memperbarui detail pengguna berdasarkan ID (memerlukan autentikasi)
router.put("/:id", authMiddleware, AddressDeliveryController.updateAddressDelivery);

// Route untuk menghapus detail pengguna berdasarkan ID (memerlukan autentikasi)
router.delete("/:id", authMiddleware, AddressDeliveryController.deleteAddressDelivery);

// Route untuk mendapatkan daftar detail pengguna dengan paginasi (memerlukan autentikasi)
router.get("/", authMiddleware, AddressDeliveryController.getAddressDeliverys);

export default router;