// src/services/UserService.ts

import prisma from '../config/prisma';
import bcrypt from "bcrypt";
import { Role, UserStatus } from "@prisma/client";

export class UserService {
  // Fungsi untuk membuat pengguna baru
  static async createUser(data: {
    username: string;
    email: string;
    password: string;
    role?: Role;
    status?: UserStatus;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || Role.user,
        status: data.status || UserStatus.active,
      },
      select: {
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  // Fungsi untuk mendapatkan pengguna berdasarkan ID
  static async getUser(id: number) {
    return prisma.user.findMany({
      where: { id },
      include: {
        detail_user: true,
        logs: true,
        refresh_token: true,
        banner: true,
        rental: true,
        transaction: true,
      },
    });
  }

  // Fungsi untuk memperbarui pengguna berdasarkan ID
  static updateUser(
      id: number,
      data: Partial<{ email: string; username: string; role: Role; status: UserStatus; password?: string }>
  ) {
    // Hapus password dari data sebelum update
    const { password, ...updateData } = data;

    return prisma.user.update({
      where: { id },
      data: updateData, // Pastikan hanya properti yang diperbolehkan yang diperbarui
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }


  static updateOTP(
      id: number,
      data: { otp: number}
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  // Fungsi untuk menghapus pengguna berdasarkan ID
  static async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }

  // Fungsi untuk mendapatkan daftar pengguna dengan paginasi
  static async getUsers(payload: { itemsPerPage: number; skip: number }) {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
      skip: payload.skip,
      take: payload.itemsPerPage,
    });
  }

  static getUserByEmail = (email: string) => {
    if (!email) {
      throw new Error("Email must be provided");
    }

    return prisma.user.findUnique({
      where: {
        email: email, // Ensure email is properly passed here
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
        otp: true,
      },
    });
  };


  static getUserById = (id: number) => {
    return prisma.user.findUnique({
      where: {id: id},
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        role: true,
      },
    });
  };

  static getAllUsers = async (page: number, pagesize: number) => {
    const skip = (page - 1) * pagesize; // Hitung data yang dilewatkan
    const take = pagesize; // Jumlah data per halaman

    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: false,
        role: true,
      },
      skip: skip, // Mulai dari data keberapa
      take: take, // Ambil berapa data
    });
  };


  static countAllUsers = () => {
    return prisma.user.count();
  };

  static countUsers = () => {
    return prisma.user.count();
  };

  static searchUser = (search: string) => {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search
            }
          },
          {
            email: {
              contains: search
            }
          }
        ]
      }
    })
  }
}