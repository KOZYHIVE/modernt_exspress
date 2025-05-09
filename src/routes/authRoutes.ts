import express from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = express.Router();

// Route untuk registrasi
router.post("/register", AuthController.register);

// Route untuk login
router.post("/login", AuthController.login);

// Route untuk refresh
router.post("/refresh", AuthController.refreshToken);

// Route untuk lupa password (kirim OTP)
router.post("/forget-password", AuthController.forgetPassword);

// Route untuk reset password menggunakan OTP
router.post("/reset-password", AuthController.resetPassword);

router.use(authMiddleware);

// Route untuk logout
router.post("/logout", AuthController.logout);

// Mendapatkan detail pengguna berdasarkan ID
router.get("/user", UserController.getUserByAccess);

export default router;