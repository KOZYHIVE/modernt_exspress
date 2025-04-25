import express from "express";
import AuthController from "../controllers/authController";

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

// Route untuk logout
router.post("/logout", AuthController.logout);

export default router;