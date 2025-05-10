import { Readable } from 'stream';
import cloudinary from './cloud';

interface UploadFileOptions {
    fileBuffer: Buffer;
    filename: string;
    mimeType: string;
}

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
}

export const uploadFile = async ({
                                     fileBuffer,
                                     filename,
                                     mimeType,
                                 }: UploadFileOptions): Promise<UploadResult> => {
    try {
        const actualMimeType = mimeType === "application/octet-stream"
            ? "image/jpeg"
            : mimeType;

        return await new Promise<UploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    public_id: filename,
                    format: actualMimeType.split('/')[1] || 'jpg',
                    asset_folder: 'dolan_lur',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve(result);
                    } else {
                        reject(new Error("Upload failed: result is undefined"));
                    }
                }
            );

            const bufferStream = Readable.from(fileBuffer);
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        throw error;
    }
};