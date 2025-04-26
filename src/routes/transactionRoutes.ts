import express from "express";
import TransactionController from "../controllers/transactionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {upload} from "../middlewares/upload";

const router = express.Router();

// Membuat transaksi baru (dengan autentikasi dan upload gambar)
router.post("/", authMiddleware, upload.single("image"), TransactionController.createTransaction);

// Mendapatkan semua transaksi dengan paginasi
router.get("/", authMiddleware, TransactionController.getTransactions);

// Mendapatkan detail transaksi berdasarkan ID
router.get("/:id", authMiddleware, TransactionController.getTransactionById);

// Memperbarui transaksi berdasarkan ID (dengan autentikasi)
router.put("/:id", authMiddleware, upload.single("image"), TransactionController.updateTransaction);

// Menghapus transaksi berdasarkan ID (dengan autentikasi)
router.delete("/:id", authMiddleware, TransactionController.deleteTransaction);

export default router;
