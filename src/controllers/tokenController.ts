import { Request, Response } from 'express';
import TokenService from '../config/tokenService';

class TokenController {
    async storeToken(req: Request, res: Response) {
        try {
            console.log("📥 Request body:", req.body);

            const { token } = req.body;

            if (!token || typeof token !== "string") {
                return res.status(400).json({ success: false, message: "❌ Token harus berupa string dan tidak boleh kosong!" });
            }

            const response = await TokenService.storeToken(token);

            res.status(201).json(response);
        } catch (error: any) {
            console.error("❌ Error storing token:", error);
            res.status(500).json({ success: false, message: error.message || "❌ Internal Server Error" });
        }
    }

    async getTokens(req: Request, res: Response) {
        try {
            console.log("📌 Mengambil semua token...");

            const response = await TokenService.getTokens();

            res.status(200).json(response);
        } catch (error: any) {
            console.error("❌ Error fetching tokens:", error);
            res.status(500).json({ success: false, message: error.message || "❌ Internal Server Error" });
        }
    }
}

export default new TokenController();
