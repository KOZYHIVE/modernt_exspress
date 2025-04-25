// controllers/TransactionController.ts

import { Request, Response } from "express";
import { TransactionModel } from "../models/transactionModel";
import { PaymentStatus, PaymentMethod } from "@prisma/client";


class TransactionController {
    // Fungsi untuk membuat transaksi baru
    static async createTransaction(req: Request, res: Response) {
        try {
            const { user_id, rental_id, payment_status, transaction_date, payment_method, total_amount } = req.body;
            const image = req.file; // File yang di-upload

            if (!user_id || !rental_id || !payment_status || !transaction_date || !payment_method || !total_amount) {
                return res.status(400).json({ error: "All required fields must be provided" });
            }

            // Validasi status pembayaran
            if (!(payment_status in PaymentStatus)) {
                return res.status(400).json({ error: "Invalid payment status" });
            }

            // Validasi metode pembayaran
            if (!(payment_method in PaymentMethod)) {
                return res.status(400).json({ error: "Invalid payment method" });
            }

            // Simpan path gambar jika ada
            const local_image_path = image ? `images/${image.filename}` : undefined;

            const newTransaction = await TransactionModel.create({
                user_id: Number(user_id),
                rental_id: Number(rental_id),
                payment_status: payment_status as PaymentStatus,
                transaction_date: new Date(transaction_date),
                payment_method: payment_method as PaymentMethod,
                total_amount: Number(total_amount),
                local_image_path,
            });

            res.status(201).json({ message: "Transaction created successfully", data: newTransaction });
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({ error: "Failed to create transaction" });
        }
    }

    // Fungsi untuk mendapatkan transaksi berdasarkan ID
    static async getTransactionById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Transaction ID is required" });
            }

            const transaction = await TransactionModel.getById(Number(id));
            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            res.status(200).json({ message: "Transaction retrieved successfully", data: transaction });
        } catch (error) {
            console.error("Error retrieving transaction:", error);
            res.status(500).json({ error: "Failed to retrieve transaction" });
        }
    }

    // Fungsi untuk memperbarui transaksi berdasarkan ID
    static async updateTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id) {
                return res.status(400).json({ error: "Transaction ID is required" });
            }

            // Validasi payment status jika ada perubahan
            if (data.payment_status && !(data.payment_status in PaymentStatus)) {
                return res.status(400).json({ error: "Invalid payment status" });
            }

            // Validasi payment method jika ada perubahan
            if (data.payment_method && !(data.payment_method in PaymentMethod)) {
                return res.status(400).json({ error: "Invalid payment method" });
            }

            const updatedTransaction = await TransactionModel.update(Number(id), data);

            res.status(200).json({ message: "Transaction updated successfully", data: updatedTransaction });
        } catch (error) {
            console.error("Error updating transaction:", error);
            res.status(500).json({ error: "Failed to update transaction" });
        }
    }

    // Fungsi untuk menghapus transaksi berdasarkan ID
    static async deleteTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Transaction ID is required" });
            }

            await TransactionModel.delete(Number(id));
            res.status(200).json({ message: "Transaction deleted successfully" });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({ error: "Failed to delete transaction" });
        }
    }

    // Fungsi untuk mendapatkan daftar transaksi dengan paginasi
    static async getTransactions(req: Request, res: Response) {
        try {
            const { page = 1, pagesize = 10 } = req.query;

            const skip = (Number(page) - 1) * Number(pagesize);
            const take = Number(pagesize);

            const transactions = await TransactionModel.getAll({ itemsPerPage: take, skip });

            res.status(200).json({
                message: "Transactions retrieved successfully",
                data: transactions,
                pagination: {
                    page: Number(page),
                    pagesize: Number(pagesize),
                },
            });
        } catch (error) {
            console.error("Error retrieving transactions:", error);
            res.status(500).json({ error: "Failed to retrieve transactions" });
        }
    }
}

export default TransactionController;
