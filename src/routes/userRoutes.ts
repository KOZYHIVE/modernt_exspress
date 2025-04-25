import express from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Route untuk membuat pengguna baru (tidak perlu autentikasi)
router.post("/", UserController.createUser);

// Route untuk mendapatkan pengguna berdasarkan ID (memerlukan autentikasi)
router.get("/:id", authMiddleware, UserController.getUserById);

// Route untuk memperbarui pengguna berdasarkan ID (memerlukan autentikasi)
router.put("/:id", authMiddleware, UserController.updateUser);

// Route untuk memperbarui pengguna berdasarkan ID (memerlukan autentikasi)
router.put("/otp/:id", authMiddleware, UserController.updateOTP);

// Route untuk menghapus pengguna berdasarkan ID (memerlukan autentikasi)
router.delete("/:id", authMiddleware, UserController.deleteUser);

// Route untuk mendapatkan daftar pengguna dengan paginasi (memerlukan autentikasi)
router.get("/", authMiddleware, UserController.getUsers);

// Route untuk mencari pengguna (memerlukan autentikasi)
router.get("/search", authMiddleware, UserController.searchUsers);

export default router;