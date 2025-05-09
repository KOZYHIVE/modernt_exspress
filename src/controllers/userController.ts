// controllers/UserController.ts

import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { uploadFile } from "../utils/upload_file";
import bcrypt from "bcrypt";

class UserController {
  // Fungsi untuk mendapatkan pengguna berdasarkan ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await UserModel.getById(Number(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ statusCode: 200, message: "User retrieved successfully", data: user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan ID
  static async getUserByAccess(req: Request, res: Response) {
    try {
      // Ambil user_id dari middleware (JWT)
      const id = req.user?.userId;

      if (!id) {
        return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
      }

      const user = await UserModel.getById(Number(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ statusCode: 200, message: "User retrieved successfully", data: user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan username
  static async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      const user = await UserModel.getByUsername(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ statusCode: 200, message: "User retrieved successfully", data: user });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan email
  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ statusCode: 200, message: "User retrieved successfully", data: user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  // Fungsi untuk memperbarui pengguna berdasarkan ID
  static async updateUser(req: Request, res: Response) {
    try {
      // Ambil user_id dari middleware (JWT)
      const id = req.user?.userId;

      if (!id) {
        return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
      }
      const {
        username,
        full_name,
        email,
        current_password, // Password lama
        new_password,     // Password baru
        phone,
        status,
        otp,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Ambil data pengguna dari database berdasarkan ID
      const user = await UserModel.getById(Number(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validasi password lama jika ada permintaan untuk mengubah password
      if (current_password && new_password) {
        const isPasswordValid = await bcrypt.compare(current_password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(new_password, 10); // Salt rounds = 10
        req.body.password = hashedPassword; // Ganti password baru dengan versi ter-hash
      } else if (new_password && !current_password) {
        // Jika hanya password baru tanpa password lama, kembalikan error
        return res.status(400).json({ error: "Current password is required to update the password" });
      }

      // Handle upload gambar profil jika ada
      const image = req.file;
      let uploadResult;
      if (image && image.buffer) {
        uploadResult = await uploadFile({
          fileBuffer: image.buffer,
          filename: image.filename,
          mimeType: image.mimetype,
        });
      }

      if (!uploadResult && image) {
        return res.status(500).json({ error: "Unauthorized: Image not uploaded" });
      }

      // Perbarui data pengguna di database
      const updatedUser = await UserModel.update(Number(id), {
        username,
        full_name,
        email,
        password: req.body.password || user.password, // Gunakan password baru jika ada
        phone,
        secure_url_profile: uploadResult?.secure_url,
        public_url_profile: uploadResult?.url,
        status,
        otp,
      });

      res.status(200).json({ statusCode: 200, message: "User updated successfully", data: updatedUser });
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

      await UserModel.delete(Number(id));
      res.status(200).json({ statusCode: 200, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }

  // Fungsi untuk mendapatkan daftar pengguna dengan paginasi
  static async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, pagesize = 10 } = req.query;

      const skip = (Number(page) - 1) * Number(pagesize);
      const take = Number(pagesize);

      const users = await UserModel.getAll({ itemsPerPage: take, skip });
      res.status(200).json({
        statusCode: 200,
        message: "Users retrieved successfully",
        data: users,
        pagination: {
          page: Number(page),
          pagesize: Number(pagesize),
        },
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }
}

export default UserController;