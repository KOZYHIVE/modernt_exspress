// src/controllers/UserController.ts

import { Request, Response } from "express";
import { UserService } from "../models/userModel";

class UserController {
  // Fungsi untuk membuat pengguna baru
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, role, status, url_profile, secure_url_profile, public_url_profile } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }

      const newUser = await UserService.createUser({
        username,
        email,
        password,
      });

      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await UserService.getUser(Number(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Fungsi untuk memperbarui pengguna berdasarkan ID
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Cegah perubahan password
      if (data.password) {
        return res.status(403).json({ error: "Updating password is not allowed" });
      }

      // Perbarui pengguna
      const updatedUser = await UserService.updateUser(Number(id), data);
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  // Fungsi untuk memperbarui pengguna berdasarkan ID
  static async updateOTP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { otp } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const updatedUser = await UserService.updateOTP(Number(id), { otp });
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  // Fungsi untuk menghapus pengguna berdasarkan ID
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await UserService.deleteUser(Number(id));
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }

  // Fungsi untuk mendapatkan daftar pengguna dengan paginasi
  static async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, pagesize = 10 } = req.query;

      const users = await UserService.getAllUsers(Number(page), Number(pagesize));
      const totalUsers = await UserService.countAllUsers();

      res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
        pagination: {
          page: Number(page),
          pagesize: Number(pagesize),
          total: totalUsers,
        },
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }

  // Fungsi untuk mencari pengguna berdasarkan username atau email
  static async searchUsers(req: Request, res: Response) {
    try {
      // Ambil parameter pencarian dari query string
      const searchQuery = req.query.q as string;

      // Validasi parameter pencarian
      if (typeof searchQuery !== "string" || !searchQuery.trim()) {
        return res.status(400).json({
          code: 400,
          message: "Parameter pencarian diperlukan dan harus berupa string.",
        });
      }

      // Dapatkan pengguna yang sedang login (authUser)
      const authUser = req.user; // Pastikan middleware autentikasi menambahkan `req.user`

      if (!authUser) {
        return res.status(403).json({
          code: 403,
          message: "Pengguna tidak valid",
        });
      }

      // Cari pengguna berdasarkan query
      const users = await UserService.searchUser(searchQuery);

      // Filter pengguna agar tidak termasuk pengguna yang sedang login
      const filteredUsers = users.filter((usr: { id: any; }) => usr.id !== authUser.id);

      // Kirim respons sukses
      res.status(200).json({
        code: 200,
        message: "Pengguna berhasil dikembalikan.",
        data: {
          users: filteredUsers,
        },
      });
    } catch (error: any) {
      console.error("Error searching users:", error);
      res.status(500).json({
        code: 500,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

export default UserController;