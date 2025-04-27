// routes/userRoutes.ts

import express from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Membuat pengguna baru (dengan autentikasi dan upload gambar)
router.post("/", authMiddleware, upload.single("image"), UserController.createUser);

// Mendapatkan semua pengguna dengan paginasi
router.get("/", authMiddleware, UserController.getUsers);

// Mendapatkan detail pengguna berdasarkan ID
router.get("/:id", authMiddleware, UserController.getUserById);

// Mendapatkan pengguna berdasarkan username
router.get("/username/:username", authMiddleware, UserController.getUserByUsername);

// Mendapatkan pengguna berdasarkan email
router.get("/email/:email", authMiddleware, UserController.getUserByEmail);

// Memperbarui pengguna berdasarkan ID (dengan autentikasi dan upload gambar)
router.put("/:id", authMiddleware, upload.single("image"), UserController.updateUser);

// Menghapus pengguna berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;