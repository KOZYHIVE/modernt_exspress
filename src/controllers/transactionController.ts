// controllers/TransactionController.ts

import { Request, Response } from "express";
import { TransactionModel } from "../models/transactionModel";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import {uploadFile} from "../utils/upload_file";


class TransactionController {
    // Fungsi untuk membuat transaksi baru
    static async createTransaction(req: Request, res: Response) {
        try {
            const { user_id, rental_id, payment_status, transaction_date, payment_method, total_amount } = req.body;
            const image = req.file; // File yang di-upload

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

            const newTransaction = await TransactionModel.create({
                user_id: Number(user_id),
                rental_id: Number(rental_id),
                payment_status,
                transaction_date: new Date(transaction_date),
                payment_method,
                total_amount: Number(total_amount),
                public_url_image: uploadResult.url,
                secure_url_image: uploadResult.secure_url,
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
            const { user_id, rental_id, payment_status, transaction_date, payment_method, total_amount } = req.body;
            const image = req.file; // File yang di-upload

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

            const newTransaction = await TransactionModel.update(Number(id),{
                user_id: Number(user_id),
                rental_id: Number(rental_id),
                payment_status,
                transaction_date: new Date(transaction_date),
                payment_method,
                total_amount: Number(total_amount),
                public_url_image: uploadResult.url,
                secure_url_image: uploadResult.secure_url,
            });

            res.status(201).json({ message: "Transaction created successfully", data: newTransaction });
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({ error: "Failed to create transaction" });
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
