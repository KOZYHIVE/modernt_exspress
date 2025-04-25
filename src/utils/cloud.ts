import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Menggunakan process.env untuk mengakses variabel lingkungan
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

// Export cloudinary instance agar dapat digunakan di seluruh aplikasi
export default cloudinary;