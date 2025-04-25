import { Readable } from 'stream';
import cloudinary from './cloud';
import mime from 'mime-types';

// Tipe data untuk parameter yang digunakan pada upload file
interface UploadFileOptions {
    fileBuffer: Buffer;
    filename: string;
    mimeType: string;
    assetFolder?: string; // Optional folder
}

// Tipe data untuk hasil upload
interface UploadResult extends Record<string, any> {
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
}

// Fungsi upload file buffer ke Cloudinary
export const uploadFile = async ({
                                     fileBuffer,
                                     filename,
                                     mimeType
                                 }: UploadFileOptions): Promise<UploadResult> => {
    try {
        return await new Promise<UploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    public_id: `${uuidv4()}-${filename}`,
                    format: mime.extension(mimeType) || 'jpg' || 'png',
                },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading file to Cloudinary:", error);
                        reject(new Error(`Failed to upload file: ${error.message}`));
                    } else {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Upload failed: result is undefined"));
                        }
                    }
                }
            );

            const bufferStream = Readable.from(fileBuffer);
            bufferStream.pipe(uploadStream);

            bufferStream.on('end', () => {
                console.log("Buffer stream ended successfully.");
            });
        });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        throw error;
    }
};