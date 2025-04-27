import { Router } from 'express';
import { BankTransferController } from '../controllers/bankTransferController';
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.post('/',authMiddleware, BankTransferController.createBankTransfer);
router.put('/:id',authMiddleware, BankTransferController.updateBankTransfer);
router.delete('/:id',authMiddleware, BankTransferController.deleteBankTransfer);
router.get('/',authMiddleware, BankTransferController.getAllBankTransfers);

export default router;
