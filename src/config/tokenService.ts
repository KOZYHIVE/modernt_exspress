import prisma from '../config/prisma';

class TokenService {
    // 🔥 Simpan token ke database
    async storeToken(token: string) {
        try {
            // ✅ Validasi apakah token benar-benar string
            if (!token || typeof token !== "string") {
                throw new Error("❌ Token harus berupa string dan tidak boleh kosong!");
            }

            console.log("🛠 Menyimpan token:", token);

            const newToken = await prisma.token.create({
                data: { token },
            });

            return {
                success: true,
                message: "✅ Token stored successfully",
                data: newToken,
            };
        } catch (error: any) {
            console.error("❌ Error storing token:", error);
            return {
                success: false,
                message: error.message || "❌ Internal Server Error",
            };
        }
    }

    // 🔥 Ambil semua token dari database
    async getTokens() {
        try {
            console.log("📌 Mengambil semua token...");

            const tokens = await prisma.token.findMany();

            return {
                success: true,
                message: "✅ Tokens fetched successfully",
                data: tokens,
            };
        } catch (error: any) {
            console.error("❌ Error fetching tokens:", error);
            return {
                success: false,
                message: error.message || "❌ Internal Server Error",
            };
        }
    }
}

export default new TokenService();
