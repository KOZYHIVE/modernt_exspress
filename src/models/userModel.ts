// models/UserModel.ts

import prisma from '../config/prisma';
import {Role, Status} from "@prisma/client";

export class UserModel {
  // Fungsi untuk membuat pengguna baru
  static async create(data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
    secure_url_profile?: string;
    public_url_profile?: string;
    role?: Role;
    status?: Status;
    otp?: string;
  }) {
    const newUser = await prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return newUser;
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan ID
  static async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        otp: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan username
  static async getByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        otp: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan email
  static async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password:true,
        phone: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        otp: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // Fungsi untuk memperbarui pengguna berdasarkan ID
  static async update(id: number, data: {
    username?: string;
    email?: string;
    password?: string;
    phone?: string;
    secure_url_profile?: string;
    public_url_profile?: string;
    role?: Role;
    status?: Status;
    otp?: string;
  }) {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new Error("User not found");
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        otp: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // Fungsi untuk menghapus pengguna berdasarkan ID
  static async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  // Fungsi untuk mendapatkan daftar pengguna dengan paginasi
  static async getAll(payload: { itemsPerPage: number; skip: number }) {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        secure_url_profile: true,
        public_url_profile: true,
        role: true,
        status: true,
        otp: true,
        created_at: true,
        updated_at: true,
      },
      skip: payload.skip,
      take: payload.itemsPerPage,
    });
  }
}