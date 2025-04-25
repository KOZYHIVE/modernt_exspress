// src/controllers/AuthController.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserService } from "../models/userModel";
import RefreshTokenModel from "../models/refreshToken";
import {SendEmailResetPassword} from "../utils/SendEmailResetPassword";
import prisma from '../config/prisma';

class AuthController {
    // Fungsi untuk registrasi pengguna baru
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Cek apakah email sudah terdaftar
            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: "Email already registered" });
            }

            // Buat pengguna baru
            const newUser = await UserService.createUser({
                username,
                email,
                password,
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.error("Error during registration:", error);
            res.status(500).json({ error: "Failed to register user" });
        }
    }

    // Fungsi untuk login pengguna
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            // Cari pengguna berdasarkan email
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Verifikasi password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            // Generate token
            const payload = { userId: user.id, email: user.email };
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN!, { expiresIn: "10m" });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN!, { expiresIn: "4h" });

            // Simpan refresh token ke database menggunakan RefreshTokenModel
            await RefreshTokenModel.create(user.id, refreshToken);

            // Simpan refresh token ke cookie
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 4 * 60 * 60 * 1000, // 4 hours
            });

            res.status(200).json({ message: "Login successful", accessToken });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ error: "Failed to login" });
        }
    }

    // Fungsi untuk refresh token
    static async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies["refresh_token"];

            if (!refreshToken) {
                return res.status(400).json({ error: "Refresh token not found in cookies" });
            }

            // Cari refresh token di database menggunakan RefreshTokenModel
            const storedToken = await RefreshTokenModel.findToken(refreshToken);
            if (!storedToken) {
                return res.status(403).json({ error: "Invalid refresh token" });
            }

            // Decode refresh token
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN!) as { userId: number };
            } catch (error) {
                return res.status(403).json({ error: "Invalid or expired refresh token" });
            }

            // Cari pengguna berdasarkan ID dari refresh token
            const user = await UserService.getUserById(decoded.userId);
            if (!user) {
                return res.status(403).json({ error: "User not found for this refresh token" });
            }

            // Generate new access token
            const payload = { userId: user.id, email: user.email };
            const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN!, { expiresIn: "10m" });

            // Set new access token ke cookie
            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({ message: "New access token generated", accessToken: newAccessToken });
        } catch (error) {
            console.error("Error refreshing token:", error);
            res.status(500).json({ error: "Failed to refresh token" });
        }
    }

    // Fungsi untuk logout
    static async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies["refresh_token"];

            if (!refreshToken) {
                return res.status(400).json({ error: "No refresh token found" });
            }

            // Hapus refresh token dari database menggunakan RefreshTokenModel
            await RefreshTokenModel.deleteToken(refreshToken);

            // Hapus refresh token dari cookie
            res.clearCookie("refresh_token");
            res.clearCookie("access_token");

            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.error("Error during logout:", error);
            res.status(500).json({ error: "Failed to logout" });
        }
    }

    // Fungsi untuk mengirim OTP untuk lupa password
    static async forgetPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            // Cari pengguna berdasarkan email
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.status(200).json({
                    message: "OTP code has been sent to your email if registered.",
                });
            }

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

            // Simpan OTP di database
            await prisma.user.update({
                where: { email },
                data: { otp }, // Nilai OTP langsung disimpan sebagai number
            });

            // Buat konten email dalam format HTML
            const emailHtml = `
      <h1>Reset Password</h1>
      <p>Use the OTP below to reset your password:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 15 minutes.</p>
    `;

            // Kirim email dengan OTP
            await SendEmailResetPassword(
                email,
                "Reset Password",
                `Use this OTP to reset your password: ${otp}`,
                emailHtml
            );

            res.status(200).json({
                message: "Reset password link has been sent to your email if registered.",
            });
        } catch (error) {
            console.error("Error sending OTP:", error);
            res.status(500).json({ error: "Failed to send OTP" });
        }
    }

    // Fungsi untuk reset password menggunakan OTP
    static async resetPassword(req: Request, res: Response) {
        try {
            const { email, otp, newPassword, confirmNewPassword } = req.body;

            if (!email || !otp || !newPassword || !confirmNewPassword) {
                return res.status(400).json({ error: "All fields are required" });
            }

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ error: "Passwords do not match" });
            }

            // Cari pengguna berdasarkan email
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(403).json({ error: "User not found" });
            }

            // Verifikasi OTP
            // @ts-ignore
            if (user.otp !== parseInt(otp, 10)) {
                return res.status(403).json({ error: "Invalid or expired OTP" });
            }

            // Pastikan kata sandi baru tidak sama dengan kata sandi lama
            const isPasswordSame = await bcrypt.compare(newPassword, user.password);
            if (isPasswordSame) {
                return res.status(400).json({ error: "New password cannot be the same as the old password" });
            }

            // Hash password baru
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password dan hapus OTP
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword, otp: null }, // Nilai null valid karena kolom otp diizinkan null
            });

            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).json({ error: "Failed to reset password" });
        }
    }
}

export default AuthController;