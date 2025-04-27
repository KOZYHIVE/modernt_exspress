import { Request, Response } from 'express';
import { BankTransferModel } from '../models/bankTransferModel';

export class BankTransferController {
    // Controller untuk membuat bank transfer baru
    static async createBankTransfer(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }
            const { name_bank, number } = req.body;
            const newBankTransfer = await BankTransferModel.create({ user_id, name_bank, number });
            res.status(201).json({ statusCode: 200, message: "Bank transfer created successfully", data: newBankTransfer });
        } catch (error) {
            console.error("Error creating bank transfer:", error);
            res.status(500).json({ error: "Failed to create bank transfer" });
        }
    }

    // Controller untuk memperbarui bank transfer berdasarkan ID
    static async updateBankTransfer(req: Request, res: Response) {
        try {
            // Ambil user_id dari middleware (JWT)
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized: User ID not found in token" });
            }
            const { id } = req.params;
            const { name_bank, number } = req.body;
            const updatedBankTransfer = await BankTransferModel.update(Number(id), { user_id, name_bank, number });
            res.status(200).json({ statusCode: 200, message: "Bank transfer updated successfully", data: updatedBankTransfer });
        } catch (error) {
            console.error("Error updating bank transfer:", error);
            // @ts-ignore
            res.status(500).json({ error: error.message || "Failed to update bank transfer" });
        }
    }

    // Controller untuk menghapus bank transfer berdasarkan ID
    static async deleteBankTransfer(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await BankTransferModel.delete(Number(id));
            res.status(200).json({ statusCode: 200, message: "Bank transfer deleted successfully" });
        } catch (error) {
            console.error("Error deleting bank transfer:", error);
            res.status(500).json({ error: "Failed to delete bank transfer" });
        }
    }

    // Controller untuk mendapatkan daftar bank transfer dengan paginasi
    static async getAllBankTransfers(req: Request, res: Response) {
        try {
            const { itemsPerPage = 10, skip = 0 } = req.query;
            const bankTransfers = await BankTransferModel.getAll({
                itemsPerPage: Number(itemsPerPage),
                skip: Number(skip),
            });
            res.status(200).json({ statusCode: 200, data: bankTransfers });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch bank transfers" });
        }
    }
}
