// src/routes/detailUserRoutes.ts

import express from "express";
import DetailUserController from "../controllers/detailUserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Route untuk membuat detail pengguna baru (tidak perlu autentikasi)
router.post("/", authMiddleware, DetailUserController.createDetailUser);

// Route untuk mendapatkan detail pengguna berdasarkan ID (memerlukan autentikasi)
router.get("/:id", authMiddleware, DetailUserController.getDetailUserById);

// Route untuk memperbarui detail pengguna berdasarkan ID (memerlukan autentikasi)
router.put("/", authMiddleware, DetailUserController.updateDetailUser);

// Route untuk menghapus detail pengguna berdasarkan ID (memerlukan autentikasi)
router.delete("/:id", authMiddleware, DetailUserController.deleteDetailUser);

// Route untuk mendapatkan daftar detail pengguna dengan paginasi (memerlukan autentikasi)
router.get("/", authMiddleware, DetailUserController.getDetailUsers);

export default router;