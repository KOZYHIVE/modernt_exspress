// controllers/UserController.ts

import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { uploadFile } from "../utils/upload_file";

class UserController {
  // Fungsi untuk membuat pengguna baru
  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, phone, role, status, otp } = req.body;

      if (!username || !email || !password || !otp) {
        return res.status(400).json({ error: "Username, email, password, and OTP are required" });
      }

      const image = req.file;
      let uploadResult;
      if (image && image.buffer) {
        uploadResult = await uploadFile({
          fileBuffer: image.buffer,
          filename: image.filename,
          mimeType: image.mimetype,
        });
      }

      if(!uploadResult) {
        return res.status(500).json({ error: "Unauthorized: Image not uploaded" });
      }


      const newUser = await UserModel.create({
        username,
        email,
        password,
        phone,
        secure_url_profile: uploadResult.secure_url,
        public_url_profile: uploadResult.url,
        role,
        status,
        otp,
      });

      res.status(201).json({ statusCode: 201, message: "User created successfully", data: newUser });
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
      const { id } = req.params;
      const { username, email, password, phone, role, status, otp } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const image = req.file;
      let uploadResult;
      if (image && image.buffer) {
        uploadResult = await uploadFile({
          fileBuffer: image.buffer,
          filename: image.filename,
          mimeType: image.mimetype,
        });
      }

      if(!uploadResult) {
        return res.status(500).json({ error: "Unauthorized: Image not uploaded" });
      }


      const updatedUser = await UserModel.update(Number(id), {
        username,
        email,
        password,
        phone,
        secure_url_profile: uploadResult.secure_url,
        public_url_profile: uploadResult.url,
        role,
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