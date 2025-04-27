// routes/addressRoutes.ts

import express from "express";
import AddressController from "../controllers/addressController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Membuat alamat baru (dengan autentikasi)
router.post("/", authMiddleware, AddressController.createAddress);

// Mendapatkan semua alamat dengan paginasi
router.get("/", authMiddleware, AddressController.getAddresses);

// Mendapatkan detail alamat berdasarkan ID
router.get("/:id", authMiddleware, AddressController.getAddressById);

// Mendapatkan semua alamat berdasarkan user_id
router.get("/user/:user_id", authMiddleware, AddressController.getAddressesByUserId);

// Memperbarui alamat berdasarkan ID (dengan autentikasi)
router.put("/:id", authMiddleware, AddressController.updateAddress);

// Menghapus alamat berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, AddressController.deleteAddress);

export default router;