import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});
export class CloudinaryService {
    static async uploadImage(filePath, folder = 'dgiir_complaints') {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder,
                resource_type: 'auto',
            });
            // Remove file from local server after upload
            fs.unlinkSync(filePath);
            return result;
        }
        catch (error) {
            // Remove file from local server if upload fails
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw new AppError('Failed to upload image to Cloudinary', 500);
        }
    }
    static async deleteImage(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
        }
    }
}
//# sourceMappingURL=cloudinary.service.js.map