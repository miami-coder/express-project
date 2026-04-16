import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

class FileService {
    public async saveFile(
        file: Express.Multer.File,
        type: "cars" | "avatars",
    ): Promise<string> {
        try {
            const rootPath = path.resolve("public", "uploads", type);

            await fs.mkdir(rootPath, { recursive: true });

            const fileName = `${uuidv4()}.webp`;
            const filePath = path.join(rootPath, fileName);

            await sharp(file.buffer)
                .resize(1280)
                .webp({ quality: 80 })
                .toFile(filePath);

            return `uploads/${type}/${fileName}`;
        } catch (e) {
            console.error("File saving error:", e);
            throw e;
        }
    }
}

export const fileService = new FileService();
