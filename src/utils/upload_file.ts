import {Readable} from 'stream';
import cloudinary from './cloud';

// Tipe data untuk parameter yang digunakan pada upload file
interface UploadFileOptions {
    fileBuffer: Buffer;
    filename: string;
    mimeType: string;
}

// Tipe data untuk hasil upload
interface UploadResult {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    url: string;
    secure_url: string;
    created_at: string;
    // Properti tambahan jika diperlukan
}

// Fungsi upload file buffer ke Cloudinary
export const uploadFile = async ({fileBuffer, filename, mimeType}: UploadFileOptions): Promise<UploadResult> => {
    try {
        // Menunggu upload file buffer ke Cloudinary dan mengembalikan result
        return await new Promise<UploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',  // Cloudinary will auto-detect the file type
                    public_id: filename,    // You can make this dynamic or add a unique timestamp
                    format: mimeType.split('/')[1] || 'jpg',// Extract format from mime type
                    asset_folder: 'dolan_lur' // folder
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (result) {
                            resolve(result); // Pastikan result tidak undefined
                        } else {
                            reject(new Error("Upload failed: result is undefined"));
                        }
                    }
                }
            );

            // Stream buffer to Cloudinary
            const bufferStream = Readable.from(fileBuffer);
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        throw error;  // Rethrow error to be handled by the caller
    }
};